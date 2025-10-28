local debug = require("modules.utils.shared").debug
local interface = require("modules.interface.client")

local WeaponThread = {}
WeaponThread.__index = WeaponThread

WeaponThread.registry = {}

---@param identifier string
---@return table
function WeaponThread.new(identifier)
	local self = setmetatable({}, WeaponThread)
	self.identifier = identifier
	self.currentWeapon = nil
	self.isInVehicle = false

	WeaponThread.registry[identifier] = self

	-- debug("(WeaponThread:new) Created new instance with identifier: ", identifier)
	return self
end

function WeaponThread:start()
	debug("(WeaponThread:start) Starting weapon thread for: ", self.identifier)

	if GetResourceState('ox_lib') == 'started' then
		-- debug("(WeaponThread) ox_lib detected, using lib.onCache for vehicle state")

		lib.onCache('vehicle', function(vehicle)
			self.isInVehicle = vehicle ~= false
		end)
	else
		-- debug("(WeaponThread) ox_lib not found, using thread for vehicle state")

		CreateThread(function()
			while true do
				Wait(200)
				local ped = PlayerPedId()
				self.isInVehicle = IsPedInAnyVehicle(ped, false)
			end
		end)
	end

	if GetResourceState('ox_inventory') == 'started' then
		-- debug("(WeaponThread) ox_inventory detected, using inventory events")

		AddEventHandler('ox_inventory:currentWeapon', function(currentWeapon)
			if currentWeapon then
				local ammo = 0
				local totalAmmo = 0

				if currentWeapon.metadata then
					ammo = currentWeapon.metadata.ammo or 0
					totalAmmo = currentWeapon.metadata.ammo_reserve or currentWeapon.metadata.durability or 0
				end

				self.currentWeapon = currentWeapon
				interface.updateWeaponState({
					hasWeapon = true,
					ammo = ammo,
					totalAmmo = totalAmmo,
					isInVehicle = self.isInVehicle
				})
			else
				self.currentWeapon = nil
				interface.updateWeaponState({
					hasWeapon = false,
					ammo = 0,
					totalAmmo = 0,
					isInVehicle = self.isInVehicle
				})
			end
		end)

	elseif GetResourceState('qb-inventory') == 'started' or GetResourceState('ps-inventory') == 'started' then
		-- debug("(WeaponThread) QBCore inventory detected, using QB events")

		RegisterNetEvent('weapons:client:SetCurrentWeapon', function(weaponData, shootbool)
			if weaponData and weaponData ~= {} then
				local ammo = 0
				local totalAmmo = 0

				if weaponData.info then
					ammo = weaponData.info.ammo or 0
					-- QBCore'da yedek mermi quality veya ayrı bir field'da tutulabilir
					-- Inventory systemine göre ayarla
					totalAmmo = weaponData.info.quality or 0
				end

				self.currentWeapon = weaponData
				interface.updateWeaponState({
					hasWeapon = true,
					ammo = ammo,
					totalAmmo = totalAmmo,
					isInVehicle = self.isInVehicle
				})
			else
				self.currentWeapon = nil
				interface.updateWeaponState({
					hasWeapon = false,
					ammo = 0,
					totalAmmo = 0,
					isInVehicle = self.isInVehicle
				})
			end
		end)

		RegisterNetEvent('weapons:client:UpdateWeaponAmmo', function(weaponData, ammo)
			if self.currentWeapon then
				if weaponData.info then
					interface.updateWeaponState({
						hasWeapon = true,
						ammo = ammo or 0,
						totalAmmo = weaponData.info.quality or 0,
						isInVehicle = self.isInVehicle
					})
				end
			end
		end)

	else
		-- debug("(WeaponThread) No inventory system detected, using native functions (less accurate)")

		CreateThread(function()
			local lastWeapon = nil
			local lastAmmo = 0
			local lastReserve = 0

			while true do
				Wait(100)

				local ped = PlayerPedId()
				local weapon = GetSelectedPedWeapon(ped)

				if weapon == `WEAPON_UNARMED` or weapon == 0 then
					if lastWeapon then
						lastWeapon = nil
						interface.updateWeaponState({
							hasWeapon = false,
							ammo = 0,
							totalAmmo = 0,
							isInVehicle = self.isInVehicle
						})
					end
					goto continue
				end

				local ammo = GetAmmoInPedWeapon(ped, weapon)
				local ammoType = GetPedAmmoTypeFromWeapon(ped, weapon)
				local totalAmmo = GetPedAmmoByType(ped, ammoType)
				local reserve = math.max(0, totalAmmo - ammo)

				if weapon ~= lastWeapon or ammo ~= lastAmmo or reserve ~= lastReserve then
					interface.updateWeaponState({
						hasWeapon = true,
						ammo = ammo,
						totalAmmo = reserve,
						isInVehicle = self.isInVehicle
					})

					lastWeapon = weapon
					lastAmmo = ammo
					lastReserve = reserve
				end

				::continue::
			end
		end)
	end
end

function WeaponThread:stop()
	-- debug("(WeaponThread:stop) Stopping weapon thread for: ", self.identifier)
	self.currentWeapon = nil
end

---@param identifier string
---@return table|nil
function WeaponThread.get(identifier)
	return WeaponThread.registry[identifier]
end

return WeaponThread

local debug = require("modules.utils.shared").debug

local OdometerThread = {}
OdometerThread.__index = OdometerThread

OdometerThread.registry = {}

local lastLocation = nil
local currentMileage = 0
local fetchedExistingMileage = false
local lastUpdatedMileage = nil
local serverUpdateMileageThreshold = 3
local lastUpdatedMileageServer = nil
local currentVehicle = nil

---@param identifier string
---@return table
function OdometerThread.new(identifier)
	local self = setmetatable({}, OdometerThread)
	self.identifier = identifier
	self.vehicleThreadStarted = false

	OdometerThread.registry[identifier] = self

	return self
end

local function getVehiclePlate(vehicle)
	if not vehicle or not DoesEntityExist(vehicle) then return false end

	local plate = GetVehicleNumberPlateText(vehicle)
	if not plate then return false end

	return string.gsub(plate, "^%s*(.-)%s*$", "%1")
end

function OdometerThread:distanceCheck()
	if not currentVehicle or not DoesEntityExist(currentVehicle) then
		debug("(OdometerThread) distanceCheck: No current vehicle")
		return false
	end

	local vehClass = GetVehicleClass(currentVehicle)
	local ped = PlayerPedId()

	local seat = -2
	for i = -1, GetVehicleMaxNumberOfPassengers(currentVehicle) - 1 do
		if GetPedInVehicleSeat(currentVehicle, i) == ped then
			seat = i
			break
		end
	end

	debug("(OdometerThread) distanceCheck: seat=" .. seat .. ", vehClass=" .. vehClass)

	if seat ~= -1 or vehClass == 13 or vehClass == 14 or vehClass == 15 or vehClass == 16 or vehClass == 17 or vehClass == 21 then
		debug("(OdometerThread) distanceCheck: Failed - not driver or excluded vehicle class")
		return false
	end

	if not lastLocation then
		lastLocation = GetEntityCoords(currentVehicle)
	end

	local plate = getVehiclePlate(currentVehicle)

	if not fetchedExistingMileage then
		currentMileage = Entity(currentVehicle).state.vehicleMileage

		if not currentMileage then
			debug("(OdometerThread) Fetching mileage from server for plate: " .. plate)

			lib.callback("q-hud:server:getOdometer", false, function(data)
				if data and not data.error then
					currentMileage = data.mileage or 0
					debug("(OdometerThread) Received mileage from server: " .. currentMileage .. " km")
				else
					currentMileage = math.random(15000, 150000)
					debug("(OdometerThread) Non-owned vehicle, generated random mileage: " .. currentMileage .. " km")
				end
			end, plate)

			Wait(100)
		else
			debug("(OdometerThread) Got mileage from entity state: " .. currentMileage .. " km")
		end

		Entity(currentVehicle).state:set("vehicleMileage", currentMileage, true)
		debug("(OdometerThread) Set initial entity state for plate " .. plate .. ": " .. currentMileage .. " km")

		fetchedExistingMileage = true
		return true
	end

	local dist = 0
	if IsVehicleOnAllWheels(currentVehicle) and not IsEntityInWater(currentVehicle) then
		dist = #(lastLocation - GetEntityCoords(currentVehicle))
	end

	local distKm = dist / 1000
	currentMileage = currentMileage + distKm
	lastLocation = GetEntityCoords(currentVehicle)
	local roundedMileage = tonumber(string.format("%.1f", currentMileage))

	debug("(OdometerThread) Current mileage: " .. roundedMileage .. " km, Distance traveled: " .. (distKm * 1000) .. " m")

	if roundedMileage ~= lastUpdatedMileage then
		Entity(currentVehicle).state:set("vehicleMileage", roundedMileage, true)
		lastUpdatedMileage = roundedMileage

		if seat == -1 then
			local vehicleNetId = NetworkGetNetworkIdFromEntity(currentVehicle)
			TriggerServerEvent("q-hud:server:syncOdometerWithPassengers", vehicleNetId, roundedMileage)
		end
	end

	if not lastUpdatedMileageServer or math.abs(roundedMileage - lastUpdatedMileageServer) >= serverUpdateMileageThreshold then
		Entity(currentVehicle).state:set("vehicleMileage", roundedMileage, true)
		TriggerServerEvent("q-hud:server:updateOdometer", plate, roundedMileage)
		lastUpdatedMileageServer = roundedMileage
		debug("(OdometerThread) Updated server odometer for plate: " .. plate .. " - " .. roundedMileage .. " km")
	end

	return true
end

function OdometerThread:startVehicleThread()
	if self.vehicleThreadStarted then return end
	self.vehicleThreadStarted = true

	debug("(OdometerThread) Starting vehicle tracking thread for vehicle: " .. tostring(currentVehicle))

	CreateThread(function()
		if not currentVehicle or not DoesEntityExist(currentVehicle) then
			debug("(OdometerThread) No valid vehicle to track")
			self.vehicleThreadStarted = false
			return
		end

		while currentVehicle and DoesEntityExist(currentVehicle) do
			if not self:distanceCheck() then
				debug("(OdometerThread) distanceCheck returned false, breaking thread")
				break
			end

			Wait(1000)
		end

		debug("(OdometerThread) Exited while loop - currentVehicle: " .. tostring(currentVehicle))
		self.vehicleThreadStarted = false
		fetchedExistingMileage = false
		lastUpdatedMileage = nil
		debug("(OdometerThread) Stopped vehicle tracking thread")
	end)
end

function OdometerThread:start()
	debug("(OdometerThread:start) Starting odometer thread for: ", self.identifier)

	if GetResourceState('ox_lib') == 'started' then
		debug("(OdometerThread) Using ox_lib cache for vehicle tracking")

		lib.onCache("vehicle", function(vehicle)
			debug("(OdometerThread) onCache triggered - vehicle: " .. tostring(vehicle))

			if not vehicle and currentVehicle and currentMileage then
				TriggerServerEvent("q-hud:server:updateOdometer", getVehiclePlate(currentVehicle), currentMileage)
				lastLocation = nil
				currentVehicle = nil
				return
			end

			if vehicle then
				currentVehicle = vehicle

				local ped = PlayerPedId()
				local seat = -2
				for i = -1, GetVehicleMaxNumberOfPassengers(vehicle) - 1 do
					if GetPedInVehicleSeat(vehicle, i) == ped then
						seat = i
						break
					end
				end

				if seat ~= -1 then
					local stateMileage = Entity(vehicle).state.vehicleMileage
					if stateMileage then
						currentMileage = stateMileage
						fetchedExistingMileage = true
						debug("(OdometerThread) Passenger synced mileage: " .. stateMileage .. " km")
					end
				end

				self:startVehicleThread()
			end
		end)

		CreateThread(function()
			Wait(500) 
			if cache.vehicle then
				currentVehicle = cache.vehicle
				debug("(OdometerThread) Initial vehicle found: " .. tostring(currentVehicle))
				self:startVehicleThread()
			end
		end)
	else
		debug("(OdometerThread) ox_lib not found, odometer system disabled")
		print("^3[q-hud] WARNING: ox_lib not found, vehicle odometer system will not work!^0")
	end
end

---@param identifier string
---@return table|nil
function OdometerThread.get(identifier)
	return OdometerThread.registry[identifier]
end

function OdometerThread:getOdometerForVehicle(vehicle)
	if not vehicle or not DoesEntityExist(vehicle) then
		return 0
	end

	local stateMileage = Entity(vehicle).state.vehicleMileage
	if stateMileage then
		return stateMileage
	end

	return 0
end

return OdometerThread

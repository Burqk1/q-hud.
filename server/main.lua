-- Core Logic
local utility = require("modules.utils.server")




lib.callback.register("q-hud:server:getOdometer", function(_, plate)
	if not plate then return { error = true } end

	if GetResourceState('oxmysql') == 'started' then
		local vehicle = MySQL.single.await("SELECT mileage FROM player_vehicles WHERE plate = ?", {plate})
		if not vehicle then
			-- Generate random mileage between 15,000 and 150,000 for vehicles not in database
			local randomMileage = math.random(15000, 150000)
			print("^3[q-hud] Odometer: Vehicle with plate '" .. plate .. "' not found in database, starting from " .. randomMileage .. "^0")
			return { mileage = randomMileage }
		end
		return { mileage = vehicle.mileage or 0 }
	end

	return { error = true }
end)

RegisterNetEvent("q-hud:server:updateOdometer", function(plate, mileage)
	if not plate or not mileage then return end

	if GetResourceState('oxmysql') == 'started' then
		local result = MySQL.update.await("UPDATE player_vehicles SET mileage = ? WHERE plate = ?", {mileage, plate})
		if result == 0 then
			print("^3[q-hud] Odometer: Cannot save mileage for plate '" .. plate .. "' - vehicle not in database^0")
		end
	end
end)

RegisterNetEvent("q-hud:server:syncOdometerWithPassengers", function(vehicleNetId, mileage)
	if not vehicleNetId or not mileage then return end

	local veh = NetworkGetEntityFromNetworkId(vehicleNetId)
	if not veh or not DoesEntityExist(veh) then return end

	-- Server-side doesn't have access to GetVehicleMaxNumberOfPassengers
	-- Use a safe range (-1 to 15) to cover driver and most vehicle passenger seats
	for i = -1, 15 do
		local ped = GetPedInVehicleSeat(veh, i)
		if ped and ped ~= 0 then
			local playerId = NetworkGetEntityOwner(ped)
			if playerId and playerId ~= source then
				TriggerClientEvent("q-hud:client:syncPassengerOdometer", playerId, mileage)
			end
		end
	end
end)

---@param plate string
---@return number
exports("GetVehicleOdometer", function(plate)
	if GetResourceState('oxmysql') == 'started' then
		local vehicle = MySQL.single.await("SELECT mileage FROM player_vehicles WHERE plate = ?", {plate})
		if not vehicle then return 0 end
		return vehicle.mileage or 0
	end
	return 0
end)

---@param plate string
---@param mileage number
exports("SetVehicleOdometer", function(plate, mileage)
	if GetResourceState('oxmysql') == 'started' then
		MySQL.update("UPDATE player_vehicles SET mileage = ? WHERE plate = ?", {mileage, plate})
	end
end)

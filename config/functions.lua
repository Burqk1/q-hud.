return {
	isSeatbeltOn = function() -- Repalce this with your own seatbelt logic if your not using the built in seatbelt logic.
		return false
	end,
	getVehicleFuel = function(currentVehicle) 
		return GetVehicleFuelLevel(currentVehicle)
	end,
	getVehicleOdometer = function(currentVehicle) 
		if not currentVehicle or not DoesEntityExist(currentVehicle) then
			return 0
		end

		local stateMileage = Entity(currentVehicle).state.vehicleMileage
		if stateMileage then
			return math.floor(stateMileage) 
		end

		return 0
	end,
}

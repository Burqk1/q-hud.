local debug = require("modules.utils.shared").debug

local qb = exports["qb-core"]:GetCoreObject()

local qbFramework = {}
qbFramework.__index = qbFramework

function qbFramework.new()
	debug("(qbFramework:new) Created new instance.")
	local self = setmetatable({}, qbFramework)
	self.values = {}

	RegisterNetEvent("hud:client:UpdateNeeds", function(hunger, thirst)
		self.values.hunger = hunger
		self.values.thirst = thirst
	end)

	RegisterNetEvent("hud:client:UpdateStress", function(stress)
		self.values.stress = stress
	end)

	return self
end

function qbFramework:getPlayerHunger()
	local PlayerData = qb.Functions.GetPlayerData()
	if PlayerData and PlayerData.metadata and PlayerData.metadata["hunger"] then
		return PlayerData.metadata["hunger"]
	end
	return self.values.hunger or 100
end

function qbFramework:getPlayerThirst()
	local PlayerData = qb.Functions.GetPlayerData()
	if PlayerData and PlayerData.metadata and PlayerData.metadata["thirst"] then
		return PlayerData.metadata["thirst"]
	end
	return self.values.thirst or 100
end

function qbFramework:getPlayerStress()
	local PlayerData = qb.Functions.GetPlayerData()
	if PlayerData and PlayerData.metadata and PlayerData.metadata["stress"] then
		return PlayerData.metadata["stress"]
	end
	return self.values.stress or 0
end

return qbFramework

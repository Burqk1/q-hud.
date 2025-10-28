local debug = require("modules.utils.shared").debug
local interface = require("modules.interface.client")

local OxygenThread = {}
OxygenThread.__index = OxygenThread

OxygenThread.registry = {}

---@param identifier string
---@return table
function OxygenThread.new(identifier)
	local self = setmetatable({}, OxygenThread)
	self.identifier = identifier
	self.wasUnderwater = false
	self.lastOxygen = 100

	OxygenThread.registry[identifier] = self

	-- debug("(OxygenThread:new) Created new instance with identifier: ", identifier)
	return self
end

function OxygenThread:start()
	-- debug("(OxygenThread:start) Starting oxygen thread for: ", self.identifier)

	CreateThread(function()
		while true do
			local time = 500

			local ped = PlayerPedId()
			local isUnderwater = IsPedSwimmingUnderWater(ped)

			if isUnderwater then
				time = 100
				local oxygenTime = GetPlayerUnderwaterTimeRemaining(PlayerId())
				local oxygenPercent = math.max(0, math.min(100, oxygenTime * 10))

				if not self.wasUnderwater or math.abs(oxygenPercent - self.lastOxygen) > 1 then
					interface.updateOxygenState({
						isUnderwater = true,
						oxygen = oxygenPercent
					})

					self.wasUnderwater = true
					self.lastOxygen = oxygenPercent
				end
			else
				if self.wasUnderwater then
					interface.updateOxygenState({
						isUnderwater = false,
						oxygen = 100
					})

					self.wasUnderwater = false
					self.lastOxygen = 100
				end
			end
			Wait(time)
		end
	end)
end

function OxygenThread:stop()
	debug("(OxygenThread:stop) Stopping oxygen thread for: ", self.identifier)
	self.wasUnderwater = false
	self.lastOxygen = 100
end

---@param identifier string
---@return table|nil
function OxygenThread.get(identifier)
	return OxygenThread.registry[identifier]
end

return OxygenThread

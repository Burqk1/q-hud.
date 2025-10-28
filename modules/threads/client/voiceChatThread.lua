local interface = require("modules.interface.client")
local debug = require("modules.utils.shared").debug

local VoiceChatThread = {}
VoiceChatThread.__index = VoiceChatThread

VoiceChatThread.registry = {}

---@param identifier string
---@return table
function VoiceChatThread.new(identifier)
	local self = setmetatable({}, VoiceChatThread)
	self.identifier = identifier
	self.inRadioTalking = false
	self.inRadio = false

	VoiceChatThread.registry[identifier] = self

	-- debug("(VoiceChatThread:new) Created new instance with identifier: ", identifier)
	return self
end

function VoiceChatThread:start()

	RegisterNetEvent('pma-voice:setTalkingMode', function(range)
		debug("(VoiceChatThread) Voice range changed to: ", range)
		interface.message("setTalkRange", {
			range = range
		})
	end)

	RegisterNetEvent('pma-voice:radioActive', function(talking)
		self.inRadioTalking = talking
		debug("(VoiceChatThread) Radio talking state: ", talking)
	end)

	AddStateBagChangeHandler("radioChannel", ("player:%s"):format(GetPlayerServerId(PlayerId())),
		function(bagName, key, value)
			self.inRadio = value ~= (nil or 0)
			debug("(VoiceChatThread) Radio channel state: ", self.inRadio)
		end
	)

	CreateThread(function()
		while true do
			local playerId = PlayerId()
			local isTalking = NetworkIsPlayerTalking(playerId)

			interface.message("setTalkingState", {
				talking = isTalking,
				radio = self.inRadioTalking,
				inradio = self.inRadio
			})

			Wait(100) 
		end
	end)

	debug("(VoiceChatThread) Voice chat thread started")
end

---@param identifier string
function VoiceChatThread.getInstanceById(identifier)
	return VoiceChatThread.registry[identifier]
end

return VoiceChatThread

-- Core Logic
local config = require("config.shared")
local playerStatusClass = require("modules.threads.client.playerStatus")
local vehicleStatusClass = require("modules.threads.client.vehicleStatusThread")
local voiceChatClass = require("modules.threads.client.voiceChatThread")
local waypointClass = require("modules.threads.client.waypointThread")
local weaponClass = require("modules.threads.client.weaponThread")
local oxygenClass = require("modules.threads.client.oxygenThread")
local odometerClass = require("modules.threads.client.odometerThread")
local seatbeltLogicClass = require("modules.seatbelt.client")
local utility = require("modules.utils.shared")
local interface = require("modules.interface.client")
local debug = utility.debug

local seatbeltLogic = seatbeltLogicClass.new()
local playerStatusThread = playerStatusClass.new("main")
local vehicleStatusThread = vehicleStatusClass.new(playerStatusThread, seatbeltLogic)
local voiceChatThread = voiceChatClass.new("main")
local waypointThread = waypointClass.new("main")
local weaponThread = weaponClass.new("main")
local oxygenThread = oxygenClass.new("main")
local odometerThread = odometerClass.new("main")
local framework = utility.isFrameworkValid() and require("modules.frameworks." .. config.framework:lower()).new()
	or false

playerStatusThread:start(vehicleStatusThread, seatbeltLogic, framework)
voiceChatThread:start()
waypointThread:start()
weaponThread:start()
oxygenThread:start()
odometerThread:start()

exports("toggleHud", function(state)
	interface.toggle(state or nil)
	debug("(exports:toggleHud) Toggled HUD to state: ", state)
end)

exports("getNotificationSettings", function()
	return interface.getNotificationSettings()
end)

exports("setNotificationPosition", function(position)
	interface.setNotificationPosition(position)
	debug("(exports:setNotificationPosition) Set notification position to: ", position)
end)

exports("setNotificationScale", function(scale)
	interface.setNotificationScale(scale)
	debug("(exports:setNotificationScale) Set notification scale to: ", scale)
end)

local customMinimapOffsetX = 0
local customMinimapOffsetY = 0

exports("SetCustomMinimapPosition", function(offsetX, offsetY)
	customMinimapOffsetX = offsetX or 0
	customMinimapOffsetY = offsetY or 0

	local defaultAspectRatio = 1920 / 1080
	local resolutionX, resolutionY = GetActiveScreenResolution()
	local aspectRatio = resolutionX / resolutionY
	local baseMinimapOffset = 0

	if aspectRatio > defaultAspectRatio then
		baseMinimapOffset = ((defaultAspectRatio - aspectRatio) / 3.6) - 0.008
	end

	local finalOffsetX = baseMinimapOffset + customMinimapOffsetX
	local finalOffsetY = -0.047 + customMinimapOffsetY

	SetMinimapComponentPosition("minimap", "L", "B", 0.0 + finalOffsetX, finalOffsetY, 0.1638, 0.183)
	SetMinimapComponentPosition("minimap_mask", "L", "B", 0.0 + finalOffsetX, 0.0 + customMinimapOffsetY, 0.128, 0.20)
	SetMinimapComponentPosition("minimap_blur", "L", "B", -0.01 + finalOffsetX, 0.025 + customMinimapOffsetY, 0.262, 0.300)

	debug("(exports:SetCustomMinimapPosition) Set custom minimap position: offsetX=" .. customMinimapOffsetX .. ", offsetY=" .. customMinimapOffsetY)
end)

local interface = require("modules.interface.client")
local config = require("config.shared")
local utility = require("modules.utils.shared")
local debug = utility.debug

local function isNotifyStarted()
	return GetResourceState("q-notify") == "started"
end

local function showFallbackNotification(title, message)
	BeginTextCommandThefeedPost("STRING")
	AddTextComponentSubstringPlayerName(title .. ": " .. message)
	EndTextCommandThefeedPostTicker(false, false)
end

RegisterNuiCallback("uiLoaded", function(_, cb)
	local data = {
		config = config,
		minimap = utility.calculateMinimapSizeAndPosition(),
	}

	cb(data)

	CreateThread(utility.setupMinimap)

	debug("(nuicb:uiLoaded) Updating config and setting up minimap.")
end)

RegisterNuiCallback("syncNotificationSettings", function(data, cb)
	if data.position and data.scale then
		interface.updateNotificationSettingsCache(data.position, data.scale)

		if isNotifyStarted() then
			exports['q-notify']:SetNotificationPosition(data.position)
			exports['q-notify']:SetNotificationScale(data.scale)
		end

		debug("(nuicb:syncNotificationSettings) Synced notification settings from localStorage: position=" .. data.position .. ", scale=" .. data.scale)
	end
	cb("ok")
end)

RegisterNuiCallback("enterEditMode", function(data, cb)
	SetNuiFocus(true, true)
	cb("ok")
end)

RegisterNuiCallback("exitEditMode", function(data, cb)
	SetNuiFocus(false, false)
	cb("ok")
end)

local originalMinimapOffset = 0

RegisterNuiCallback("updateMinimapPosition", function(data, cb)
	local leftPercent = data.left or 1.0
	local topPercent = data.top or 76.0

	local defaultAspectRatio = 1920 / 1080
	local resolutionX, resolutionY = GetActiveScreenResolution()
	local aspectRatio = resolutionX / resolutionY
	local baseMinimapOffset = 0

	if aspectRatio > defaultAspectRatio then
		baseMinimapOffset = ((defaultAspectRatio - aspectRatio) / 3.6) - 0.008
	end


	local minimapOffsetX = baseMinimapOffset + ((leftPercent - 1.0) / 100.0)
	local minimapOffsetY = -((topPercent - 76.0) / 100.0)

	exports['q-hud']:SetCustomMinimapPosition(minimapOffsetX, minimapOffsetY)

	cb("ok")
end)

RegisterNuiCallback("resetMinimapPosition", function(_, cb)
	local minimapData = utility.calculateMinimapSizeAndPosition()

	exports['q-hud']:SetCustomMinimapPosition(0, 0)

	debug("(nuicb:resetMinimapPosition) Minimap position reset to defaults.")

	cb(minimapData)
end)

RegisterNuiCallback("updateNotificationSettings", function(data, cb)
	if data.position then
		if isNotifyStarted() then
			exports['q-notify']:SetNotificationPosition(data.position)
		end
		interface.updateNotificationSettingsCache(data.position, nil)
	end
	if data.scale then
		if isNotifyStarted() then
			exports['q-notify']:SetNotificationScale(data.scale)
		end
		interface.updateNotificationSettingsCache(nil, data.scale)
	end

	debug("(nuicb:updateNotificationSettings) Updated notification settings.")
	cb("ok")
end)

RegisterNuiCallback("previewNotification", function(data, cb)
	if isNotifyStarted() then
		exports['q-notify']:ShowNotification({
			type = data.type or 'inform',
			title = 'Önizleme',
			message = 'Bu bir önizleme bildirimidir',
			duration = 3000
		})
	else
		showFallbackNotification('Önizleme', 'Bu bir önizleme bildirimidir')
	end

	debug("(nuicb:previewNotification) Previewing notification type: " .. (data.type or 'inform'))
	cb("ok")
end)

RegisterNuiCallback("closeSettings", function(data, cb)
	SetNuiFocus(false, false)
	debug("(nuicb:closeSettings) Closed settings menu.")
	cb("ok")
end)

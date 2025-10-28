local interface = {}
local debug = require("modules.utils.shared").debug

---@param action string The action you wish to target
---@param data any The data you wish to send along with this action
interface.message = function(action, data)
	SendNUIMessage({
		action = action,
		data = data,
	})
end

---@param shouldShow boolean|string? Whether or not to show the frame. If no value is passed, the frame will toggle.
interface.toggle = function(shouldShow)
	if not shouldShow then
		shouldShow = "toggle"
		debug("(interface:toggle) No value passed, defaulting to nil.")
	end

	interface.message("setVisible", shouldShow)
end

---@param weaponData table Weapon state data {hasWeapon: boolean, ammo: number, totalAmmo: number}
interface.updateWeaponState = function(weaponData)
	interface.message("setWeaponState", weaponData)
end

---@param oxygenData table Oxygen state data {isUnderwater: boolean, oxygen: number}
interface.updateOxygenState = function(oxygenData)
	interface.message("setOxygenState", oxygenData)
end

-- Notification Settings Functions
local notificationSettings = {
	position = "top-right",
	scale = 1.0
}

---@return table Notification settings {position: string, scale: number}
interface.getNotificationSettings = function()
	return notificationSettings
end

-- Update notification settings cache
interface.updateNotificationSettingsCache = function(position, scale)
	if position then
		notificationSettings.position = position
	end
	if scale then
		notificationSettings.scale = scale
	end
end

---@param position string Notification position
interface.setNotificationPosition = function(position)
	interface.message("setNotificationPosition", { position = position })
end

---@param scale number Notification scale
interface.setNotificationScale = function(scale)
	interface.message("setNotificationScale", { scale = scale })
end

return interface

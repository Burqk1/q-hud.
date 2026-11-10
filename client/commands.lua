local interface = require("modules.interface.client")

RegisterCommand("togglehud", function()
	interface.toggle()
end, false)

RegisterCommand("hudsettings", function()
	SendNUIMessage({
		action = "toggleSettings",
		data = true
	})
	SetNuiFocus(true, true)
end, false)

RegisterNUICallback("closeSettings", function(data, cb)
	local isEditMode = data and data.isEditMode or false
	if isEditMode then
		SetNuiFocus(true, true)
	else
		SetNuiFocus(false, false)
	end
	cb("ok")
end)

local serverUtils = {}

serverUtils.isInterfaceCompiled = function()
	local fileCheck = LoadResourceFile(GetCurrentResourceName(), "dist/index.html")
	return fileCheck and true or false
end

return serverUtils

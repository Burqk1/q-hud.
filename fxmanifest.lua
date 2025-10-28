--@diagnostic disable: undefined-global
fx_version("cerulean")
game("gta5")

name("q-hud")
version("1.0.9")

shared_scripts({
	"@ox_lib/init.lua",
	"require.lua",
})

client_scripts({
	"client/main.lua",
	"client/nuicb.lua",
	"client/commands.lua",
})

server_scripts({
	"@oxmysql/lib/MySQL.lua",
	"server/main.lua",
})

ui_page("dist/index.html")
-- ui_page("http://localhost:5173/")

files({
	"dist/index.html",
	"dist/assets/*.js",
	"dist/assets/*.css",
	"dist/**/*.woff2",
	"dist/images/*.png",
	"dist/images/*.gif",
	"config/shared.lua",
	"config/functions.lua",
	"modules/interface/client.lua",
	"modules/utils/shared.lua",
	"modules/seatbelt/client.lua",
	"modules/frameworks/**/*.lua",
	"modules/threads/client/**/*.lua",
	"data/mapData.lua",
})

lua54("yes")
use_experimental_fxv2_oal("yes")
nui_callback_strict_mode("true")

local interface = require("modules.interface.client")
local debug = require("modules.utils.shared").debug

local WaypointThread = {}
WaypointThread.__index = WaypointThread

WaypointThread.registry = {}

---@param identifier string
---@return table
function WaypointThread.new(identifier)
	local self = setmetatable({}, WaypointThread)
	self.identifier = identifier

	WaypointThread.registry[identifier] = self

	-- debug("(WaypointThread:new) Created new instance with identifier: ", identifier)
	return self
end

Citizen.CreateThread(function()
	local hasWaypoint = IsWaypointActive()
    local minimap = RequestScaleformMovie('minimap')
    SetBigmapActive(true, false)
    Wait(0)
    SetBigmapActive(false, false)
    while true do
        Wait(0)
        BeginScaleformMovieMethod(minimap, 'HIDE_SATNAV') 
        EndScaleformMovieMethod() 
    end
end)

-- Citizen.CreateThread(function()
-- 	while true do
-- 		Wait(0)
-- 		DisplayAmmoThisFrame(false)
-- 	end
-- end)

function WaypointThread:start()
	CreateThread(function()
		while true do
			local time = 500
			local hasWaypoint = IsWaypointActive()
			SetRadarZoom(1100)
	
			if hasWaypoint then
				time = 100
				local waypoint = GetFirstBlipInfoId(8) -- 8 = waypoint blip

				if DoesBlipExist(waypoint) then
					local waypointCoords = GetBlipCoords(waypoint)
					local playerCoords = GetEntityCoords(PlayerPedId())
					local distance = #(playerCoords - waypointCoords)

					debug("(WaypointThread) Waypoint distance:", distance)

					interface.message("setWaypointState", {
						distance = math.floor(distance),
						hasWaypoint = true
					})
				else
					interface.message("setWaypointState", {
						distance = 0,
						hasWaypoint = false
					})
				end
			else
				interface.message("setWaypointState", {
					distance = 0,
					hasWaypoint = false
				})
			end

			Wait(time) 
		end
	end)

	debug("(WaypointThread) Waypoint thread started")
end

---@param identifier string
function WaypointThread.getInstanceById(identifier)
	return WaypointThread.registry[identifier]
end

return WaypointThread

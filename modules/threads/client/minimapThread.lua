-- local utility = require("modules.utils.shared")
-- local debug = utility.debug

-- local minimapOffset = { x = 0.0, y = 0.0 }

-- function SetCustomMinimapPosition(offsetX, offsetY)
--     minimapOffset.x = offsetX
--     minimapOffset.y = offsetY
-- end

-- -- CreateThread(function()
-- --     while true do
-- --         Wait(0)

-- --         -- Her frame minimap pozisyonunu set et
-- --         -- Bu sayede blip'ler de doğru pozisyonda render edilir
-- --         if minimapOffset.x ~= 0.0 or minimapOffset.y ~= 0.0 then
-- --             SetMinimapComponentPosition("minimap", "L", "B", minimapOffset.x, -0.047 + minimapOffset.y, 0.1638, 0.183)
-- --             SetMinimapComponentPosition("minimap_mask", "L", "B", minimapOffset.x, 0.0 + minimapOffset.y, 0.128, 0.20)
-- --             SetMinimapComponentPosition("minimap_blur", "L", "B", minimapOffset.x - 0.01, 0.025 + minimapOffset.y, 0.262, 0.300)
-- --         end
-- --     end
-- -- end)

-- exports("SetCustomMinimapPosition", SetCustomMinimapPosition)

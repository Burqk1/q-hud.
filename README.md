# q-hud

A player and vehicle HUD for FiveM (GTA V). The game logic is Lua; the interface is a Preact + TypeScript app built with Vite and Tailwind CSS.

Version: `1.0.9` (from `fxmanifest.lua`). Original author: vipex (see `LICENSE` and `web/package.json`).

## What it shows

- **Player status**: health, armor, hunger, thirst, stress, stamina and oxygen. Hunger, thirst and stress come from the selected framework (see [Framework support](#framework-support)).
- **Vehicle HUD**: speed, RPM, gear, fuel, engine health, engine on/off state and seatbelt state. Speed can be shown in km/h or mph.
- **Odometer**: per-vehicle mileage, stored in the database by plate and synced to passengers.
- **Compass and location**: heading plus street and zone names. It can sit at the top or bottom of the screen, or be hidden.
- **Waypoint distance** while a waypoint is set.
- **Ammo counter** for the current weapon.
- **Voice indicator**: talking state, radio state and voice range (pma-voice events).
- **Oxygen bar** while swimming underwater.
- **Cinematic bars** (letterbox), off by default.
- **Square minimap**: the resource streams its own minimap textures (`stream/`) and repositions the minimap. The radar is only shown while the player is in a vehicle.

The vanilla vehicle name, area name, vehicle class and street name HUD components are moved off-screen.

## In-game settings menu

`/hudsettings` opens a settings panel. Everything set there is saved in the browser's `localStorage` (key `hudSettings`), so each player keeps their own setup. The panel has:

- Show/hide the whole HUD or single elements (health, vehicle HUD, compass, voice, waypoint, ammo, oxygen, odometer)
- Speed unit (km/h / mph)
- Compass only in vehicles
- Cinematic bars
- Glow effect on the status bars
- Status thresholds: hunger and thirst are only shown below a value, stress only above a value (default 50 each)
- Interface colors and per-status colors
- **Edit mode**: drag and scale the player status, vehicle HUD and compass. Press `Esc` to leave edit mode.
- Notification position and scale, with a preview button (passed to `q-notify`, see below)
- Reset to defaults (also resets the minimap position)

## Requirements

| Resource | Why |
|---|---|
| `ox_lib` | Loaded as a shared script. Used for `lib.callback` and `lib.onCache`; without it the odometer is disabled. |
| `oxmysql` | Server-side odometer reads/writes. |
| `q-notify` (optional) | The settings menu calls `exports['q-notify']` (`SetNotificationPosition`, `SetNotificationScale`, `ShowNotification`) only while `q-notify` is started. Without it, position and scale are still saved in the HUD settings but not applied anywhere, and the preview button shows a native GTA feed notification instead. It is not part of this repository. |
| A framework (optional) | `qb-core`, ESX (`esx_status`), or ox (`ox:statusTick`) for hunger/thirst/stress. |
| `pma-voice` (optional) | Talking range and radio indicator events. |

## Installation

1. Build the interface (see [Building the UI](#building-the-ui)) or use a release zip. Pushing a `v*.*.*` tag runs `.github/workflows/build-prod.yml`, which builds the UI with Bun and attaches `q-hud.zip` (already containing `dist/`) to a GitHub release.
2. Copy the folder into your server's `resources` directory. **The folder must be named `q-hud`**, because the code calls `exports['q-hud']` on itself.
3. Add the database column used by the odometer (see below, or run `sql/mileage.sql`).
4. In `server.cfg`, start the dependencies first:

   ```cfg
   ensure ox_lib
   ensure oxmysql
   ensure qb-core      # or your framework
   ensure q-notify     # optional
   ensure q-hud
   ```

### Database

The odometer reads and writes a `mileage` column in the `player_vehicles` table (the QBCore vehicles table):

```sql
SELECT mileage FROM player_vehicles WHERE plate = ?
UPDATE player_vehicles SET mileage = ? WHERE plate = ?
```

Stock QBCore does not have this column. If it is missing, run the optional `sql/mileage.sql`, which contains:

```sql
ALTER TABLE player_vehicles ADD COLUMN mileage FLOAT NOT NULL DEFAULT 0;
```

Vehicles that are not in the table get a random starting value between 15,000 and 150,000 km and are not saved.

## Configuration

### `config/shared.lua`

| Key | Default | Description |
|---|---|---|
| `debug` | `false` | Prints debug messages in the client console and the UI. |
| `useBuiltInSeatbeltLogic` | `true` | Use the built-in seatbelt (keybind, windscreen ejection, exit lock). If `false`, the HUD reads seatbelt state from `isSeatbeltOn()` in `config/functions.lua`. |
| `framework` | `"qb"` | `none`, `esx`, `qb`, `ox` or `custom`. With `none`, hunger/thirst/stress are not sent. |
| `compassLocation` | `"top"` | `top`, `bottom` or `hidden`. |

### `config/functions.lua`

Hooks for your own systems:

- `isSeatbeltOn()` returns the seatbelt state when the built-in logic is off (default returns `false`).
- `getVehicleFuel(vehicle)` defaults to `GetVehicleFuelLevel`. Replace it if you use a fuel script that stores fuel elsewhere.
- `getVehicleOdometer(vehicle)` reads the `vehicleMileage` state bag set by the odometer thread.

### Framework support

Implemented in `modules/frameworks/`:

- **qb**: reads `PlayerData.metadata.hunger/thirst/stress` and also listens to `hud:client:UpdateNeeds` and `hud:client:UpdateStress`.
- **esx**: listens to `esx_status:onTick`.
- **ox**: listens to `ox:statusTick`.
- **custom**: edit `modules/frameworks/custom.lua` and return your own values (it returns 100/100/0 by default).

### Street names

`data/mapData.lua` maps street and area names to display labels. Edit the values there to rename or translate streets.

### Weapon ammo source

The ammo counter picks its source at start:

- `ox_inventory` running: `ox_inventory:currentWeapon` event
- `qb-inventory` or `ps-inventory` running: `weapons:client:SetCurrentWeapon` / `weapons:client:UpdateWeaponAmmo`
- otherwise: game natives, polled every 100 ms

## Commands and keybinds

| Command | Default key | Description |
|---|---|---|
| `/togglehud` | - | Show or hide the HUD |
| `/hudsettings` | - | Open the settings menu |
| `/toggleSeatbelt` | `B` | Toggle the seatbelt (only with `useBuiltInSeatbeltLogic = true`, not on bikes) |

## Exports

Client:

```lua
exports['q-hud']:toggleHud(state)                    -- true/false, or nil to toggle
exports['q-hud']:getNotificationSettings()           -- { position, scale }
exports['q-hud']:setNotificationPosition(position)
exports['q-hud']:setNotificationScale(scale)
exports['q-hud']:SetCustomMinimapPosition(offsetX, offsetY)
```

Server:

```lua
exports['q-hud']:GetVehicleOdometer(plate)           -- number
exports['q-hud']:SetVehicleOdometer(plate, mileage)
```

Server events and callbacks used internally: `q-hud:server:getOdometer` (ox_lib callback), `q-hud:server:updateOdometer`, `q-hud:server:syncOdometerWithPassengers`.

## Building the UI

The UI lives in `web/` and builds into `dist/` at the resource root (`fxmanifest.lua` loads `dist/index.html`). `dist/` is git-ignored, so a fresh clone has no UI until you build it.

```bash
cd web
bun install        # or: npm install
bun run build      # tsc -b && vite build
```

Other scripts in `web/package.json`:

- `dev`: Vite dev server. To load it in game, switch `ui_page` in `fxmanifest.lua` to the commented `http://localhost:5173/` line.
- `preview`: preview the production build.

## License

Modified MIT License, see `LICENSE`. You may use, copy, modify and share the software, but **it may not be sold or used commercially** without permission from the copyright holder (vipexv).

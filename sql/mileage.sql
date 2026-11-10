-- Optional: adds the odometer column read and written by server/main.lua.
-- Mileage is stored in km (one decimal). Skip this if the column already exists.
ALTER TABLE player_vehicles ADD COLUMN mileage FLOAT NOT NULL DEFAULT 0;

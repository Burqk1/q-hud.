import { useNuiEvent } from "@/hooks/useNuiEvent.ts";
import { useEffect, useState } from "react";
import CarHud from "./components/car-hud";
import Compass from "./components/compass";
import PlayerStatus from "./components/player-status";
import Talk from "./components/talk";
import SettingsMenu from "./components/settings-menu";
import CinematicBars from "./components/cinematic-bars";
import WaypointDistance from "./components/waypoint-distance";
import VehicleOdometer from "./components/vehicle-odometer";
import AmmoCounter from "./components/ammo-counter";
import { useHudSettings, useHudSettingsStore, saveSettings } from "./states/settings";
import {
  useMinimapStateStore,
  type MinimapStateInterface,
} from "./states/minimap";
import type { ConfigInterface } from "./types/config";
import { debug, setDebugMode } from "./utils/debug";
import { fetchNui } from "./utils/fetchNui";
import { isEnvBrowser } from "./utils/misc";
import { useCompassLocationStore } from "./states/compass-location";

if (isEnvBrowser()) {
  const body = document.body;

  body.style.backgroundColor = "#242424";
  debug("App loaded in browser");
}

export function App() {
  const [visible, setVisible] = useState(true);
  const [minimap, setMinimapState] = useMinimapStateStore();
  const [compassLocation, setCompassLocation] = useCompassLocationStore();
  const hudSettings = useHudSettings();
  const [, setSettings] = useHudSettingsStore();

  useNuiEvent("setVisible", (state) => {
    const newState = state === "toggle" ? !visible : state;
    setVisible(newState);

    debug(
      `(App) NUI message received: setVisible ${state}`,
      `newState: ${newState}`,
    );
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && hudSettings.isEditMode) {
        setSettings((prev) => {
          const newSettings = { ...prev, isEditMode: false };
          saveSettings(newSettings);
          return newSettings;
        });
        fetchNui("exitEditMode");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hudSettings.isEditMode, setSettings]);

  useEffect(() => {
    fetchNui("uiLoaded")
      .then(
        (res: { config: ConfigInterface; minimap: MinimapStateInterface }) => {
          setDebugMode(res.config.debug ?? false);
          setMinimapState(res.minimap);
          setCompassLocation(res.config.compassLocation);
        },
      )
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        debug("(App) fetched uiLoaded callback");
      });
  }, []);

  useEffect(() => {
    fetchNui("syncNotificationSettings", {
      position: hudSettings.notificationPosition,
      scale: hudSettings.notificationScale,
    }).catch((err) => {
      console.error("Failed to sync notification settings:", err);
    });
  }, []);

  if (!visible) {
    debug("(App) Returning with no children since the app is not visible.");
    return <></>;
  }

  return (
    <>
      <style>
        {`:root {
          --primary-color: ${hudSettings.primaryColor};
          --secondary-color: ${hudSettings.secondaryColor};
          --carhud-color: ${hudSettings.carHudColor};
          --compass-color: ${hudSettings.compassColor};
          --health-color: ${hudSettings.healthColor};
          --armor-color: ${hudSettings.armorColor};
          --hunger-color: ${hudSettings.hungerColor};
          --thirst-color: ${hudSettings.thirstColor};
          --stress-color: ${hudSettings.stressColor};
          --stamina-color: ${hudSettings.staminaColor};
          --hud-scale: ${hudSettings.hudScale / 100};
          font-size: calc(16px * ${hudSettings.hudScale / 100});
        }`}
      </style>
      {hudSettings.isEditMode && (
        <div
          className="fixed inset-0 z-[9997] pointer-events-none"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.15)',
          }}
        />
      )}
      <div>
        {hudSettings.showCinematicBars && <CinematicBars />}
        <SettingsMenu />
        {hudSettings.showWaypoint && <WaypointDistance />}
        {hudSettings.showOdometer && <VehicleOdometer />}
        {hudSettings.showHud && <PlayerStatus />}
        {hudSettings.showHud && hudSettings.showVehicleHud && <CarHud />}
        {hudSettings.showHud && compassLocation !== "hidden" && hudSettings.showCompass && (
          <>
            <Compass />
          </>
        )}
        {hudSettings.showVoice && <Talk />}
        {hudSettings.showAmmo && <AmmoCounter />}
      </div>
    </>
  );
}

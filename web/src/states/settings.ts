import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";

export interface HudSettingsInterface {
  compassOnlyInVehicle: boolean;
  showCinematicBars: boolean;
  speedUnit: "mph" | "kmh";
  showHud: boolean;
  hudScale: number;
  primaryColor: string; // Voice indicator
  secondaryColor: string; // UI elements
  carHudColor: string; // Car HUD color
  compassColor: string; // Compass, Odometer, Waypoint
  healthColor: string; // Health bar color
  armorColor: string; // Armor bar color
  hungerColor: string; // Hunger bar color
  thirstColor: string; // Thirst bar color
  stressColor: string; // Stress bar color
  staminaColor: string; // Stamina bar color
  showHealth: boolean;
  showArmor: boolean;
  showHunger: boolean;
  showThirst: boolean;
  showStress: boolean;
  showVehicleHud: boolean;
  showCompass: boolean;
  showVoice: boolean;
  showWaypoint: boolean;
  showAmmo: boolean;
  showOxygen: boolean;
  showOdometer: boolean;
  enableGlowEffect: boolean;

  hungerThreshold: number; // 0-100
  thirstThreshold: number; // 0-100
  stressThreshold: number; // 0-100
  useThresholds: boolean; // Enable/disable threshold system
  isSettingsOpen: boolean;
  isEditMode: boolean;
  playerStatusScale: number; // 50-200
  carHudScale: number; // 50-200
  compassScale: number; // 50-200
  playerStatusPosition: { x: number; y: number };
  carHudPosition: { x: number; y: number };
  compassPosition: { x: number; y: number };

  notificationPosition: "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right";
  notificationScale: number; // 0.5-2.0
}

const defaultSettings: HudSettingsInterface = {
  compassOnlyInVehicle: true,
  showCinematicBars: false,
  speedUnit: "kmh",
  showHud: true,
  hudScale: 100,
  primaryColor: "#023d57",
  secondaryColor: "#023d57",
  carHudColor: "#94f024",
  compassColor: "#94f024",
  healthColor: "#94f024",
  armorColor: "#10aef5",
  hungerColor: "#f59e0b",
  thirstColor: "#10aef5",
  stressColor: "#ff5b57",
  staminaColor: "#f59e0b",
  showHealth: true,
  showArmor: true,
  showHunger: true,
  showThirst: true,
  showStress: true,
  showVehicleHud: true,
  showCompass: true,
  showVoice: true,
  showWaypoint: true,
  showAmmo: true,
  showOxygen: true,
  showOdometer: true,
  enableGlowEffect: true,
  hungerThreshold: 50,
  thirstThreshold: 50,
  stressThreshold: 50,
  useThresholds: true,
  isSettingsOpen: false,
  isEditMode: false,
  playerStatusScale: 100,
  carHudScale: 100,
  compassScale: 100,
  playerStatusPosition: { x: 0, y: 0 },
  carHudPosition: { x: 0, y: 0 },
  compassPosition: { x: 0, y: 0 },
  notificationPosition: "top-right",
  notificationScale: 1.0,
};

const loadSettings = (): HudSettingsInterface => {
  try {
    const saved = localStorage.getItem("hudSettings");
    if (saved) {
      return { ...defaultSettings, ...JSON.parse(saved), isSettingsOpen: false };
    }
  } catch (error) {
    console.error("Failed to load settings:", error);
  }
  return defaultSettings;
};

export const saveSettings = (settings: HudSettingsInterface) => {
  try {
    const { isSettingsOpen, ...settingsToSave } = settings;
    localStorage.setItem("hudSettings", JSON.stringify(settingsToSave));
  } catch (error) {
    console.error("Failed to save settings:", error);
  }
};

export const getDefaultSettings = (): HudSettingsInterface => {
  return { ...defaultSettings };
};

const hudSettingsState = atom<HudSettingsInterface>(loadSettings());

export const useHudSettings = () => useAtomValue(hudSettingsState);
export const useSetHudSettings = () => useSetAtom(hudSettingsState);
export const useHudSettingsStore = () => useAtom(hudSettingsState);

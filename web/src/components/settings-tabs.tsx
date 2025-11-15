import { useHudSettingsStore, saveSettings } from "@/states/settings";
import { useCallback, useState, useEffect } from "preact/hooks";
import { MdSpeed, MdPalette } from "react-icons/md";
import { TbCompass } from "react-icons/tb";
import { BiSolidCarGarage, BiSolidShieldAlt2 } from "react-icons/bi";
import { AiOutlineEye } from "react-icons/ai";
import { BsSliders } from "react-icons/bs";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { IoFastFood, IoChevronDown } from "react-icons/io5";
import { TiHeartFullOutline } from "react-icons/ti";
import { FaBottleWater, FaPersonRunning, FaBrain } from "react-icons/fa6";
import { fetchNui } from "@/utils/fetchNui";
import CustomColorPicker from "./ui/custom-color-picker";

type TabType = "general" | "appearance" | "visibility" | "colors";

export default function SettingsTabs() {
  const [settings, setSettings] = useHudSettingsStore();
  const [activeTab, setActiveTab] = useState<TabType>("general");
  const [selectedStatus, setSelectedStatus] = useState<"health" | "armor" | "hunger" | "thirst" | "stress" | "stamina">("health");
  const [selectedInterface, setSelectedInterface] = useState<"primary" | "secondary" | "carhud" | "compass">("primary");
  const [isThresholdOpen, setIsThresholdOpen] = useState(false);

  const updateSetting = useCallback(
    <K extends keyof typeof settings>(key: K, value: typeof settings[K]) => {
      setSettings((prev) => {
        const newSettings = { ...prev, [key]: value };
        saveSettings(newSettings);
        return newSettings;
      });
    },
    [setSettings]
  );

  const toggleEditMode = useCallback(() => {
    const newValue = !settings.isEditMode;
    updateSetting("isEditMode", newValue);

    if (newValue) {
      setTimeout(() => {
        setSettings((prev) => ({ ...prev, isSettingsOpen: false }));
        fetchNui("closeSettings", { isEditMode: true });
        fetchNui("enterEditMode");
      }, 100);
    } else {
      fetchNui("exitEditMode");
    }
  }, [settings.isEditMode, updateSetting, setSettings]);

  useEffect(() => {
    fetchNui("updateNotificationSettings", {
      position: settings.notificationPosition,
      scale: settings.notificationScale,
    });
  }, [settings.notificationPosition, settings.notificationScale]);

  const previewNotification = useCallback((type: "inform" | "success" | "error") => {
    fetchNui("previewNotification", { type });
  }, []);

  const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) => (
    <label className="relative inline-flex items-center cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.currentTarget.checked)}
        className="sr-only peer"
      />
      <div
        className="w-11 h-6 rounded-full peer-focus:outline-none relative overflow-hidden"
        style={{
          backgroundColor: checked ? 'var(--primary-color)' : 'rgba(0, 0, 0, 0.5)',
          boxShadow: checked
            ? '0 0 10px var(--primary-color), inset 0 1px 2px rgba(0,0,0,0.2)'
            : 'inset 0 1px 2px rgba(0,0,0,0.3)',
          transform: 'scale(1)',
          transition: 'all 400ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div
          className="absolute top-[2px] bg-white rounded-full h-5 w-5"
          style={{
            left: '2px',
            transform: checked ? 'translateX(20px) scale(1.1)' : 'translateX(0) scale(1)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            transition: 'all 400ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </div>
    </label>
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-center relative" style={{ gap: '0.25rem', marginBottom: '1.5rem' }}>
        <button
          onClick={() => setActiveTab("general")}
          className={`transition-all relative ${
            activeTab === "general"
              ? "text-white font-bold"
              : "text-white/50 hover:text-white/80"
          }`}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '0.75rem',
            backgroundColor: activeTab === "general" ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.3)',
            border: activeTab === "general" ? '2px solid var(--secondary-color)' : '2px solid transparent',
            boxShadow: activeTab === "general" ? `0 0 20px ${settings.secondaryColor}4D` : 'none',
          }}
        >
          <BsSliders className="inline-block mr-2 text-lg" style={{ color: activeTab === "general" ? 'var(--primary-color)' : undefined }} />
          General
        </button>
        <button
          onClick={() => setActiveTab("appearance")}
          className={`transition-all relative ${
            activeTab === "appearance"
              ? "text-white font-bold"
              : "text-white/50 hover:text-white/80"
          }`}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '0.75rem',
            backgroundColor: activeTab === "appearance" ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.3)',
            border: activeTab === "appearance" ? '2px solid var(--secondary-color)' : '2px solid transparent',
            boxShadow: activeTab === "appearance" ? `0 0 20px ${settings.secondaryColor}4D` : 'none',
          }}
        >
          <MdSpeed className="inline-block mr-2 text-lg" style={{ color: activeTab === "appearance" ? 'var(--primary-color)' : undefined }} />
          Appearance
        </button>
        <button
          onClick={() => setActiveTab("visibility")}
          className={`transition-all relative ${
            activeTab === "visibility"
              ? "text-white font-bold"
              : "text-white/50 hover:text-white/80"
          }`}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '0.75rem',
            backgroundColor: activeTab === "visibility" ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.3)',
            border: activeTab === "visibility" ? '2px solid var(--secondary-color)' : '2px solid transparent',
            boxShadow: activeTab === "visibility" ? `0 0 20px ${settings.secondaryColor}4D` : 'none',
          }}
        >
          <AiOutlineEye className="inline-block mr-2 text-lg" style={{ color: activeTab === "visibility" ? 'var(--primary-color)' : undefined }} />
          Visibility
        </button>
        <button
          onClick={() => setActiveTab("colors")}
          className={`transition-all relative ${
            activeTab === "colors"
              ? "text-white font-bold"
              : "text-white/50 hover:text-white/80"
          }`}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '0.75rem',
            backgroundColor: activeTab === "colors" ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.3)',
            border: activeTab === "colors" ? '2px solid var(--secondary-color)' : '2px solid transparent',
            boxShadow: activeTab === "colors" ? `0 0 20px ${settings.secondaryColor}4D` : 'none',
          }}
        >
          <MdPalette className="inline-block mr-2 text-lg" style={{ color: activeTab === "colors" ? 'var(--primary-color)' : undefined }} />
          Colors
        </button>
      </div>

      <div className="flex flex-col" style={{ gap: '0.75rem', height: '370px' }}>
        <div className="flex flex-col overflow-y-auto" style={{ gap: '0.75rem', paddingRight: '0.5rem' }}>
        {activeTab === "general" && (
          <>
            <div className="group flex items-center justify-between p-4 rounded-xl transition-all hover:scale-[1.01]"
              style={{
                background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.2) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg" style={{ background: `${settings.secondaryColor}1A`, border: `1px solid ${settings.secondaryColor}33` }}>
                  <AiOutlineEye style={{ color: 'var(--secondary-color)' }} className="text-xl" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Show HUD</p>
                  <p className="text-white/40 text-xs">Toggle entire HUD visibility</p>
                </div>
              </div>
              <ToggleSwitch
                checked={settings.showHud}
                onChange={(val) => updateSetting("showHud", val)}
              />
            </div>

            <div className="group flex items-center justify-between p-4 rounded-xl transition-all hover:scale-[1.01]"
              style={{
                background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.2) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg" style={{ background: `${settings.secondaryColor}1A`, border: `1px solid ${settings.secondaryColor}33` }}>
                  <MdSpeed style={{ color: 'var(--secondary-color)' }} className="text-xl" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Speed Unit</p>
                  <p className="text-white/40 text-xs">Choose measurement unit</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => updateSetting("speedUnit", "mph")}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    settings.speedUnit === "mph"
                      ? "text-black shadow-lg"
                      : "text-white/50 hover:text-white/70"
                  }`}
                  style={{
                    background: settings.speedUnit === "mph"
                      ? 'var(--primary-color)'
                      : 'rgba(255, 255, 255, 0.05)',
                    border: settings.speedUnit === "mph"
                      ? '1px solid var(--primary-color)'
                      : '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                >
                  MPH
                </button>
                <button
                  onClick={() => updateSetting("speedUnit", "kmh")}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    settings.speedUnit === "kmh"
                      ? "text-black shadow-lg"
                      : "text-white/50 hover:text-white/70"
                  }`}
                  style={{
                    background: settings.speedUnit === "kmh"
                      ? 'var(--primary-color)'
                      : 'rgba(255, 255, 255, 0.05)',
                    border: settings.speedUnit === "kmh"
                      ? '1px solid var(--primary-color)'
                      : '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                >
                  KM/H
                </button>
              </div>
            </div>

            <div className="group flex items-center justify-between p-4 rounded-xl transition-all hover:scale-[1.01]"
              style={{
                background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.2) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg" style={{ background: `${settings.secondaryColor}1A`, border: `1px solid ${settings.secondaryColor}33` }}>
                  <TbCompass style={{ color: 'var(--secondary-color)' }} className="text-xl" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Compass In Vehicle Only</p>
                  <p className="text-white/40 text-xs">Show compass only when driving</p>
                </div>
              </div>
              <ToggleSwitch
                checked={settings.compassOnlyInVehicle}
                onChange={(val) => updateSetting("compassOnlyInVehicle", val)}
              />
            </div>

            <div className="group flex items-center justify-between p-4 rounded-xl transition-all hover:scale-[1.01]"
              style={{
                background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.2) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg" style={{ background: `${settings.secondaryColor}1A`, border: `1px solid ${settings.secondaryColor}33` }}>
                  <BiSolidCarGarage style={{ color: 'var(--secondary-color)' }} className="text-xl" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Cinematic Bars</p>
                  <p className="text-white/40 text-xs">Letterbox effect for videos</p>
                </div>
              </div>
              <ToggleSwitch
                checked={settings.showCinematicBars}
                onChange={(val) => updateSetting("showCinematicBars", val)}
              />
            </div>
          </>
        )}

        {activeTab === "appearance" && (
          <>
            <div className="flex items-center justify-between bg-black/30 border border-white/5" style={{ padding: '0.75rem', borderRadius: '0.5rem' }}>
              <div className="flex items-center" style={{ gap: '0.5rem' }}>
                <BsSliders style={{ color: 'var(--primary-color)' }} className="text-xl" />
                <div>
                  <p className="text-white font-semibold text-sm">Edit Mode</p>
                  <p className="text-white/50 text-xs">Scale and move HUD elements</p>
                </div>
              </div>
              <button
                onClick={toggleEditMode}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  settings.isEditMode
                    ? "text-black"
                    : "bg-black/50 text-white/70 hover:bg-black/70"
                }`}
                style={{
                  backgroundColor: settings.isEditMode ? 'var(--primary-color)' : undefined
                }}
              >
                {settings.isEditMode ? "Exit Edit" : "Enter Edit"}
              </button>
            </div>

            <div className="flex items-center justify-between bg-black/30 border border-white/5" style={{ padding: '0.75rem', borderRadius: '0.5rem' }}>
              <div className="flex items-center" style={{ gap: '0.5rem' }}>
                <div>
                  <p className="text-white font-semibold text-sm">Glow Effect</p>
                  <p className="text-white/50 text-xs">Enable glow on health bars</p>
                </div>
              </div>
              <ToggleSwitch
                checked={settings.enableGlowEffect}
                onChange={(val) => updateSetting("enableGlowEffect", val)}
              />
            </div>

            <div className="flex flex-col p-3 bg-black/30 rounded-lg border border-white/5">
              <div className="mb-3">
                <p className="text-white font-semibold text-sm">Notification Position</p>
                <p className="text-white/50 text-xs">Choose where notifications appear</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "top-left", label: "Top Left" },
                  { value: "top-center", label: "Top Center" },
                  { value: "top-right", label: "Top Right" },
                  { value: "bottom-left", label: "Bottom Left" },
                  { value: "bottom-center", label: "Bottom Center" },
                  { value: "bottom-right", label: "Bottom Right" },
                ].map((pos) => (
                  <button
                    key={pos.value}
                    onClick={() => updateSetting("notificationPosition", pos.value as any)}
                    className={`px-2 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      settings.notificationPosition === pos.value
                        ? "text-black"
                        : "bg-black/50 text-white/70 hover:bg-black/70"
                    }`}
                    style={{
                      backgroundColor: settings.notificationPosition === pos.value ? 'var(--primary-color)' : undefined
                    }}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col p-3 bg-black/30 rounded-lg border border-white/5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-white font-semibold text-sm">Notification Scale</p>
                  <p className="text-white/50 text-xs">Size: {Math.round(settings.notificationScale * 100)}%</p>
                </div>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={settings.notificationScale}
                onChange={(e) => updateSetting("notificationScale", Number(e.currentTarget.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, var(--primary-color) 0%, var(--primary-color) ${((settings.notificationScale - 0.5) / 1.5) * 100}%, rgba(255,255,255,0.1) ${((settings.notificationScale - 0.5) / 1.5) * 100}%, rgba(255,255,255,0.1) 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-white/50 mt-1">
                <span>50%</span>
                <span>100%</span>
                <span>200%</span>
              </div>
            </div>
          </>
        )}

        {activeTab === "visibility" && (
          <>
            <div className="bg-black/30 rounded-lg border border-white/5">
              <div className="flex items-center justify-between p-3 border-b border-white/5">
                <div>
                  <p className="text-white font-semibold text-sm">Use Status Thresholds</p>
                  <p className="text-white/50 text-xs">Show status bars only when needed</p>
                </div>
                <ToggleSwitch
                  checked={settings.useThresholds}
                  onChange={(val) => updateSetting("useThresholds", val)}
                />
              </div>

              {settings.useThresholds && (
                <>
                  <button
                    onClick={() => setIsThresholdOpen(!isThresholdOpen)}
                    className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition-all"
                  >
                    <div>
                      <p className="text-white font-semibold text-sm">Threshold Settings</p>
                      <p className="text-white/50 text-xs">Configure threshold values</p>
                    </div>
                    <IoChevronDown
                      className="text-white/70 text-xl transition-transform duration-300"
                      style={{
                        transform: isThresholdOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                      }}
                    />
                  </button>

                  <div
                    className="transition-all duration-300 ease-in-out overflow-hidden"
                    style={{
                      maxHeight: isThresholdOpen ? '500px' : '0px',
                      opacity: isThresholdOpen ? 1 : 0,
                    }}
                  >
                    <div className="flex flex-col gap-3 p-3">
                  <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg border border-white/5">
                    <div>
                      <p className="text-white font-semibold text-sm">Hunger Threshold</p>
                      <p className="text-white/50 text-xs">Show when below this value</p>
                    </div>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={settings.hungerThreshold}
                      onChange={(e) => {
                        const val = Number(e.currentTarget.value);
                        if (val >= 0 && val <= 100) {
                          updateSetting("hungerThreshold", val);
                        }
                      }}
                      className="w-16 px-2 py-1 bg-black/50 text-white text-center rounded-lg border border-white/10 focus:outline-none focus:border-white/30 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      style={{
                        color: 'var(--primary-color)',
                        fontWeight: 'bold'
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg border border-white/5">
                    <div>
                      <p className="text-white font-semibold text-sm">Thirst Threshold</p>
                      <p className="text-white/50 text-xs">Show when below this value</p>
                    </div>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={settings.thirstThreshold}
                      onChange={(e) => {
                        const val = Number(e.currentTarget.value);
                        if (val >= 0 && val <= 100) {
                          updateSetting("thirstThreshold", val);
                        }
                      }}
                      className="w-16 px-2 py-1 bg-black/50 text-white text-center rounded-lg border border-white/10 focus:outline-none focus:border-white/30 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      style={{
                        color: 'var(--primary-color)',
                        fontWeight: 'bold'
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg border border-white/5">
                    <div>
                      <p className="text-white font-semibold text-sm">Stress Threshold</p>
                      <p className="text-white/50 text-xs">Show when above this value</p>
                    </div>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={settings.stressThreshold}
                      onChange={(e) => {
                        const val = Number(e.currentTarget.value);
                        if (val >= 0 && val <= 100) {
                          updateSetting("stressThreshold", val);
                        }
                      }}
                      className="w-16 px-2 py-1 bg-black/50 text-white text-center rounded-lg border border-white/10 focus:outline-none focus:border-white/30 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      style={{
                        color: 'var(--primary-color)',
                        fontWeight: 'bold'
                      }}
                    />
                  </div>
                </div>
                  </div>
                </>
              )}
            </div>

            <div className="border-t border-white/10 pt-3 mt-2">
              <p className="text-white/70 text-xs mb-2 font-semibold">Other Options</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center justify-between p-2 bg-black/30 rounded-lg border border-white/5">
                  <span className="text-white text-sm">Health</span>
                  <ToggleSwitch
                    checked={settings.showHealth}
                    onChange={(val) => updateSetting("showHealth", val)}
                  />
                </div>

                <div className="flex items-center justify-between p-2 bg-black/30 rounded-lg border border-white/5">
                  <span className="text-white text-sm">Vehicle HUD</span>
                  <ToggleSwitch
                    checked={settings.showVehicleHud}
                    onChange={(val) => updateSetting("showVehicleHud", val)}
                  />
                </div>

                <div className="flex items-center justify-between p-2 bg-black/30 rounded-lg border border-white/5">
                  <span className="text-white text-sm">Compass</span>
                  <ToggleSwitch
                    checked={settings.showCompass}
                    onChange={(val) => updateSetting("showCompass", val)}
                  />
                </div>

                <div className="flex items-center justify-between p-2 bg-black/30 rounded-lg border border-white/5">
                  <span className="text-white text-sm">Voice</span>
                  <ToggleSwitch
                    checked={settings.showVoice}
                    onChange={(val) => updateSetting("showVoice", val)}
                  />
                </div>

                <div className="flex items-center justify-between p-2 bg-black/30 rounded-lg border border-white/5">
                  <span className="text-white text-sm">Waypoint</span>
                  <ToggleSwitch
                    checked={settings.showWaypoint}
                    onChange={(val) => updateSetting("showWaypoint", val)}
                  />
                </div>

                <div className="flex items-center justify-between p-2 bg-black/30 rounded-lg border border-white/5">
                  <span className="text-white text-sm">Ammo</span>
                  <ToggleSwitch
                    checked={settings.showAmmo}
                    onChange={(val) => updateSetting("showAmmo", val)}
                  />
                </div>

                <div className="flex items-center justify-between p-2 bg-black/30 rounded-lg border border-white/5">
                  <span className="text-white text-sm">Oxygen</span>
                  <ToggleSwitch
                    checked={settings.showOxygen}
                    onChange={(val) => updateSetting("showOxygen", val)}
                  />
                </div>

                <div className="flex items-center justify-between p-2 bg-black/30 rounded-lg border border-white/5">
                  <span className="text-white text-sm">Odometer</span>
                  <ToggleSwitch
                    checked={settings.showOdometer}
                    onChange={(val) => updateSetting("showOdometer", val)}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "colors" && (
          <div className="flex gap-3">
            <div className="bg-black/20 border border-white/5 rounded-lg p-3 flex-1">
              <p className="text-white font-semibold text-sm mb-3">Interface Colors</p>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <button
                  onClick={() => setSelectedInterface("primary")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedInterface === "primary"
                      ? "text-black"
                      : "bg-black/50 text-white/70"
                  }`}
                  style={{
                    backgroundColor: selectedInterface === "primary" ? settings.primaryColor : undefined
                  }}
                >
                  Primary
                </button>
                <button
                  onClick={() => setSelectedInterface("secondary")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedInterface === "secondary"
                      ? "text-black"
                      : "bg-black/50 text-white/70"
                  }`}
                  style={{
                    backgroundColor: selectedInterface === "secondary" ? settings.secondaryColor : undefined
                  }}
                >
                  Secondary
                </button>
                <button
                  onClick={() => setSelectedInterface("carhud")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedInterface === "carhud"
                      ? "text-black"
                      : "bg-black/50 text-white/70"
                  }`}
                  style={{
                    backgroundColor: selectedInterface === "carhud" ? settings.primaryColor : undefined
                  }}
                >
                  Car HUD
                </button>
                <button
                  onClick={() => setSelectedInterface("compass")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedInterface === "compass"
                      ? "text-black"
                      : "bg-black/50 text-white/70"
                  }`}
                  style={{
                    backgroundColor: selectedInterface === "compass" ? settings.primaryColor : undefined
                  }}
                >
                  Compass
                </button>
              </div>

              <div className="bg-black/30 p-2 rounded-lg border border-white/5 mb-3" style={{ minHeight: '2.5rem', display: 'flex', alignItems: 'center' }}>
                <p className="text-white/50 text-xs leading-relaxed">
                  {selectedInterface === "primary"
                    ? "Voice indicator color"
                    : selectedInterface === "secondary"
                    ? "UI elements and settings color"
                    : selectedInterface === "carhud"
                    ? "Speedometer and vehicle indicators"
                    : "Compass, odometer and waypoint"}
                </p>
              </div>

              <CustomColorPicker
                value={
                  selectedInterface === "primary"
                    ? settings.primaryColor
                    : selectedInterface === "secondary"
                    ? settings.secondaryColor
                    : selectedInterface === "carhud"
                    ? settings.carHudColor
                    : settings.compassColor
                }
                onChange={(color) => {
                  if (selectedInterface === "primary") {
                    updateSetting("primaryColor", color);
                  } else if (selectedInterface === "secondary") {
                    updateSetting("secondaryColor", color);
                  } else if (selectedInterface === "carhud") {
                    updateSetting("carHudColor", color);
                  } else {
                    updateSetting("compassColor", color);
                  }
                }}
              />
            </div>

            <div className="bg-black/20 border border-white/5 rounded-lg p-3 flex-1">
              <p className="text-white font-semibold text-sm mb-3">Status Colors</p>

              <div className="grid grid-cols-3 gap-1.5 mb-3 bg-black/30 p-2 rounded-lg border border-white/5">
                <button
                  onClick={() => setSelectedStatus("health")}
                  className={`flex flex-col items-center gap-0.5 p-1.5 rounded transition-all ${
                    selectedStatus === "health" ? "bg-white/10 scale-105" : "hover:bg-white/5"
                  }`}
                >
                  <TiHeartFullOutline className="text-lg" style={{ color: settings.healthColor }} />
                  <span className="text-white/70" style={{ fontSize: '0.6rem' }}>Health</span>
                </button>

                <button
                  onClick={() => setSelectedStatus("armor")}
                  className={`flex flex-col items-center gap-0.5 p-1.5 rounded transition-all ${
                    selectedStatus === "armor" ? "bg-white/10 scale-105" : "hover:bg-white/5"
                  }`}
                >
                  <BiSolidShieldAlt2 className="text-lg" style={{ color: settings.armorColor }} />
                  <span className="text-white/70" style={{ fontSize: '0.6rem' }}>Armor</span>
                </button>

                <button
                  onClick={() => setSelectedStatus("hunger")}
                  className={`flex flex-col items-center gap-0.5 p-1.5 rounded transition-all ${
                    selectedStatus === "hunger" ? "bg-white/10 scale-105" : "hover:bg-white/5"
                  }`}
                >
                  <IoFastFood className="text-lg" style={{ color: settings.hungerColor }} />
                  <span className="text-white/70" style={{ fontSize: '0.6rem' }}>Hunger</span>
                </button>

                <button
                  onClick={() => setSelectedStatus("thirst")}
                  className={`flex flex-col items-center gap-0.5 p-1.5 rounded transition-all ${
                    selectedStatus === "thirst" ? "bg-white/10 scale-105" : "hover:bg-white/5"
                  }`}
                >
                  <FaBottleWater className="text-lg" style={{ color: settings.thirstColor }} />
                  <span className="text-white/70" style={{ fontSize: '0.6rem' }}>Thirst</span>
                </button>

                <button
                  onClick={() => setSelectedStatus("stress")}
                  className={`flex flex-col items-center gap-0.5 p-1.5 rounded transition-all ${
                    selectedStatus === "stress" ? "bg-white/10 scale-105" : "hover:bg-white/5"
                  }`}
                >
                  <FaBrain className="text-lg" style={{ color: settings.stressColor }} />
                  <span className="text-white/70" style={{ fontSize: '0.6rem' }}>Stress</span>
                </button>

                <button
                  onClick={() => setSelectedStatus("stamina")}
                  className={`flex flex-col items-center gap-0.5 p-1.5 rounded transition-all ${
                    selectedStatus === "stamina" ? "bg-white/10 scale-105" : "hover:bg-white/5"
                  }`}
                >
                  <FaPersonRunning className="text-lg" style={{ color: settings.staminaColor }} />
                  <span className="text-white/70" style={{ fontSize: '0.6rem' }}>Stamina</span>
                </button>
              </div>

              <CustomColorPicker
                value={
                  selectedStatus === "health" ? settings.healthColor :
                  selectedStatus === "armor" ? settings.armorColor :
                  selectedStatus === "hunger" ? settings.hungerColor :
                  selectedStatus === "thirst" ? settings.thirstColor :
                  selectedStatus === "stress" ? settings.stressColor :
                  settings.staminaColor
                }
                onChange={(color) => {
                  if (selectedStatus === "health") updateSetting("healthColor", color);
                  else if (selectedStatus === "armor") updateSetting("armorColor", color);
                  else if (selectedStatus === "hunger") updateSetting("hungerColor", color);
                  else if (selectedStatus === "thirst") updateSetting("thirstColor", color);
                  else if (selectedStatus === "stress") updateSetting("stressColor", color);
                  else if (selectedStatus === "stamina") updateSetting("staminaColor", color);
                }}
              />
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

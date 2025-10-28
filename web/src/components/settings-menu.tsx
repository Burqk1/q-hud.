import { useHudSettingsStore, saveSettings, getDefaultSettings } from "@/states/settings";
import { useMinimapStateStore } from "@/states/minimap";
import { useNuiEvent } from "@/hooks/useNuiEvent";
import { useCallback, useEffect, useState } from "preact/hooks";
import { IoClose, IoSettingsSharp } from "react-icons/io5";
import { MdRefresh } from "react-icons/md";
import { fetchNui } from "@/utils/fetchNui";
import SettingsTabs from "./settings-tabs";

export default function SettingsMenu() {
  const [settings, setSettings] = useHudSettingsStore();
  const [, setMinimap] = useMinimapStateStore();
  const [isClosing, setIsClosing] = useState(false);

  const resetToDefaults = useCallback(() => {
    setSettings((prev) => {
      const newSettings = { ...getDefaultSettings(), isSettingsOpen: prev.isSettingsOpen };
      saveSettings(newSettings);
      return newSettings;
    });

    fetchNui("resetMinimapPosition")
      .then((newMinimap: any) => {
        if (newMinimap) {
          setMinimap(newMinimap);
        }
      })
      .catch((err) => console.error("Failed to reset minimap position:", err));
  }, [setSettings, setMinimap]);

  const closeSettings = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
  }, [isClosing]);

  useEffect(() => {
    if (isClosing) {
      const timer = setTimeout(() => {
        setSettings((prev) => ({ ...prev, isSettingsOpen: false }));
        setIsClosing(false);
        fetchNui("closeSettings");
      }, 350);

      return () => clearTimeout(timer);
    }
  }, [isClosing, setSettings]);

  useNuiEvent<boolean>("toggleSettings", (shouldOpen) => {
    setSettings((prev) => ({ ...prev, isSettingsOpen: shouldOpen ?? !prev.isSettingsOpen }));
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && settings.isSettingsOpen) {
        closeSettings();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [settings.isSettingsOpen, closeSettings]);

  return (
    <>
      {settings.isSettingsOpen && (
        <div className={`fixed inset-0 z-[9998] flex items-center justify-center ${isClosing ? 'animate-fadeOut' : 'animate-fadeIn'}`}
          // style={{
          //   backdropFilter: 'blur(4px)',
          // }}
        >
          <div
            className={`relative ${isClosing ? 'animate-slideOut' : 'animate-slideIn'}`}
            style={{
              background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.95) 0%, rgba(10, 14, 18, 0.98) 100%)',
              borderRadius: '1.25rem',
              padding: '2rem',
              width: '42rem',
              maxWidth: '90vw',
              maxHeight: '90vh',
              // border: '1px solid rgba(148, 240, 36, 0.2)',
              // boxShadow: `
              //   0 0 60px rgba(148, 240, 36, 0.15),
              //   0 20px 50px rgba(0, 0, 0, 0.5),
              //   inset 0 1px 0 rgba(255, 255, 255, 0.05)
              // `
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '60%',
                height: '2px',
                background: 'linear-gradient(90deg, transparent, var(--primary-color), transparent)',
                filter: 'blur(4px)',
              }}
            />

            <div className="flex items-center justify-between mb-6 pb-4" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div className="flex items-center gap-3">
                <div
                  style={{
                    padding: '0.75rem',
                    borderRadius: '0.75rem',
                    background: `${settings.secondaryColor}1A`,
                    border: `1px solid ${settings.secondaryColor}4D`,
                  }}
                >
                  <IoSettingsSharp style={{ color: 'var(--secondary-color)' }} className="text-2xl" />
                </div>
                <div>
                  <h2 className="text-white text-2xl font-bold tracking-tight">HUD Settings</h2>
                  <p className="text-white/40 text-xs mt-0.5">Customize your experience</p>
                </div>
              </div>
              <button
                onClick={closeSettings}
                className="hover:bg-white/10 transition-all group"
                style={{
                  padding: '0.75rem',
                  borderRadius: '0.75rem',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                }}
              >
                <IoClose className="text-white/70 group-hover:text-white text-2xl transition-colors" />
              </button>
            </div>

            <SettingsTabs />

            <div
              className="flex items-center justify-between mt-6 pt-4"
              style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}
            >
              <div className="flex items-center gap-2">
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-color)',
                    boxShadow: '0 0 8px var(--primary-color)',
                  }}
                />
                <p className="text-white/40 text-sm">
                  Changes save automatically
                </p>
              </div>
              <button
                onClick={resetToDefaults}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all group"
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                  e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                }}
              >
                <MdRefresh className="text-red-400 group-hover:text-red-300 text-lg transition-colors" />
                <span className="text-red-400 group-hover:text-red-300 text-sm font-semibold transition-colors">Reset Defaults</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

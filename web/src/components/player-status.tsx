import { useNuiEvent } from "@/hooks/useNuiEvent";
import { useMinimapState } from "@/states/minimap";
import { PlayerStateInterface, usePlayerStateStore } from "@/states/player";
import { useHudSettingsStore, saveSettings } from "@/states/settings";
import { fetchNui } from "@/utils/fetchNui";
import React, { useCallback, useMemo, useState, useEffect, useRef } from "preact/compat";
import { BiSolidShieldAlt2 } from "react-icons/bi";
import { FaBottleWater, FaBrain, FaPersonRunning } from "react-icons/fa6";
import { IoFastFood } from "react-icons/io5";
import { TiHeartFullOutline } from "react-icons/ti";
import { GiScubaTanks } from "react-icons/gi";
import { StatBar, StatBarSegmented } from "./ui/status-bars";
import ResizableEditControls from "./ui/resizable-edit-controls";

const PlayerStatus = () => {
  const [playerState, setPlayerState] = usePlayerStateStore();
  const minimap = useMinimapState();
  const [settings, setSettings] = useHudSettingsStore();
  const [showStamina, setShowStamina] = useState(false);
  const [showArmor, setShowArmor] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const [smoothValues, setSmoothValues] = useState({
    health: playerState.health,
    armor: playerState.armor,
    hunger: playerState.hunger,
    thirst: playerState.thirst,
    stress: typeof playerState.stress === 'number' ? playerState.stress : 0,
    stamina: playerState.stamina,
    oxygen: playerState.oxygen,
  });

  const handlePlayerStateUpdate = useCallback(
    (newState: PlayerStateInterface) => {
      setPlayerState((prevState) => {
        if (JSON.stringify(prevState) !== JSON.stringify(newState)) {
          return newState;
        }
        return prevState;
      });
    },
    [setPlayerState],
  );

  useNuiEvent<PlayerStateInterface>("setPlayerState", handlePlayerStateUpdate);

  useEffect(() => {
    const interpolationSpeed = 0.08; // Lower = smoother
    let animationFrameId: number;
    let isRunning = true;

    const animate = () => {
      if (!isRunning) return;

      setSmoothValues((prev) => {
        const newValues = { ...prev };

        const interpolate = (current: number, target: number) => {
          const diff = target - current;
          if (Math.abs(diff) < 0.1) return target;
          return current + diff * interpolationSpeed;
        };

        newValues.health = interpolate(prev.health, playerState.health);
        newValues.armor = interpolate(prev.armor, playerState.armor);
        newValues.hunger = interpolate(prev.hunger, playerState.hunger || 0);
        newValues.thirst = interpolate(prev.thirst, playerState.thirst || 0);
        newValues.stress = interpolate(prev.stress, typeof playerState.stress === 'number' ? playerState.stress : 0);
        newValues.stamina = interpolate(prev.stamina, playerState.stamina);
        newValues.oxygen = interpolate(prev.oxygen, playerState.oxygen);

        return newValues;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      isRunning = false;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [
    playerState.health,
    playerState.armor,
    playerState.hunger,
    playerState.thirst,
    typeof playerState.stress === 'number' ? playerState.stress : 0,
    playerState.stamina,
    playerState.oxygen
  ]);

  useEffect(() => {
    const shouldShow = playerState.stamina < 100 && !playerState.isUnderwater;

    if (shouldShow) {
      setShowStamina(true);
    } else if (showStamina) {
      const timer = setTimeout(() => {
        setShowStamina(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [playerState.stamina, playerState.isUnderwater, showStamina]);

  useEffect(() => {
    if (playerState.armor > 0) {
      setShowArmor(true);
    } else if (playerState.armor === 0 && showArmor) {
      const timer = setTimeout(() => {
        setShowArmor(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [playerState.armor, showArmor]);

  const isUsingFramework = useMemo(() => {
    return playerState.hunger !== undefined || playerState.thirst !== undefined;
  }, [playerState]);

  const handleResize = useCallback((newScale: number) => {
    setSettings((prev) => {
      const newSettings = { ...prev, playerStatusScale: newScale };
      saveSettings(newSettings);
      return newSettings;
    });
  }, [setSettings]);

  const handleMouseDown = useCallback((e: any) => {
    if (!settings.isEditMode) return;
    e.preventDefault();
    setIsDragging(true);
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  }, [settings.isEditMode]);

  const handleMouseMove = useCallback((e: any) => {
    if (!isDragging || !settings.isEditMode) return;
    e.preventDefault();
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;

    setSettings((prev) => {
      const newSettings = { ...prev, playerStatusPosition: { x: newX, y: newY } };
      saveSettings(newSettings);
      return newSettings;
    });
  }, [isDragging, dragOffset, settings.isEditMode, setSettings]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (!settings.isEditMode) return;

    const moveHandler = (e: any) => handleMouseMove(e);
    const upHandler = () => handleMouseUp();

    document.addEventListener('mousemove', moveHandler);
    document.addEventListener('mouseup', upHandler);

    return () => {
      document.removeEventListener('mousemove', moveHandler);
      document.removeEventListener('mouseup', upHandler);
    };
  }, [settings.isEditMode, handleMouseMove, handleMouseUp]);

  return (
    <>
      <div
        ref={containerRef}
        class="absolute z-20"
        style={{
          backfaceVisibility: "hidden",
          top: settings.playerStatusPosition.x !== 0 || settings.playerStatusPosition.y !== 0
            ? `${settings.playerStatusPosition.y}px`
            : `${minimap.top}%`,
          left: settings.playerStatusPosition.x !== 0 || settings.playerStatusPosition.y !== 0
            ? `${settings.playerStatusPosition.x}px`
            : `${minimap.left}%`,
          minWidth: minimap.width + "px",
          transform: `scale(${settings.playerStatusScale / 100})`,
          transformOrigin: 'top left',
          zIndex: settings.isEditMode ? 9998 : 20,
        }}
      >
        <div
          style={{
            border: settings.isEditMode ? '2px dashed rgba(148, 240, 36, 0.5)' : 'none',
            padding: settings.isEditMode ? '0.5rem 0.5rem 0 0.5rem' : '0',
            position: 'relative',
            cursor: settings.isEditMode ? 'move' : 'default',
          }}
          onMouseDown={handleMouseDown}
        >
          {settings.isEditMode && (
            <ResizableEditControls
              onResize={handleResize}
              scale={settings.playerStatusScale}
            />
          )}
          <div
            className="w-full flex relative items-center justify-center"
            style={{
              height: minimap.height + 50 + "px",
              alignItems: 'flex-end',
              pointerEvents: settings.isEditMode ? 'none' : 'auto',
              gap: '0.75em',
            }}
          >
          {isUsingFramework && (
            <div
              className="flex items-center transition-all duration-500 ease-in-out absolute"
              style={{
                minHeight: '4dvh',
                gap: '0.55em',
                bottom: !playerState.isInVehicle
                  ? (showArmor && playerState.armor > 0 ? '2.6em' : '2.3em')
                  : (showArmor && playerState.armor > 0 ? '0' : '1.1em'),
                left: !playerState.isInVehicle ? '2.5em' : `${minimap.width + 12}px`,
                zIndex: 10,
              }}
            >
              {settings.showHunger && playerState.hunger <= settings.hungerThreshold && (
                <StatBar
                  Icon={IoFastFood}
                  value={Math.round(smoothValues.hunger)}
                  vertical
                  color={`var(--hunger-color)`}
                />
              )}
              {settings.showThirst && playerState.thirst <= settings.thirstThreshold && (
                <StatBar
                  Icon={FaBottleWater}
                  value={Math.round(smoothValues.thirst)}
                  color={`var(--thirst-color)`}
                  vertical
                />
              )}
              {settings.showStress &&
                typeof playerState.stress === "number" &&
                playerState.stress >= settings.stressThreshold && (
                  <StatBar
                    Icon={FaBrain}
                    value={Math.round(smoothValues.stress)}
                    color={`var(--stress-color)`}
                    vertical
                  />
                )}
              {playerState.isUnderwater ? (
                settings.showOxygen && (
                  <StatBar
                    Icon={GiScubaTanks}
                    value={Math.round(smoothValues.oxygen)}
                    color={`var(--stamina-color)`}
                    vertical
                  />
                )
              ) : (
                showStamina && (
                  <div
                    className="transition-all duration-500 ease-in-out"
                    style={{
                      opacity: playerState.stamina < 100 ? 1 : 0,
                      transform: playerState.stamina < 100 ? 'scale(1)' : 'scale(0.8)',
                    }}
                  >
                    <StatBar
                      Icon={FaPersonRunning}
                      value={Math.round(smoothValues.stamina)}
                      color={`var(--stamina-color)`}
                      vertical
                    />
                  </div>
                )
              )}
            </div>
          )}

          <div
            className="flex flex-col items-center justify-center relative"
            style={{ width: minimap.width + "px", flexShrink: 0, gap: '0.25em' }}
          >
            {settings.showArmor && (
              <div
                className="transition-all duration-500 ease-in-out w-full"
                style={{
                  opacity: showArmor && playerState.armor > 0 ? 1 : 0,
                  maxHeight: showArmor && playerState.armor > 0 ? '100px' : '0px',
                  overflow: 'hidden',
                }}
              >
                <StatBarSegmented
                  Icon={BiSolidShieldAlt2}
                  value={Math.round(smoothValues.armor)}
                  color={`var(--armor-color)`}
                />
              </div>
            )}

            {settings.showHealth && (
              <div
                className="transition-all duration-500 ease-in-out w-full"
                style={{
                  transform: (settings.showArmor && showArmor && playerState.armor > 0)
                    ? 'translateY(0)'
                    : 'translateY(-1.2em)',
                }}
              >
                <StatBar
                  Icon={TiHeartFullOutline}
                  value={Math.round(smoothValues.health)}
                  maxValue={100}
                  color={`var(--health-color)`}
                />
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(PlayerStatus);

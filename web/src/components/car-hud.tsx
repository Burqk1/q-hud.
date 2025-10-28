import { useNuiEvent } from "@/hooks/useNuiEvent";
import { usePlayerState } from "@/states/player";
import { useWeaponState } from "@/states/weapon";
import { useHudSettings, useHudSettingsStore, saveSettings } from "@/states/settings";
import {
  useVehicleStateStore,
  type VehicleStateInterface,
} from "@/states/vehicle";
import { debug } from "@/utils/debug";
import React, { useCallback, useMemo, useState, useEffect, useRef } from "react";
import Speedometer from "./ui/speedometer";
import { TextProgressBar } from "./ui/text-progress-bar";
import ResizableEditControls from "./ui/resizable-edit-controls";

const CarHud = React.memo(function CarHud() {
  const [vehicleState, setVehicleState] = useVehicleStateStore();
  const playerState = usePlayerState();
  const weaponState = useWeaponState();
  const [settings, setSettings] = useHudSettingsStore();
  const [isExiting, setIsExiting] = useState(false);
  const [shouldRender, setShouldRender] = useState(playerState.isInVehicle);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleVehicleStateUpdate = useCallback(
    (newState: VehicleStateInterface) => {
      setVehicleState((prevState) => {
        if (JSON.stringify(prevState) !== JSON.stringify(newState)) {
          return newState;
        }
        return prevState;
      });
    },
    [setVehicleState],
  );

  useNuiEvent<VehicleStateInterface>(
    "setVehicleState",
    handleVehicleStateUpdate,
  );

  useEffect(() => {
    if (settings.isEditMode) {
      setShouldRender(true);
      setIsExiting(false);
      return;
    }

    if (!playerState.isInVehicle && shouldRender) {
      setIsExiting(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsExiting(false);
      }, 450);
      return () => clearTimeout(timer);
    } else if (playerState.isInVehicle && !shouldRender) {
      setShouldRender(true);
      setIsExiting(false);
    }
  }, [playerState.isInVehicle, shouldRender, settings.isEditMode]);

  const handleResize = useCallback((newScale: number) => {
    setSettings((prev) => {
      const newSettings = { ...prev, carHudScale: newScale };
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
      const newSettings = { ...prev, carHudPosition: { x: newX, y: newY } };
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

  if (!shouldRender) {
    debug(
      "(CarHud) Returning with no children since the player is not in a vehicle.",
    );
    return null;
  }

  const getPosition = () => {
    if (settings.carHudPosition.x !== 0 || settings.carHudPosition.y !== 0) {
      return {
        left: `${settings.carHudPosition.x}px`,
        top: `${settings.carHudPosition.y}px`,
      };
    }

    const baseRight = weaponState.hasWeapon ? '9rem' : '4rem';

    return {
      right: baseRight,
      bottom: '1.25rem',
    };
  };

  return (
    <div
      ref={containerRef}
      className={`absolute 4k:-mt-14 ${
        isExiting ? 'animate-zoomOut' : 'animate-zoomIn'
      }`}
      style={{
        ...getPosition(),
        transformOrigin: settings.carHudPosition.x !== 0 || settings.carHudPosition.y !== 0 ? 'top left' : 'bottom right',
        transition: 'right 600ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        zIndex: settings.isEditMode ? 9998 : undefined,
      }}
    >
      <div
        style={{
          cursor: settings.isEditMode ? 'move' : 'default',
          border: settings.isEditMode ? '2px dashed rgba(148, 240, 36, 0.5)' : 'none',
          padding: settings.isEditMode ? '0.5rem 0.5rem 0 0.5rem' : '0',
          flexDirection: 'column',
          gap: '0.5rem',
          display: 'flex',
          position: 'relative',
          alignItems: 'center',
          transform: `scale(${settings.carHudScale / 100})`,
          transformOrigin: 'center',
        }}
        onMouseDown={handleMouseDown}
      >
        {settings.isEditMode && (
          <ResizableEditControls
            onResize={handleResize}
            scale={settings.carHudScale}
          />
        )}
        <div style={{ pointerEvents: settings.isEditMode ? 'none' : 'auto' }}>
          <Speedometer
            rpm={vehicleState.rpm}
            speed={vehicleState.speed}
            gears={vehicleState.gears}
            engineHealth={vehicleState.engineHealth}
            maxRpm={100}
          />
        </div>
        <div className="flex items-center 4k:-mt-14" style={{ gap: '0.5rem', marginRight: '0.5rem', pointerEvents: settings.isEditMode ? 'none' : 'auto' }}>
          <TextProgressBar label="FUEL" value={vehicleState.fuel} />
          <TextProgressBar
            label="ENG"
            value={vehicleState.engineState ? 100 : 0}
          />
          <TextProgressBar
            label="BELT"
            value={playerState.isSeatbeltOn ? 100 : 0}
          />
        </div>
      </div>
    </div>
  );
});

export default CarHud;

import { usePlayerState } from "@/states/player";
import { useHudSettings, useHudSettingsStore, saveSettings } from "@/states/settings";
import React, { useCallback, useState, useRef } from "preact/compat";
import { FaCompass, FaLocationDot, FaMap } from "react-icons/fa6";
import IconLabelBox from "./ui/icon-label-box";
import { useCompassLocation } from "@/states/compass-location";
import ResizableEditControls from "./ui/resizable-edit-controls";

const Compass = () => {
  const playerState = usePlayerState();
  const compassLocation = useCompassLocation();
  const [settings, setSettings] = useHudSettingsStore();
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleResize = useCallback((newScale: number) => {
    setSettings((prev) => {
      const newSettings = { ...prev, compassScale: newScale };
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
      const newSettings = { ...prev, compassPosition: { x: newX, y: newY } };
      saveSettings(newSettings);
      return newSettings;
    });
  }, [isDragging, dragOffset, settings.isEditMode, setSettings]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
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

  if (!settings.isEditMode && settings.compassOnlyInVehicle && !playerState.isInVehicle) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={
        compassLocation === "bottom"
          ? "flex absolute w-full h-fit items-center justify-center"
          : "flex w-full items-center justify-center"
      }
      style={{
        ...(compassLocation === "bottom" ? { bottom: '0.25rem' } : { height: '6.25rem' }),
        top: settings.compassPosition.y !== 0 ? `${settings.compassPosition.y}px` : undefined,
        left: settings.compassPosition.x !== 0 ? `${settings.compassPosition.x}px` : undefined,
        transform: `scale(${settings.compassScale / 100})`,
        transformOrigin: 'top center',
        position: settings.compassPosition.x !== 0 || settings.compassPosition.y !== 0 ? 'absolute' as const : undefined,
      }}
    >
      <div
        style={{
          cursor: settings.isEditMode ? 'move' : 'default',
          border: settings.isEditMode ? '2px dashed rgba(148, 240, 36, 0.5)' : 'none',
          padding: settings.isEditMode ? '0.5rem 0.5rem 0 0.5rem' : '0',
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onMouseDown={handleMouseDown}
      >
        {settings.isEditMode && (
          <ResizableEditControls
            onResize={handleResize}
            scale={settings.compassScale}
          />
        )}
        <div className="flex items-center justify-center" style={{ gap: '0.75rem', width: 'auto', minWidth: '600px', pointerEvents: settings.isEditMode ? 'none' : 'auto' }}>
          <IconLabelBox label={playerState.heading} Icon={FaCompass} />
          <IconLabelBox
            label={playerState.streetLabel}
            className="min-w-[20%]"
            Icon={FaLocationDot}
          />
          <IconLabelBox
            label={playerState.areaLabel}
            Icon={FaMap}
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(Compass);

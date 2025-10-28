import { useVehicleState } from "@/states/vehicle";
import { useMinimapState } from "@/states/minimap";
import { usePlayerState } from "@/states/player";
import { useWaypointState } from "@/states/waypoint";
import { useHudSettings } from "@/states/settings";
import React, { useMemo } from "preact/compat";
import { TbRoad } from "react-icons/tb";
import IconLabelBox from "./ui/icon-label-box";

const VehicleOdometer = () => {
  const vehicleState = useVehicleState();
  const minimap = useMinimapState();
  const playerState = usePlayerState();
  const waypointState = useWaypointState();
  const settings = useHudSettings();

  const formattedOdometer = useMemo(() => {
    const km = vehicleState.odometer.toLocaleString('en-US', { maximumFractionDigits: 0 });
    return `${km} km`;
  }, [vehicleState.odometer]);

  const shouldSlideRight = settings.isEditMode || waypointState.hasWaypoint;

  if (!settings.isEditMode && !playerState.isInVehicle) {
    return null;
  }

  const hasCustomPosition = settings.playerStatusPosition.x !== 0 || settings.playerStatusPosition.y !== 0;

  const topPosition = hasCustomPosition
    ? `${settings.playerStatusPosition.y - 50}px`
    : `calc(${minimap.top}% - 3.125rem)`;

  const leftPosition = hasCustomPosition
    ? (shouldSlideRight ? `${settings.playerStatusPosition.x + 116}px` : `${settings.playerStatusPosition.x + 4}px`)
    : (shouldSlideRight ? `calc(${minimap.left}% + 7.25rem)` : `calc(${minimap.left}% + 0.25rem)`);

  return (
    <div
      className="absolute z-10"
      style={{
        top: topPosition,
        left: leftPosition,
        transform: `scale(${settings.playerStatusScale / 100})`,
        transformOrigin: 'top left',
        transition: 'left 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      <IconLabelBox
        label={formattedOdometer}
        Icon={TbRoad}
      />
    </div>
  );
};

export default React.memo(VehicleOdometer);

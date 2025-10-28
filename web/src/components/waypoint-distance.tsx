import { useWaypointStateStore, type WaypointStateInterface } from "@/states/waypoint";
import { useHudSettings } from "@/states/settings";
import { useMinimapState } from "@/states/minimap";
import { usePlayerState } from "@/states/player";
import { useNuiEvent } from "@/hooks/useNuiEvent";
import React, { useCallback, useMemo } from "preact/compat";
import { MdLocationOn } from "react-icons/md";
import IconLabelBox from "./ui/icon-label-box";

const WaypointDistance = () => {
  const [waypointState, setWaypointState] = useWaypointStateStore();
  const settings = useHudSettings();
  const minimap = useMinimapState();
  const playerState = usePlayerState();

  const handleWaypointUpdate = useCallback(
    (newState: WaypointStateInterface) => {
      setWaypointState(newState);
    },
    [setWaypointState]
  );

  useNuiEvent<WaypointStateInterface>("setWaypointState", handleWaypointUpdate);

  const displayDistance = useMemo(() => {
    if (!waypointState.hasWaypoint) {
      return null;
    }

    if (settings.speedUnit === "kmh") {
      return `${(waypointState.distance / 1000).toFixed(1)} km`;
    } else {
      const miles = waypointState.distance * 0.000621371;
      return `${miles.toFixed(1)} mi`;
    }
  }, [waypointState.distance, waypointState.hasWaypoint, settings.speedUnit]);

  if (!settings.isEditMode) {
    if (!waypointState.hasWaypoint || !displayDistance || !playerState.isInVehicle) {
      return null;
    }
  }

  const finalDistance = settings.isEditMode && !waypointState.hasWaypoint
    ? "0.0 km"
    : displayDistance;

  const hasCustomPosition = settings.playerStatusPosition.x !== 0 || settings.playerStatusPosition.y !== 0;

  const topPosition = hasCustomPosition
    ? `${settings.playerStatusPosition.y - 50}px`
    : `calc(${minimap.top}% - 3.125rem)`;

  const leftPosition = hasCustomPosition
    ? `${settings.playerStatusPosition.x + 4}px`
    : `calc(${minimap.left}% + 0.25rem)`;

  return (
    <div
      className="absolute z-10 flex items-start justify-start"
      style={{
        top: topPosition,
        left: leftPosition,
        transform: `scale(${settings.playerStatusScale / 100})`,
        transformOrigin: 'top left',
      }}
    >
      <IconLabelBox
        label={finalDistance || "0.0 km"}
        Icon={MdLocationOn}
      />
    </div>
  );
};

export default React.memo(WaypointDistance);

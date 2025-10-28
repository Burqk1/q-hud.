import { useOxygenStateStore, type OxygenStateInterface } from "@/states/oxygen";
import { useHudSettings } from "@/states/settings";
import { useNuiEvent } from "@/hooks/useNuiEvent";
import React, { useCallback } from "preact/compat";
import { GiScubaTanks } from "react-icons/gi";

const OxygenBar = () => {
  const [oxygenState, setOxygenState] = useOxygenStateStore();
  const settings = useHudSettings();

  const handleOxygenUpdate = useCallback(
    (newState: OxygenStateInterface) => {
      setOxygenState(newState);
    },
    [setOxygenState]
  );

  useNuiEvent<OxygenStateInterface>("setOxygenState", handleOxygenUpdate);

  if (!oxygenState.isUnderwater || !settings.showOxygen) {
    return null;
  }

  const getOxygenColor = () => {
    if (oxygenState.oxygen > 50) return '#10aef5'; // Mavi
    if (oxygenState.oxygen > 25) return '#f59e0b'; // Turuncu
    return '#ef4444'; // Kırmızı
  };

  return (
    <div
      className="absolute z-10 flex items-center justify-center"
      style={{
        left: '50%',
        bottom: '3rem',
        transform: 'translateX(-50%)',
      }}
    >
      <div className="flex flex-col items-center gap-2 bg-black/40 backdrop-blur-sm px-4 py-3 rounded-lg border border-white/10">
        <div className="flex items-center gap-2">
          <GiScubaTanks
            className="text-2xl"
            style={{ color: getOxygenColor() }}
          />
          <span className="text-white/70 text-sm font-semibold">OXYGEN</span>
        </div>

        <div className="w-48 h-2 bg-black/50 rounded-full overflow-hidden border border-white/10">
          <div
            className="h-full transition-all duration-300 ease-out rounded-full"
            style={{
              width: `${oxygenState.oxygen}%`,
              backgroundColor: getOxygenColor(),
              boxShadow: `0 0 10px ${getOxygenColor()}`,
            }}
          />
        </div>

        <span
          className="text-lg font-bold"
          style={{
            color: getOxygenColor(),
            textShadow: `0 0 10px ${getOxygenColor()}`,
          }}
        >
          {Math.round(oxygenState.oxygen)}%
        </span>
      </div>
    </div>
  );
};

export default React.memo(OxygenBar);

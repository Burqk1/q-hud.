import { FiPlus, FiMinus } from "react-icons/fi";
import { JSX } from "preact";

interface EditControlsProps {
  onScaleUp: () => void;
  onScaleDown: () => void;
  scale: number;
}

export default function EditControls({ onScaleUp, onScaleDown, scale }: EditControlsProps) {
  const handleScaleDown = (e: JSX.TargetedMouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    onScaleDown();
  };

  const handleScaleUp = (e: JSX.TargetedMouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    onScaleUp();
  };

  const handleContainerMouseDown = (e: JSX.TargetedMouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const handleContainerClick = (e: JSX.TargetedMouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <div
      className="flex items-center bg-black/80 border border-white/20 backdrop-blur-sm"
      style={{
        padding: '0.25rem',
        borderRadius: '0.5rem',
        zIndex: 99999,
        gap: '0.25rem',
        pointerEvents: 'auto',
      }}
      onMouseDown={handleContainerMouseDown}
      onClick={handleContainerClick}
    >
      <button
        onClick={handleScaleDown}
        onMouseDown={handleScaleDown}
        className="flex items-center justify-center bg-red-600/80 hover:bg-red-600 transition-all text-white cursor-pointer"
        style={{
          width: '1.5rem',
          height: '1.5rem',
          borderRadius: '0.25rem',
          pointerEvents: 'auto',
          border: 'none'
        }}
        type="button"
      >
        <FiMinus size={16} />
      </button>
      <span className="text-white text-xs font-bold text-center" style={{ minWidth: '3rem' }}>
        {scale}%
      </span>
      <button
        onClick={handleScaleUp}
        onMouseDown={handleScaleUp}
        className="flex items-center justify-center bg-green-600/80 hover:bg-green-600 transition-all text-white cursor-pointer"
        style={{
          width: '1.5rem',
          height: '1.5rem',
          borderRadius: '0.25rem',
          pointerEvents: 'auto',
          border: 'none'
        }}
        type="button"
      >
        <FiPlus size={16} />
      </button>
    </div>
  );
}

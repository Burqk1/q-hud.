import { useState } from "preact/hooks";
import { IconType } from "react-icons";

interface IconColorPickerProps {
  Icon: IconType;
  label: string;
  value: string;
  onChange: (color: string) => void;
}

const presetColors = [
  "#94f024", // Green
  "#10aef5", // Blue
  "#a855f7", // Purple
  "#ef4444", // Red
  "#f59e0b", // Yellow/Orange
  "#ec4899", // Pink
  "#fb923c", // Orange
  "#06b6d4", // Cyan
];

export default function IconColorPicker({
  Icon,
  label,
  value,
  onChange,
}: IconColorPickerProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [customColor, setCustomColor] = useState(value);

  const handleColorSelect = (color: string) => {
    onChange(color);
    setCustomColor(color);
    setShowPicker(false);
  };

  const handleCustomColorChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const newColor = target.value;
    setCustomColor(newColor);
    onChange(newColor);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowPicker(!showPicker)}
        className="flex items-center gap-2 px-3 py-2 bg-black/30 hover:bg-black/50 border border-white/10 rounded-lg transition-all"
      >
        <Icon className="text-2xl" style={{ color: value }} />
        <span className="text-white text-sm font-semibold">{label}</span>
      </button>

      {showPicker && (
        <div className="absolute top-full mt-2 left-0 z-[10000] bg-black/95 border border-white/10 rounded-lg p-3 backdrop-blur-sm shadow-2xl">
          <p className="text-white text-xs font-semibold mb-2">Preset Colors</p>
          <div className="grid grid-cols-4 gap-2 mb-3">
            {presetColors.map((color) => (
              <button
                key={color}
                onClick={() => handleColorSelect(color)}
                className={`w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 ${
                  value === color ? "border-white scale-110" : "border-white/20"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          <p className="text-white text-xs font-semibold mb-2">Custom Color</p>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={customColor}
              onChange={handleCustomColorChange}
              className="w-10 h-10 rounded cursor-pointer border-2 border-white/20"
            />
            <input
              type="text"
              value={customColor}
              onChange={(e) => {
                const target = e.target as HTMLInputElement;
                const newColor = target.value;
                if (newColor.match(/^#[0-9A-Fa-f]{6}$/)) {
                  setCustomColor(newColor);
                  onChange(newColor);
                } else {
                  setCustomColor(newColor);
                }
              }}
              className="flex-1 px-2 py-1 bg-black/50 text-white text-sm font-mono border border-white/10 rounded outline-none"
              placeholder="#000000"
              maxLength={7}
            />
          </div>
        </div>
      )}
    </div>
  );
}

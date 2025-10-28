import { useState } from "preact/hooks";

interface CompactColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  presetColors?: string[];
}

const defaultPresets = [
  "#94f024", "#10aef5", "#a855f7", "#ef4444",
  "#f59e0b", "#ec4899", "#fb923c", "#06b6d4"
];

export default function CompactColorPicker({
  value,
  onChange,
  presetColors = defaultPresets,
}: CompactColorPickerProps) {
  const [customColor, setCustomColor] = useState(value);

  const handlePresetClick = (color: string) => {
    onChange(color);
    setCustomColor(color);
  };

  const handleCustomColorChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const newColor = target.value;
    setCustomColor(newColor);
    onChange(newColor);
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Color Picker Input */}
      <div className="flex items-center gap-2 bg-black/50 p-1.5 rounded border border-white/10 w-fit">
        <input
          type="color"
          value={customColor}
          onChange={handleCustomColorChange}
          className="w-6 h-6 rounded cursor-pointer border border-white/20"
          style={{ backgroundColor: customColor }}
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
          className="bg-transparent text-white text-xs font-mono border-none outline-none"
          style={{ width: '5.5em' }}
          placeholder="#000000"
          maxLength={7}
        />
      </div>

      {/* Preset Colors - 4x2 Grid */}
      <div className="grid grid-cols-4 gap-1 w-fit">
        {presetColors.map((color) => (
          <button
            key={color}
            onClick={() => handlePresetClick(color)}
            className={`w-7 h-7 rounded border transition-all hover:scale-105 ${
              value === color
                ? "border-white scale-105"
                : "border-white/20"
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );
}

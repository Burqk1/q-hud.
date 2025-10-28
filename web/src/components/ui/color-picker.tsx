import { useState } from "preact/hooks";

interface ColorPickerProps {
  label: string;
  description?: string;
  value: string;
  onChange: (color: string) => void;
  presetColors?: { name: string; color: string }[];
}

const defaultPresets = [
  { name: "Green", color: "#94f024" },
  { name: "Blue", color: "#10aef5" },
  { name: "Purple", color: "#a855f7" },
  { name: "Red", color: "#ef4444" },
  { name: "Yellow", color: "#f59e0b" },
  { name: "Pink", color: "#ec4899" },
  { name: "Orange", color: "#fb923c" },
  { name: "Cyan", color: "#06b6d4" },
];

export default function ColorPicker({
  label,
  description,
  value,
  onChange,
  presetColors = defaultPresets,
}: ColorPickerProps) {
  const [showCustom, setShowCustom] = useState(false);
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
    <div className="flex flex-col p-3 bg-black/30 rounded-lg border border-white/5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-white font-semibold text-sm">{label}</p>
          {description && <p className="text-white/50 text-xs">{description}</p>}
        </div>
        <button
          onClick={() => setShowCustom(!showCustom)}
          className="px-3 py-1 rounded-lg text-xs font-semibold transition-all border-2"
          style={{
            backgroundColor: showCustom ? 'var(--primary-color)' : 'rgba(0, 0, 0, 0.5)',
            color: showCustom ? '#000' : 'rgba(255, 255, 255, 0.7)',
            borderColor: showCustom ? 'var(--primary-color)' : 'rgba(255, 255, 255, 0.1)',
          }}
        >
          {showCustom ? 'Presets' : 'Custom'}
        </button>
      </div>

      {showCustom ? (
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2 bg-black/50 p-2 rounded-lg border border-white/10">
            <input
              type="color"
              value={customColor}
              onChange={handleCustomColorChange}
              className="w-10 h-10 rounded cursor-pointer border-2 border-white/20"
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
              className="flex-1 bg-transparent text-white text-sm font-mono border-none outline-none"
              placeholder="#000000"
              maxLength={7}
            />
          </div>
          <div
            className="w-10 h-10 rounded-lg border-2 border-white/20"
            style={{ backgroundColor: value }}
          />
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {presetColors.map((preset) => (
            <button
              key={preset.color}
              onClick={() => handlePresetClick(preset.color)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all ${
                value === preset.color
                  ? "border-white bg-black/50 scale-105"
                  : "border-white/10 bg-black/30 hover:border-white/30 hover:scale-105"
              }`}
            >
              <div
                className="w-4 h-4 rounded-full border border-white/20"
                style={{ backgroundColor: preset.color }}
              />
              <span className="text-white text-xs">{preset.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

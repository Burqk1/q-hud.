import { useState, useRef, useEffect, useCallback } from "preact/hooks";

interface CustomColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

const presetColors = [
  "#94f024", "#10aef5", "#a855f7", "#ef4444",
  "#f59e0b", "#ec4899", "#fb923c", "#06b6d4"
];

export default function CustomColorPicker({ value, onChange }: CustomColorPickerProps) {
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(50);
  const [hexInput, setHexInput] = useState(value);
  const [isDraggingShade, setIsDraggingShade] = useState(false);
  const [isDraggingHue, setIsDraggingHue] = useState(false);

  const hueBarRef = useRef<HTMLDivElement>(null);
  const shadeBoxRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  // Convert hex to HSL on mount and when value changes
  useEffect(() => {
    const hex = value.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    setHue(h * 360);
    setSaturation(s * 100);
    setLightness(l * 100);
    setHexInput(value);
  }, [value]);

  // Convert HSL to Hex
  const hslToHex = (h: number, s: number, l: number): string => {
    h = h / 360;
    s = s / 100;
    l = l / 100;

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    const toHex = (x: number) => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const updateColor = useCallback((newHue: number, newSat: number, newLight: number) => {
    setHue(newHue);
    setSaturation(newSat);
    setLightness(newLight);
    const hexColor = hslToHex(newHue, newSat, newLight);
    setHexInput(hexColor);
    onChange(hexColor);
  }, [onChange]);

  const handleHueBarMove = useCallback((e: MouseEvent) => {
    if (!hueBarRef.current) return;

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      if (!hueBarRef.current) return;
      const rect = hueBarRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const newHue = (x / rect.width) * 360;
      updateColor(newHue, saturation, lightness);
    });
  }, [saturation, lightness, updateColor]);

  const handleShadeBoxMove = useCallback((e: MouseEvent) => {
    if (!shadeBoxRef.current) return;

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      if (!shadeBoxRef.current) return;
      const rect = shadeBoxRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));

      const newSat = (x / rect.width) * 100;
      const newLight = 100 - (y / rect.height) * 100;
      updateColor(hue, newSat, newLight);
    });
  }, [hue, updateColor]);

  // Mouse drag handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingShade) {
        handleShadeBoxMove(e);
      }
      if (isDraggingHue) {
        handleHueBarMove(e);
      }
    };

    const handleMouseUp = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      setIsDraggingShade(false);
      setIsDraggingHue(false);
    };

    if (isDraggingShade || isDraggingHue) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDraggingShade, isDraggingHue, handleShadeBoxMove, handleHueBarMove]);

  const handleHexInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const newHex = target.value;
    setHexInput(newHex);

    if (newHex.match(/^#[0-9A-Fa-f]{6}$/)) {
      onChange(newHex);
    }
  };

  const handlePresetClick = (color: string) => {
    setHexInput(color);
    onChange(color);
  };

  return (
    <div className="flex flex-col gap-2" style={{ width: '100%' }}>
      <div className="flex gap-2">
        <div
          ref={shadeBoxRef}
          className="relative rounded border border-white/20 cursor-crosshair select-none flex-1"
          style={{
            height: '120px',
            background: `linear-gradient(to bottom,
              hsl(${hue}, 100%, 100%),
              hsl(${hue}, 100%, 50%),
              hsl(${hue}, 100%, 0%)
            ), linear-gradient(to right,
              hsl(${hue}, 0%, 50%),
              hsl(${hue}, 100%, 50%)
            )`,
            backgroundBlendMode: 'multiply'
          }}
          onMouseDown={(e) => {
            setIsDraggingShade(true);
            handleShadeBoxMove(e);
          }}
        >
          <div
            className="absolute w-3 h-3 border-2 border-white rounded-full pointer-events-none"
            style={{
              left: `${saturation}%`,
              top: `${100 - lightness}%`,
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 0 0 1px rgba(0,0,0,0.5)'
            }}
          />
        </div>

        <div className="grid grid-cols-2 gap-1">
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

      <div
        ref={hueBarRef}
        className="relative rounded border border-white/20 cursor-pointer select-none"
        style={{
          width: '100%',
          height: '16px',
          background: 'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)'
        }}
        onMouseDown={(e) => {
          setIsDraggingHue(true);
          handleHueBarMove(e);
        }}
      >
        <div
          className="absolute h-full w-0.5 border border-white pointer-events-none"
          style={{
            left: `${(hue / 360) * 100}%`,
            transform: 'translateX(-50%)',
            boxShadow: '0 0 0 1px rgba(0,0,0,0.5)'
          }}
        />
      </div>

      <div className="flex items-center gap-2 bg-black/50 p-1.5 rounded border border-white/10">
        <div
          className="w-5 h-5 rounded border border-white/20"
          style={{ backgroundColor: hslToHex(hue, saturation, lightness) }}
        />
        <input
          type="text"
          value={hexInput}
          onChange={handleHexInput}
          className="bg-transparent text-white text-xs font-mono border-none outline-none flex-1"
          placeholder="#000000"
          maxLength={7}
        />
      </div>
    </div>
  );
}

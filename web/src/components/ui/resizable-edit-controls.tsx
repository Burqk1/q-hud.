import { JSX } from "preact";
import { useState, useCallback, useEffect, useRef } from "preact/hooks";

interface ResizableEditControlsProps {
  onResize: (scale: number) => void;
  scale: number;
  minScale?: number;
  maxScale?: number;
}

export default function ResizableEditControls({
  onResize,
  scale,
  minScale = 50,
  maxScale = 200
}: ResizableEditControlsProps) {
  const [isResizing, setIsResizing] = useState(false);
  const [resizeCorner, setResizeCorner] = useState<string | null>(null);
  const startScale = useRef(scale);
  const startPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: JSX.TargetedMouseEvent<HTMLDivElement>, corner: string) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);
    setResizeCorner(corner);
    startScale.current = scale;
    startPos.current = { x: e.clientX, y: e.clientY };
  }, [scale]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing || !resizeCorner) return;

    const deltaX = e.clientX - startPos.current.x;
    const deltaY = e.clientY - startPos.current.y;

    const delta = (deltaX + deltaY) / 2;
    const scaleChange = delta / 5; // Sensitivity adjustment
    const newScale = Math.max(minScale, Math.min(maxScale, startScale.current + scaleChange));

    onResize(Math.round(newScale));
  }, [isResizing, resizeCorner, minScale, maxScale, onResize]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    setResizeCorner(null);
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  const ResizeHandle = ({ position }: { position: string }) => {
    const getPositionStyles = () => {
      const baseStyle = {
        position: 'absolute' as const,
        backgroundColor: 'var(--primary-color)',
        opacity: 0.8,
        transition: 'all 0.2s ease',
        zIndex: 100000,
      };

      switch (position) {
        case 'top-left':
          return { ...baseStyle, top: '-0.375em', left: '-0.375em', width: '1em', height: '1em', borderRadius: '0.25em', cursor: 'nwse-resize' };
        case 'top-right':
          return { ...baseStyle, top: '-0.375em', right: '-0.375em', width: '1em', height: '1em', borderRadius: '0.25em', cursor: 'nesw-resize' };
        case 'bottom-left':
          return { ...baseStyle, bottom: '-0.375em', left: '-0.375em', width: '1em', height: '1em', borderRadius: '0.25em', cursor: 'nesw-resize' };
        case 'bottom-right':
          return { ...baseStyle, bottom: '-0.375em', right: '-0.375em', width: '1em', height: '1em', borderRadius: '0.25em', cursor: 'nwse-resize' };
        case 'top':
          return { ...baseStyle, top: '-0.25em', left: '50%', transform: 'translateX(-50%)', width: '2.5em', height: '0.5em', borderRadius: '0.25em 0.25em 0 0', cursor: 'ns-resize' };
        case 'bottom':
          return { ...baseStyle, bottom: '-0.25em', left: '50%', transform: 'translateX(-50%)', width: '2.5em', height: '0.5em', borderRadius: '0 0 0.25em 0.25em', cursor: 'ns-resize' };
        case 'left':
          return { ...baseStyle, left: '-0.25em', top: '50%', transform: 'translateY(-50%)', width: '0.5em', height: '2.5em', borderRadius: '0.25em 0 0 0.25em', cursor: 'ew-resize' };
        case 'right':
          return { ...baseStyle, right: '-0.25em', top: '50%', transform: 'translateY(-50%)', width: '0.5em', height: '2.5em', borderRadius: '0 0.25em 0.25em 0', cursor: 'ew-resize' };
        default:
          return baseStyle;
      }
    };

    return (
      <div
        style={getPositionStyles()}
        onMouseDown={(e) => handleMouseDown(e, position)}
        className="hover:opacity-100 hover:scale-110"
      />
    );
  };

  return (
    <>
      <ResizeHandle position="top-left" />
      <ResizeHandle position="top-right" />
      <ResizeHandle position="bottom-left" />
      <ResizeHandle position="bottom-right" />
    </>
  );
}

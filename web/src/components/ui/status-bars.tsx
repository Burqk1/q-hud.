import { useMemo } from "react";
import { TiHeartFullOutline } from "react-icons/ti";
import { useHudSettings } from "@/states/settings";

interface StatBarProps extends React.HTMLAttributes<HTMLDivElement> {
  Icon?: React.ComponentType<{ className?: string }>;
  value?: number;
  maxValue?: number;
  color?: string;
  vertical?: boolean;
}

export const StatBar = ({
  Icon = TiHeartFullOutline,
  value = 20,
  maxValue = 100,
  color,
  vertical = false,
  ...props
}: StatBarProps) => {
  const settings = useHudSettings();
  const primaryColor = color || 'var(--primary-color)';
  const percentage = useMemo(() => (value / maxValue) * 100, [value, maxValue]);

  return (
    <div
      className={`flex ${
        vertical ? "h-[3dvh]" : "w-full"
      } items-center 4k:gap-2`}
      style={{ gap: vertical ? '0.25em' : '0.25em' }}
      {...props}
    >
      {!vertical && <Icon className="text-white/70 4k:text-2xl 2k:text-xl" />}
      {!vertical && (
        <p
          className="text-xs 4k:text-base 2k:text-sm text-center font-bold"
          style={{
            color: primaryColor,
            width: '1.25em',
          }}
        >
          {value}
        </p>
      )}
      <div
        className={`relative ${
          vertical
            ? "h-full 2k:w-[0.375em] 4k:w-[0.5em] rounded-full"
            : "w-full 2k:h-3"
        } bg-black/30  rounded-[1px]`}
        style={{
          width: vertical ? '0.25em' : undefined,
          marginLeft: vertical ? undefined : '0.25em',
          height: vertical ? undefined : '0.5em',
        }}
      >
        <div
          className={`absolute ${
            vertical ? "bottom-0 w-full" : "left-0 h-full"
          } bg-red-500`}
          style={{
            backgroundColor: primaryColor,
            [vertical ? "height" : "width"]: `${percentage}%`,
            boxShadow: settings.enableGlowEffect ? `0 0 0.5em ${primaryColor}` : 'none',
            borderRadius: '0.1875em',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </div>
      {vertical && <Icon className="text-white/70 4k:text-2xl 2k:text-xl" />}
    </div>
  );
};

interface StatBarSegmentedProps extends React.HTMLAttributes<HTMLDivElement> {
  Icon?: React.ComponentType<{ className?: string }>;
  value?: number;
  color?: string;
}

export const StatBarSegmented = ({
  Icon = TiHeartFullOutline,
  value = 20,
  color,
  ...props
}: StatBarSegmentedProps) => {
  const primaryColor = color || 'var(--primary-color)';
  const segments = 4;
  const segmentWidth = 100 / segments;

  const segmentFills = useMemo(
    () =>
      Array.from({ length: segments }, (_, i) => {
        const segmentMaxValue = ((i + 1) * 100) / segments;
        if (value >= segmentMaxValue) {
          return 100;
        } else if (value > (i * 100) / segments) {
          return ((value - (i * 100) / segments) / segmentWidth) * 100;
        } else {
          return 0;
        }
      }),
    [value, segments, segmentWidth],
  );

  return (
    <div className="flex items-center w-full 4k:gap-2" style={{ gap: '0.25em' }} {...props}>
      <Icon className="text-white/70 4k:text-2xl 2k:text-xl" />
      <p
        className="text-xs 2k:text-sm 4k:text-base text-center font-bold"
        style={{
          color: primaryColor,
          width: '1.25em'
        }}
      >
        {value}
      </p>
      <div className="relative flex w-full 2k:h-[0.625em] rounded-[1px]" style={{ gap: '0.1875em', marginLeft: '0.25em', height: '0.375em' }}>
        {segmentFills.map((fill, index) => (
          <svg
            key={index}
            width="100%"
            height="100%"
            className={"rounded-full "}
            viewBox="0 0 100 24"
            preserveAspectRatio="none"
          >
            <defs>
              <filter id={`glow-${index}`}>
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <rect
              x="0"
              y="0"
              width="100"
              height="24"
              className={"fill-black/30"}
            />
            <rect
              x="0"
              y="0"
              width={fill}
              height="24"
              fill={primaryColor}
              style={{
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              filter={fill > 0 ? `url(#glow-${index})` : 'none'}
            />
          </svg>
        ))}
      </div>
    </div>
  );
};

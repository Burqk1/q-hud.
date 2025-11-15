import { useMemo } from "preact/hooks";

interface TextProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  label?: string;
  color?: string;
  Icon?: React.ComponentType<{ className?: string; color?: string }>;
}

export const TextProgressBar = ({
  value = 50,
  label = "FUEL",
  color,
  Icon,
  ...props
}: TextProgressBarProps) => {
  const getColor = useMemo(() => {
    if (value <= 20) return "#f70101";
    if (value <= 50) return "#f7e300";
    return color || 'var(--carhud-color)';
  }, [color, value]);

  return (
    <div
      className="flex flex-col items-center justify-center -skew-x-[10deg]"
      style={{
        width: '2.5rem',
        height: '2.5rem'
      }}
      {...props}
    >
      {Icon ? (
        <Icon className="4k:text-2xl 2k:text-xl text-lg text-white" />
      ) : (
        <h1
          className={
            "uppercase 4k:text-2xl 2k:text-lg text-base font-geist font-bold"
          }
        >
          {label}
        </h1>
      )}

      <div
        className="relative bg-black/30 shadow 4k:mt-1"
        style={{
          width: '80%',
          height: '0.3em',
          borderRadius: '2px'
        }}
      >
        <div
          className={`absolute max-w-full transition-all shadow left-0 h-full z-20`}
          style={{
            width: `${value}%`,
            backgroundColor: getColor,
            boxShadow: value <= 20 ? '0 0 0.3em #f70101' : value <= 50 ? '0 0 0.3em #f7e300' : `0 0 0.3em var(--carhud-color)`,
            borderRadius: '2px'
          }}
        ></div>
      </div>
    </div>
  );
};

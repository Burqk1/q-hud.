import React from "react";
import { FaCompass } from "react-icons/fa";
import { twMerge } from "tailwind-merge";

interface IconLabelBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  Icon?: React.ComponentType<{ className?: string }>;
  label?: string;
  className?: string;
  textClassName?: string;
  iconClassName?: string;
}

const IconLabelBox: React.FC<IconLabelBoxProps> = ({
  Icon: Icon = FaCompass,
  label = "NW",
  className = "",
  textClassName = "",
  iconClassName = "",
  ...props
}) => {
  return (
    <div
      className={twMerge(
        `flex items-center justify-center bg-black/50 rounded-lg 2k:text-lg 4k:text-2xl`,
        className
      )}
      style={{
        color: 'var(--compass-color)',
        height: '2rem',
        padding: '0.375rem',
        minWidth: '5rem'
      }}
      {...props}
    >
      <Icon
        className={twMerge(
          "2k:text-lg 4k:text-2xl",
          iconClassName
        )}
        style={{ marginRight: '0.5rem' }}
      />
      <p
        className={twMerge(
          `text-center text-white font-bold 4k:text-2xl text-sm 2k:text-base`,
          textClassName
        )}
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {label}
      </p>
    </div>
  );
};

export default IconLabelBox;

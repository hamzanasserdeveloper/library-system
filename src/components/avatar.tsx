import { mergeClasses } from "@/utils/MergeClasses";

interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeStyles: Record<NonNullable<AvatarProps["size"]>, string> = {
  sm: "h-9 w-9 text-sm",
  md: "h-14 w-14 text-xl",
  lg: "h-24 w-24 text-3xl sm:h-28 sm:w-28 sm:text-4xl",
};

function getInitials(name: string): string {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join("") || "?"
  );
}

export function Avatar({ name, size = "sm", className }: AvatarProps) {
  return (
    <span
      aria-hidden
      className={mergeClasses(
        "inline-flex select-none items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-active font-bold text-primary-foreground shadow-lg shadow-primary/30 ring-4 ring-background",
        sizeStyles[size],
        className,
      )}
    >
      {getInitials(name)}
    </span>
  );
}

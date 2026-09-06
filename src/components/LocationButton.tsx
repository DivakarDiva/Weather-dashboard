import { Loader2, LocateFixed } from "lucide-react";

interface LocationButtonProps {
  onClick: () => void;
  loading: boolean;
  disabled?: boolean;
  variant?: "icon" | "full";
}

export function LocationButton({
  onClick,
  loading,
  disabled,
  variant = "icon",
}: LocationButtonProps) {
  const icon = loading ? (
    <Loader2 className="size-5 animate-spin" aria-hidden="true" />
  ) : (
    <LocateFixed className="size-5" aria-hidden="true" />
  );

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled || loading}
        className="focus-ring inline-flex h-12 items-center gap-2 rounded-full border border-border bg-card px-5 text-sm font-semibold text-foreground transition-colors hover:bg-accent disabled:opacity-60"
      >
        {icon}
        {loading ? "Finding you…" : "Use my location"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      aria-label="Use my location"
      className="focus-ring inline-flex size-11 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-accent disabled:opacity-60"
    >
      {icon}
    </button>
  );
}

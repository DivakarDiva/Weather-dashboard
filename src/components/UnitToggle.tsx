import type { TemperatureUnit } from "@/types/weather";
import { cn } from "@/lib/utils";

interface UnitToggleProps {
  unit: TemperatureUnit;
  onChange: (unit: TemperatureUnit) => void;
}

const OPTIONS: { value: TemperatureUnit; label: string; description: string }[] = [
  { value: "celsius", label: "°C", description: "Celsius" },
  { value: "fahrenheit", label: "°F", description: "Fahrenheit" },
];

export function UnitToggle({ unit, onChange }: UnitToggleProps) {
  return (
    <div
      role="group"
      aria-label="Temperature unit"
      className="inline-flex rounded-full border border-border bg-card p-1"
    >
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={unit === option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "focus-ring rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors",
            unit === option.value
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <span aria-hidden="true">{option.label}</span>
          <span className="sr-only">{option.description}</span>
        </button>
      ))}
    </div>
  );
}

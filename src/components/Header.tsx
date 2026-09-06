import { CloudSun } from "lucide-react";
import { SearchBar } from "./SearchBar";
import { UnitToggle } from "./UnitToggle";
import { ThemeToggle } from "./ThemeToggle";
import { LocationButton } from "./LocationButton";
import type { Theme } from "@/hooks/useTheme";
import type { GeoLocation, TemperatureUnit } from "@/types/weather";

interface HeaderProps {
  onSelectLocation: (location: GeoLocation) => void;
  onLocate: () => void;
  locating: boolean;
  unit: TemperatureUnit;
  onUnitChange: (unit: TemperatureUnit) => void;
  theme: Theme;
  onToggleTheme: () => void;
}

export function Header({
  onSelectLocation,
  onLocate,
  locating,
  unit,
  onUnitChange,
  theme,
  onToggleTheme,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:gap-6 lg:py-4">
        <div className="flex items-center justify-between gap-3">
          <a
            href="/"
            className="focus-ring flex items-center gap-2.5 rounded-xl"
            aria-label="Skyline Weather home"
          >
            <span className="flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <CloudSun className="size-5" aria-hidden="true" />
            </span>
            <span className="font-display text-lg font-semibold tracking-tight">
              Skyline
            </span>
          </a>
          <div className="flex items-center gap-2 lg:hidden">
            <UnitToggle unit={unit} onChange={onUnitChange} />
            <LocationButton onClick={onLocate} loading={locating} />
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          </div>
        </div>

        <div className="flex-1 lg:max-w-xl">
          <SearchBar onSelect={onSelectLocation} />
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <UnitToggle unit={unit} onChange={onUnitChange} />
          <LocationButton onClick={onLocate} loading={locating} />
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
      </div>
    </header>
  );
}

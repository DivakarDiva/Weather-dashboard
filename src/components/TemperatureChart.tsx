import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { HourlyPoint, TemperatureUnit } from "@/types/weather";
import { formatHour } from "@/utils/dateUtils";
import { convertTemperature, unitSuffix } from "@/utils/unitUtils";

interface TemperatureChartProps {
  hours: HourlyPoint[];
  unit: TemperatureUnit;
  timezone: string;
}

export function TemperatureChart({ hours, unit, timezone }: TemperatureChartProps) {
  const suffix = unitSuffix(unit);
  const data = useMemo(
    () =>
      hours.map((hour, index) => ({
        label: index === 0 ? "Now" : formatHour(hour.time, timezone),
        temperature: Math.round(convertTemperature(hour.temperature, unit)),
        rain: Math.round(hour.precipitationProbability),
      })),
    [hours, unit, timezone],
  );

  return (
    <section aria-labelledby="chart-heading" className="glass-card p-4 sm:p-6">
      <h2 id="chart-heading" className="mb-1 text-lg font-semibold">
        Temperature trend
      </h2>
      <p className="mb-4 text-sm text-muted-foreground">
        Next 24 hours, in {suffix}
      </p>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
            <defs>
              <linearGradient id="temperatureFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.45} />
                <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-border)"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
              minTickGap={24}
              tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
            />
            <YAxis
              width={52}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
              tickFormatter={(value: number) => `${value}${suffix}`}
            />
            <Tooltip
              cursor={{ stroke: "var(--color-border)" }}
              contentStyle={{
                background: "var(--color-popover)",
                border: "1px solid var(--color-border)",
                borderRadius: "0.75rem",
                color: "var(--color-popover-foreground)",
                fontSize: "0.8rem",
              }}
              formatter={(value: number, name: string) =>
                name === "temperature"
                  ? [`${value}${suffix}`, "Temperature"]
                  : [`${value}%`, "Chance of rain"]
              }
            />
            <Area
              type="monotone"
              dataKey="temperature"
              stroke="var(--color-chart-1)"
              strokeWidth={2.5}
              fill="url(#temperatureFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

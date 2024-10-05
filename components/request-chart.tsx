"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts";

const chartConfig = {
  desktop: {
    label: "Request",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function RequestChart({ data }: any) {
  return (
    <div className="rounded-xl border border-dashed">
      <ChartContainer config={chartConfig} className="h-48 w-full">
        <LineChart
          accessibilityLayer
          data={data}
          margin={{
            top: 36,
            left: 16,
            right: 16,
            bottom: 8,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="hour"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(-2)}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Line
            dataKey="requests"
            type="step"
            stroke="var(--color-desktop)"
            strokeWidth={2}
            dot={{
              fill: "var(--color-desktop)",
            }}
            activeDot={{
              r: 6,
            }}
          >
            <LabelList
              position="top"
              offset={12}
              className="fill-foreground"
              fontSize={12}
            />
          </Line>
        </LineChart>
      </ChartContainer>
    </div>
  );
}

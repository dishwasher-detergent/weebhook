"use client";

import { RequestsPerHour } from "@/app/[project]/page";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { AnimatePresence, motion } from "framer-motion";
import { LucideActivity } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

const chartConfig = {
  requests: {
    label: "Requests",
    color: "hsl(var(--chart-4))",
    icon: LucideActivity,
  },
} satisfies ChartConfig;

export function RequestChart({ data }: { data: RequestsPerHour[] }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.25 }}
        className="rounded-xl border border-dashed overflow-hidden"
      >
        <ChartContainer config={chartConfig} className="h-48 w-full">
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              top: 32,
              left: 32,
              right: 32,
              bottom: 8,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="hour"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value}:00`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Area
              dataKey="requests"
              type="step"
              fill="var(--color-requests)"
              fillOpacity={0.4}
              stroke="var(--color-requests)"
            />
          </AreaChart>
        </ChartContainer>
      </motion.div>
    </AnimatePresence>
  );
}

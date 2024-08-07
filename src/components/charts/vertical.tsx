"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

const chartConfig = {
  amount: {
    label: "Valor",
    color: "#2563eb",
  },
} satisfies ChartConfig;

interface VerticalProps {
  chartData: {
    country: string;
    amount: number;
  }[];
}

export default function Vertical({ chartData }: VerticalProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center">
        <CardTitle>Gráfico de barra vertical</CardTitle>
        <CardDescription>Distribuição de Medalhas</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer config={chartConfig} className="h-[500px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="country"
              tickLine={false}
              tickMargin={12}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="amount" fill="var(--color-amount)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

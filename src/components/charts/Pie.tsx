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
import { Pie, PieChart } from "recharts";

interface PieChartsProps {
  chartData: {
    country: string;
    amount: number;
    fill: string;
  }[];
}

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
} satisfies ChartConfig;

export default function PieCharts({ chartData }: PieChartsProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Gráfico de pizza</CardTitle>
        <CardDescription>Distribuição de Medalhas</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[600px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie data={chartData} dataKey="amount" nameKey="country" />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

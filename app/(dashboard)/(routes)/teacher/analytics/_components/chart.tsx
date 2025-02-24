"use client";

import {Card} from "@/components/ui/card";
import {Bar, BarChart, ResponsiveContainer, XAxis, YAxis} from "recharts";

interface ChartProps {
    data: {
        name: string,
        total: number
    }[];
}

export const Chart = ({
    data
}: ChartProps) => {
    return (
        <Card className={"pt-4"}>
            <ResponsiveContainer width="100%" height={350}>
                <BarChart data={data}>
                    <XAxis
                        dataKey="name"
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${Math.floor(value)}`}
                        allowDecimals={false}
                        interval={1}
                    />
                    <Bar
                        dataKey="total"
                        fill="#0369a1"
                        radius={[4,4,0,0]}
                        maxBarSize={150}
                    />
                </BarChart>
            </ResponsiveContainer>
        </Card>
    )
}
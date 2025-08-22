"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useMemo } from "react"
import { format, parseISO } from "date-fns"

type Event = {
  startDate: string
}

type EventsChartProps = {
  events: Event[]
}

export default function EventsChart({ events }: EventsChartProps) {
  const data = useMemo(() => {
    const monthCounts: { [key: string]: number } = {}

    events.forEach((event) => {
      try {
        const month = format(parseISO(event.startDate), "yyyy-MM")
        monthCounts[month] = (monthCounts[month] || 0) + 1
      } catch (error) {
        console.error("Invalid date format for event:", event)
      }
    })

    const sortedMonths = Object.keys(monthCounts).sort()

    return sortedMonths.map((month) => ({
      name: format(new Date(`${month}-01`), "MMM"),
      total: monthCounts[month],
    }))
  }, [events])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Events Overview</CardTitle>
        <CardDescription>Number of events per month.</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(23, 27, 34, 0.9)",
                borderColor: "#d4af37",
                color: "#f0e68c",
              }}
              cursor={{ fill: "rgba(212, 175, 55, 0.1)" }}
            />
            <Legend wrapperStyle={{ color: "#f0e68c" }} />
            <Bar dataKey="total" fill="#b91c1c" radius={[4, 4, 0, 0]} name="Events" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

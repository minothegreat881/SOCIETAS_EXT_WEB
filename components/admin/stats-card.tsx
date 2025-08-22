import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

type StatsCardProps = {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
}

export default function StatsCard({ title, value, icon: Icon, description }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-roman-gold-600">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground text-roman-gold-400" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-roman-gold">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  )
}

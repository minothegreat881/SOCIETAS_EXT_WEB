"use client"

import { useState, useEffect } from "react"
import { Calendar, ImageIcon, BookOpen, Users } from "lucide-react"
import StatsCard from "./stats-card"
import EventsChart from "./events-chart"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { format, parseISO, isFuture } from "date-fns"

type Event = {
  id: number
  title: string
  startDate: string
  location: { name: string }
  attendees: number
}

type GalleryItem = { id: number }
type Article = { id: number }

export default function DashboardOverview() {
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalGalleryItems: 0,
    totalArticles: 0,
    totalAttendees: 0,
  })
  const [events, setEvents] = useState<Event[]>([])
  const [nextEvent, setNextEvent] = useState<Event | null>(null)

  useEffect(() => {
    const savedEventsString = localStorage.getItem("scear-events")
    const savedGalleryString = localStorage.getItem("scear-gallery")
    const savedArticlesString = localStorage.getItem("scear-articles")

    const savedEvents: Event[] = savedEventsString ? JSON.parse(savedEventsString) : []
    const savedGallery: GalleryItem[] = savedGalleryString ? JSON.parse(savedGalleryString) : []
    const savedArticles: Article[] = savedArticlesString ? JSON.parse(savedArticlesString) : []

    setEvents(savedEvents)

    const totalAttendees = savedEvents.reduce((acc, event) => acc + (event.attendees || 0), 0)

    setStats({
      totalEvents: savedEvents.length,
      totalGalleryItems: savedGallery.length,
      totalArticles: savedArticles.length,
      totalAttendees,
    })

    const upcomingEvents = savedEvents
      .filter((event) => isFuture(parseISO(event.startDate)))
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())

    if (upcomingEvents.length > 0) {
      setNextEvent(upcomingEvents[0])
    }
  }, [])

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight text-roman-gold">Dashboard</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Events" value={stats.totalEvents} icon={Calendar} description="All scheduled events" />
        <StatsCard
          title="Gallery Images"
          value={stats.totalGalleryItems}
          icon={ImageIcon}
          description="Images in the media library"
        />
        <StatsCard
          title="History Articles"
          value={stats.totalArticles}
          icon={BookOpen}
          description="Published historical articles"
        />
        <StatsCard
          title="Total Expected Attendees"
          value={stats.totalAttendees}
          icon={Users}
          description="Across all events"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <EventsChart events={events} />
        </div>
        <div className="lg:col-span-3">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Next Upcoming Event</CardTitle>
            </CardHeader>
            <CardContent>
              {nextEvent ? (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-roman-gold-300">{nextEvent.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {format(parseISO(nextEvent.startDate), "EEEE, MMMM d, yyyy 'at' h:mm a")}
                  </p>
                  <p className="text-sm text-muted-foreground">Location: {nextEvent.location.name}</p>
                  <p className="text-sm text-muted-foreground">Expected Attendees: {nextEvent.attendees}</p>
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-10">No upcoming events scheduled.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

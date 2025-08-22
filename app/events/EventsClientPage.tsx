"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import Image from "next/image"
import { format, parseISO, isSameDay } from "date-fns"
import { sk } from "date-fns/locale"
import "leaflet/dist/leaflet.css" // Moved CSS import here
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, CalendarIcon, Clock, Users, ChevronRight, Info } from "lucide-react"
import ModernCalendar from "@/components/modern-calendar"
import { getVisibleEvents, generateCalendarEvents, generateMapLocations } from "@/lib/events-data"
import DynamicEventMap from "@/components/dynamic-event-map"

export default function EventsClientPage() {
  const [lastScrollY, setLastScrollY] = useState(0)
  const [hideHeader, setHideHeader] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null)
  const [filteredEvents, setFilteredEvents] = useState<any[]>([])
  const [filter, setFilter] = useState<string>("all")
  const [isAdmin, setIsAdmin] = useState(false) // For demo purposes

  const initialRenderRef = useRef(true)
  const [isClient, setIsClient] = useState(false)

  const eventsData = useMemo(() => getVisibleEvents(), [])
  const calendarEventInstances = useMemo(() => generateCalendarEvents(), [])
  const mapLocations = useMemo(() => generateMapLocations(), [])

  useEffect(() => {
    // This ensures the map component which relies on 'window' is only rendered on the client
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (initialRenderRef.current && eventsData.length > 0) {
      setSelectedEvent(eventsData[0].id)
      initialRenderRef.current = false
    }
  }, [eventsData])

  useEffect(() => {
    let filtered = eventsData
    if (filter !== "all") {
      filtered = filtered.filter((event) => event.category === filter)
    }
    setFilteredEvents(filtered)
  }, [filter, eventsData])

  useEffect(() => {
    if (filteredEvents.length > 0) {
      const currentEventStillValid = selectedEvent !== null && filteredEvents.some((e) => e.id === selectedEvent)
      if (!currentEventStillValid) {
        setSelectedEvent(filteredEvents[0].id)
      }
    } else if (filteredEvents.length === 0) {
      setSelectedEvent(null)
    }
  }, [filteredEvents, selectedEvent])

  const handleMarkerClick = (eventId: number) => {
    const event = eventsData.find((e) => e.id === eventId)
    if (event) {
      setSelectedEvent(event.id)
      if (event.category !== filter && filter !== "all") {
        setFilter("all")
      }
    }
  }

  const handleCalendarEventClick = (eventId: number) => {
    const calendarEvent = calendarEventInstances.find((e) => e.id === eventId)
    if (calendarEvent) {
      const parentEvent = eventsData.find((e) => e.id === calendarEvent.parentId)
      if (parentEvent) {
        setSelectedEvent(parentEvent.id)
        if (parentEvent.category !== filter && filter !== "all") {
          setFilter("all")
        }
      }
    }
  }

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== "undefined") {
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
          setHideHeader(true)
        } else if (window.scrollY < lastScrollY) {
          setHideHeader(false)
        }
        setLastScrollY(window.scrollY)
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlNavbar)
      return () => {
        window.removeEventListener("scroll", controlNavbar)
      }
    }
  }, [lastScrollY])

  return (
    <div className="min-h-screen bg-stone-50">
      <section className="relative w-full h-[40vh]">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <Image
          src="/images/germania-subacta.jpeg"
          alt="Roman events and reenactments"
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Events</h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Join us at our upcoming reenactments, training sessions, exhibitions, and workshops
          </p>
        </div>
      </section>

      <section className="py-12 container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="space-y-6">
            {filteredEvents.map((event) => (
              <Card
                key={event.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedEvent === event.id ? "ring-2 ring-red-800" : ""
                }`}
                onClick={() => setSelectedEvent(event.id)}
              >
                <div className="flex flex-col">
                  <div className="relative h-40">
                    <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
                    <Badge
                      className={`absolute top-2 right-2 ${
                        event.category === "reenactment"
                          ? "bg-red-800"
                          : event.category === "training"
                            ? "bg-amber-700"
                            : event.category === "meeting"
                              ? "bg-blue-700"
                              : "bg-emerald-700"
                      }`}
                    >
                      {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                    </Badge>
                    {event.recurring && <Badge className="absolute top-2 left-2 bg-stone-800">Opakujúce sa</Badge>}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">{event.title}</h3>
                    <div className="flex items-center text-sm text-stone-500 mb-1">
                      {event.icon && <event.icon className="mr-1 h-4 w-4" />}
                      {format(parseISO(event.startDate), "MMM d, yyyy", { locale: sk })}
                      {!isSameDay(parseISO(event.startDate), parseISO(event.endDate)) &&
                        ` - ${format(parseISO(event.endDate), "MMM d, yyyy", { locale: sk })}`}
                    </div>
                    <div className="flex items-center text-sm text-stone-500">
                      <MapPin className="mr-1 h-4 w-4" />
                      {event.location.name}
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {filteredEvents.length === 0 && (
              <Card>
                <CardContent className="p-6 text-center">
                  <CalendarIcon className="mx-auto h-12 w-12 text-stone-400 mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Events Found</h3>
                  <p className="text-stone-500 mb-4">There are no events in this category.</p>
                  <Button variant="outline" onClick={() => setFilter("all")}>
                    View All Events
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="lg:col-span-2">
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="h-[400px] w-full rounded-lg overflow-hidden">
                  {isClient ? (
                    <DynamicEventMap
                      locations={mapLocations}
                      selectedEventId={selectedEvent}
                      onMarkerClick={handleMarkerClick}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full bg-stone-100 rounded-lg">
                      <div className="text-center">
                        <div className="animate-spin h-8 w-8 border-4 border-red-800 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-stone-600">Loading map...</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {selectedEvent ? (
              <Card>
                <div className="relative h-64 sm:h-80">
                  <Image
                    src={eventsData.find((e) => e.id === selectedEvent)?.image || "/placeholder.svg"}
                    alt={eventsData.find((e) => e.id === selectedEvent)?.title || "Selected event"}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <Badge
                      className={`mb-2 ${
                        eventsData.find((e) => e.id === selectedEvent)?.category === "reenactment"
                          ? "bg-red-800"
                          : eventsData.find((e) => e.id === selectedEvent)?.category === "training"
                            ? "bg-amber-700"
                            : eventsData.find((e) => e.id === selectedEvent)?.category === "meeting"
                              ? "bg-blue-700"
                              : "bg-emerald-700"
                      }`}
                    >
                      {(eventsData
                        .find((e) => e.id === selectedEvent)
                        ?.category.charAt(0)
                        .toUpperCase() || "") +
                        (eventsData.find((e) => e.id === selectedEvent)?.category.slice(1) || "")}
                    </Badge>
                    <h2 className="text-2xl font-bold mb-1">{eventsData.find((e) => e.id === selectedEvent)?.title}</h2>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-white/80 text-sm">
                      <div className="flex items-center">
                        <CalendarIcon className="mr-1 h-4 w-4" />
                        {format(
                          parseISO(
                            eventsData.find((e) => e.id === selectedEvent)?.startDate || new Date().toISOString(),
                          ),
                          "MMM d, yyyy",
                          { locale: sk },
                        )}
                        {!isSameDay(
                          parseISO(
                            eventsData.find((e) => e.id === selectedEvent)?.startDate || new Date().toISOString(),
                          ),
                          parseISO(eventsData.find((e) => e.id === selectedEvent)?.endDate || new Date().toISOString()),
                        ) &&
                          ` - ${format(parseISO(eventsData.find((e) => e.id === selectedEvent)?.endDate || new Date().toISOString()), "MMM d, yyyy", { locale: sk })}`}
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-1 h-4 w-4" />
                        {format(
                          parseISO(
                            eventsData.find((e) => e.id === selectedEvent)?.startDate || new Date().toISOString(),
                          ),
                          "h:mm a",
                        )}{" "}
                        -{" "}
                        {format(
                          parseISO(eventsData.find((e) => e.id === selectedEvent)?.endDate || new Date().toISOString()),
                          "h:mm a",
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <h3 className="text-lg font-medium mb-2">About This Event</h3>
                      <p className="text-stone-700 mb-4">
                        {eventsData.find((e) => e.id === selectedEvent)?.description}
                      </p>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Location</h3>
                        <div className="bg-stone-100 p-3 rounded-lg">
                          <p className="font-medium">{eventsData.find((e) => e.id === selectedEvent)?.location.name}</p>
                          <p className="text-stone-600 text-sm">
                            {eventsData.find((e) => e.id === selectedEvent)?.location.address}
                          </p>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-2">Attendees</h3>
                        <div className="flex items-center">
                          <Users className="h-5 w-5 text-stone-500 mr-2" />
                          <span>{eventsData.find((e) => e.id === selectedEvent)?.attendees} members participating</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="bg-red-800 hover:bg-red-900">
                    Register for This Event <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-6 text-center py-12">
                  <CalendarIcon className="mx-auto h-16 w-16 text-stone-400 mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Event Selected</h3>
                  <p className="text-stone-500 mb-4">Please select an event from the list to view details.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-3xl font-bold text-center mb-8">Event Calendar</h2>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Info className="mr-2 h-5 w-5 text-red-800" />
                    Event Categories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button
                      variant={filter === "all" ? "default" : "outline"}
                      className={
                        filter === "all" ? "bg-red-800 hover:bg-red-900 w-full justify-start" : "w-full justify-start"
                      }
                      onClick={() => setFilter("all")}
                    >
                      All Events
                    </Button>
                    <Button
                      variant={filter === "reenactment" ? "default" : "outline"}
                      className={
                        filter === "reenactment"
                          ? "bg-red-800 hover:bg-red-900 w-full justify-start"
                          : "w-full justify-start"
                      }
                      onClick={() => setFilter("reenactment")}
                    >
                      Reenactments
                    </Button>
                    <Button
                      variant={filter === "training" ? "default" : "outline"}
                      className={
                        filter === "training"
                          ? "bg-red-800 hover:bg-red-900 w-full justify-start"
                          : "w-full justify-start"
                      }
                      onClick={() => setFilter("training")}
                    >
                      Training Sessions
                    </Button>
                    <Button
                      variant={filter === "meeting" ? "default" : "outline"}
                      className={
                        filter === "meeting"
                          ? "bg-red-800 hover:bg-red-900 w-full justify-start"
                          : "w-full justify-start"
                      }
                      onClick={() => setFilter("meeting")}
                    >
                      Club Meetings
                    </Button>
                    <Button
                      variant={filter === "exhibition" ? "default" : "outline"}
                      className={
                        filter === "exhibition"
                          ? "bg-red-800 hover:bg-red-900 w-full justify-start"
                          : "w-full justify-start"
                      }
                      onClick={() => setFilter("exhibition")}
                    >
                      Exhibitions
                    </Button>
                    <Button
                      variant={filter === "workshop" ? "default" : "outline"}
                      className={
                        filter === "workshop"
                          ? "bg-red-800 hover:bg-red-900 w-full justify-start"
                          : "w-full justify-start"
                      }
                      onClick={() => setFilter("workshop")}
                    >
                      Workshops
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-3">
              <div className="flex justify-end mb-4">
                <Button variant="outline" size="sm" onClick={() => setIsAdmin(!isAdmin)} className="text-sm">
                  {isAdmin ? "User Mode" : "Admin Mode"} (Demo)
                </Button>
              </div>
              <ModernCalendar
                events={calendarEventInstances}
                onEventClick={handleCalendarEventClick}
                isAdmin={isAdmin}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {eventsData.slice(0, 3).map((event) => (
              <Card key={event.id} className="overflow-hidden">
                <div className="relative h-48">
                  <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
                  <Badge
                    className={`absolute top-2 right-2 ${
                      event.category === "reenactment"
                        ? "bg-red-800"
                        : event.category === "training"
                          ? "bg-amber-700"
                          : event.category === "meeting"
                            ? "bg-blue-700"
                            : "bg-emerald-700"
                    }`}
                  >
                    {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                  </Badge>
                  {event.recurring && <Badge className="absolute top-2 left-2 bg-stone-800">Opakujúce sa</Badge>}
                </div>
                <CardHeader>
                  <div className="flex items-center text-sm text-stone-500 mb-1">
                    {event.icon && <event.icon className="mr-1 h-4 w-4" />}
                    {format(parseISO(event.startDate), "MMM d, yyyy", { locale: sk })}
                  </div>
                  <CardTitle>{event.title}</CardTitle>
                  <CardDescription className="flex items-center">
                    <MapPin className="mr-1 h-4 w-4" />
                    {event.location.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-stone-700 line-clamp-2">{event.description}</p>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => {
                      setSelectedEvent(event.id)
                      if (event.category !== filter && filter !== "all") {
                        setFilter("all")
                      }
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }}
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

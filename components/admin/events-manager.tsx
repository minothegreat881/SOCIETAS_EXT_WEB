"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { format, parseISO } from "date-fns"
import { CalendarIcon, Clock, MapPin, Plus, Pencil, Trash2, Save, X, ImageIcon } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import MediaLibrary from "./media-library"

// Event type definition
type Event = {
  id: number
  title: string
  description: string
  startDate: string
  endDate: string
  location: {
    name: string
    address: string
    coordinates: [number, number] // [latitude, longitude]
  }
  image: string
  category: "reenactment" | "training" | "exhibition" | "workshop"
  attendees: number
}

// Sample events data
const initialEvents: Event[] = [
  {
    id: 1,
    title: "Roman Military Festival",
    description:
      "Join us for a full weekend of Roman military demonstrations, battle reenactments, and historical presentations about auxiliary forces in the Roman army.",
    startDate: "2025-06-15T10:00:00",
    endDate: "2025-06-16T18:00:00",
    location: {
      name: "Archaeological Park",
      address: "Historical Avenue 123, Bratislava",
      coordinates: [48.148598, 17.107748], // Bratislava coordinates
    },
    image: "/images/gallery/roman-festival.png",
    category: "reenactment",
    attendees: 45,
  },
  {
    id: 2,
    title: "Auxiliary Training Workshop",
    description:
      "Learn the basics of Roman auxiliary combat techniques in this hands-on workshop. Suitable for beginners and those interested in joining our group.",
    startDate: "2025-06-22T14:00:00",
    endDate: "2025-06-22T17:00:00",
    location: {
      name: "City Park",
      address: "Park Street 45, Košice",
      coordinates: [48.716385, 21.261074], // Košice coordinates
    },
    image: "/images/gallery/roman-training.png",
    category: "training",
    attendees: 20,
  },
]

export default function EventsManager() {
  const [events, setEvents] = useState<Event[]>([])
  const [isEditing, setIsEditing] = useState<number | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [formData, setFormData] = useState<Partial<Event>>({})
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [eventToDelete, setEventToDelete] = useState<number | null>(null)
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const savedEvents = localStorage.getItem("scear-events")
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents))
    } else {
      setEvents(initialEvents)
    }
  }, [])

  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem("scear-events", JSON.stringify(events))
    }
  }, [events])

  const handleEditEvent = (event: Event) => {
    setFormData(event)
    setIsEditing(event.id)
    setIsAddingNew(false)
  }

  const handleAddNew = () => {
    setFormData({
      title: "",
      description: "",
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      location: {
        name: "",
        address: "",
        coordinates: [48.669, 19.699],
      },
      image: "",
      category: "reenactment",
      attendees: 0,
    })
    setIsEditing(null)
    setIsAddingNew(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(null)
    setIsAddingNew(false)
    setFormData({})
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location!,
        [name]: value,
      },
    }))
  }

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category: value as "reenactment" | "training" | "exhibition" | "workshop",
    }))
  }

  const handleDateChange = (field: "startDate" | "endDate", date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({ ...prev, [field]: date.toISOString() }))
    }
  }

  const handleImageSelect = (imageUrl: string) => {
    setFormData((prev) => ({ ...prev, image: imageUrl }))
    setIsMediaLibraryOpen(false)
  }

  const handleSaveEvent = () => {
    if (!formData.title || !formData.description || !formData.location?.name) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    if (isAddingNew) {
      const newEvent = { ...formData, id: Math.max(0, ...events.map((e) => e.id)) + 1 } as Event
      setEvents([...events, newEvent])
      toast({ title: "Event created", description: "The new event has been successfully created" })
    } else if (isEditing) {
      setEvents(events.map((event) => (event.id === isEditing ? ({ ...event, ...formData } as Event) : event)))
      toast({ title: "Event updated", description: "The event has been successfully updated" })
    }

    handleCancelEdit()
  }

  const confirmDelete = (eventId: number) => {
    setEventToDelete(eventId)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteEvent = () => {
    if (eventToDelete) {
      setEvents(events.filter((event) => event.id !== eventToDelete))
      setIsDeleteDialogOpen(false)
      setEventToDelete(null)
      toast({ title: "Event deleted", description: "The event has been successfully deleted" })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Events</h2>
        <Button onClick={handleAddNew} className="bg-red-800 hover:bg-red-900">
          <Plus className="mr-2 h-4 w-4" /> Add New Event
        </Button>
      </div>

      {(isEditing || isAddingNew) && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{isAddingNew ? "Add New Event" : "Edit Event"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="title">Event Title*</label>
                  <Input id="title" name="title" value={formData.title || ""} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="description">Description*</label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description || ""}
                    onChange={handleInputChange}
                    rows={5}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="category">Category*</label>
                  <Select value={formData.category} onValueChange={handleCategoryChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reenactment">Reenactment</SelectItem>
                      <SelectItem value="training">Training</SelectItem>
                      <SelectItem value="exhibition">Exhibition</SelectItem>
                      <SelectItem value="workshop">Workshop</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="attendees">Expected Attendees</label>
                  <Input
                    id="attendees"
                    name="attendees"
                    type="number"
                    value={formData.attendees || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label>Event Image</label>
                  <div className="relative aspect-video w-full border rounded-md overflow-hidden">
                    {formData.image ? (
                      <Image
                        src={formData.image || "/placeholder.svg"}
                        alt="Event image"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-stone-100">
                        <ImageIcon className="h-12 w-12 text-stone-400" />
                      </div>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => setIsMediaLibraryOpen(true)}
                  >
                    Change Image
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label>Start Date*</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start font-normal bg-transparent">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.startDate ? format(parseISO(formData.startDate), "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.startDate ? parseISO(formData.startDate) : undefined}
                          onSelect={(d) => handleDateChange("startDate", d)}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <label>End Date*</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start font-normal bg-transparent">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.endDate ? format(parseISO(formData.endDate), "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.endDate ? parseISO(formData.endDate) : undefined}
                          onSelect={(d) => handleDateChange("endDate", d)}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="locationName">Location Name*</label>
                  <Input
                    id="locationName"
                    name="name"
                    value={formData.location?.name || ""}
                    onChange={handleLocationChange}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="locationAddress">Location Address*</label>
                  <Input
                    id="locationAddress"
                    name="address"
                    value={formData.location?.address || ""}
                    onChange={handleLocationChange}
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleCancelEdit}>
              <X className="mr-2 h-4 w-4" /> Cancel
            </Button>
            <Button className="bg-red-800 hover:bg-red-900" onClick={handleSaveEvent}>
              <Save className="mr-2 h-4 w-4" /> Save Event
            </Button>
          </CardFooter>
        </Card>
      )}

      <div className="space-y-4">
        {events.map((event) => (
          <Card key={event.id} className="overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/4 bg-stone-100 p-4 flex flex-col justify-between">
                <div>
                  <Badge className="mb-2 bg-red-800">{event.category}</Badge>
                  <h3 className="font-bold text-lg mb-2">{event.title}</h3>
                  <div className="text-sm text-stone-600 space-y-1">
                    <div className="flex items-center">
                      <CalendarIcon className="mr-1 h-4 w-4" />
                      {format(parseISO(event.startDate), "MMM d, yyyy")}
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      {format(parseISO(event.startDate), "h:mm a")}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="mr-1 h-4 w-4" />
                      {event.location.name}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    onClick={() => handleEditEvent(event)}
                  >
                    <Pencil className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-red-600 bg-transparent"
                    onClick={() => confirmDelete(event.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </div>
              </div>
              <div className="md:w-3/4 p-4">
                <p className="text-stone-700">{event.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>Are you sure you want to delete this event?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteEvent}>
              Delete Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <MediaLibrary open={isMediaLibraryOpen} onOpenChange={setIsMediaLibraryOpen} onSelectImage={handleImageSelect} />
    </div>
  )
}

"use client"

import type React from "react"

import { useState, useMemo } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { MapPin } from "lucide-react"
import SimpleMap from "@/components/simple-map"
import ModernCalendar from "@/components/modern-calendar"
import ScrollingFeatureCards from "@/components/scrolling-feature-cards"
import { getVisibleEvents, generateCalendarEvents, generateMapLocations } from "@/lib/events-data"
import { format } from "date-fns"

// Feature cards data with the provided images
const featureCards = [
  {
    id: 1,
    title: "Training",
    description:
      "Systematic education in Roman martial arts, focusing on authentic combat techniques and historical accuracy.",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20250516_1020_Roman%20Training%20Emblem_simple_compose_01jvc2td2se6zaqd5wtz0t1tee-jJIKRGlhbh4kyK37jGc8MKcHMTZick.png",
  },
  {
    id: 2,
    title: "Craft Skills",
    description:
      "Acquire artisan skills in crafting equipment for performances and other events, learning traditional methods and materials.",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20250516_1026_Artisan%20Crafting%20Roman%20Armor_simple_compose_01jvc34p6sfw3t9pzd86ahpzb1-rlGbL8F1B141laGOtORNqllf6OBt9z.png",
  },
  {
    id: 3,
    title: "Performances",
    description:
      "A showcase of our knowledge and skills through living-history fencing and combat demonstrations for audiences of all ages.",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20250516_1031_Roman%20Battle%20Scene_simple_compose_01jvc3fckber5v90dhec99qn6b-RcjISR8OgDZmRMouxJUUmx2XlaWZkb.png",
  },
  {
    id: 4,
    title: "Workshops",
    description:
      "Educational programs for children and youth, sharing our expertise with the general public through interactive learning experiences.",
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20250516_1035_Mentor%20Circle%20Logo_simple_compose_01jvc3p6k1ebqbzc5g1e64wn6j-wpL8l9VIIdZqjFNxsqLbSGUkFmfKjN.png",
  },
  {
    id: 5,
    title: "Visit to Rome",
    description:
      'We\'ve already taken part twice in the "Natale di Roma" celebrations and are preparing to attend again.',
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20250516_1038_Colosseum%20Sunrise%20Badge_simple_compose_01jvc3t50be77s120jtpv3resc-XdLRzbjotvOGWWH60fYI2mkHEMhU47.png",
  },
]

export default function JoinUsClientPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [selectedEvent, setSelectedEvent] = useState<number | undefined>(1)
  const [isAdmin, setIsAdmin] = useState(false) // For demo purposes

  // Get events from our centralized data store
  const trainingEvents = useMemo(
    () => getVisibleEvents().filter((event) => event.category === "training" || event.category === "meeting"),
    [],
  )

  // Get calendar events
  const calendarEventInstances = useMemo(() => generateCalendarEvents(), [])

  // Get map locations
  const mapLocations = useMemo(() => generateMapLocations(), [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, you would handle form submission here
    console.log("Form submitted:", formData)
    alert("Thank you for your interest! We will contact you soon.")
    setFormData({ name: "", email: "", phone: "", message: "" })
  }

  const faqs = [
    {
      question: "Do I need prior experience?",
      answer:
        "No prior experience is necessary. We welcome enthusiasts of all backgrounds and provide training for new members.",
    },
    {
      question: "What are the membership costs?",
      answer:
        "Membership fees are €X annually, which covers group insurance, training sessions, and basic equipment maintenance. New members may need to invest in their own kit over time.",
    },
    {
      question: "How much time commitment is required?",
      answer:
        "We typically meet twice a month for training and events. Members are encouraged to attend regularly, but we understand personal commitments vary.",
    },
    {
      question: "Do I need to provide my own equipment?",
      answer:
        "Initially, the group can provide basic loaner equipment for new members. Over time, members are expected to acquire their own historically accurate kit with our guidance.",
    },
    {
      question: "What age requirements are there?",
      answer:
        "Members must be at least 18 years old for full membership. We offer a junior program for those 16-17 with parental consent and supervision.",
    },
  ]

  // Handle calendar event click - map it back to the parent event
  const handleCalendarEventClick = (eventId: number) => {
    const calendarEvent = calendarEventInstances.find((e) => e.id === eventId)
    if (calendarEvent) {
      setSelectedEvent(calendarEvent.parentId)
    }
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section with the new Roman legionaries image */}
      <section className="relative w-full h-[40vh]">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1_Th2A6Ou80r0RCJvpGrBK3A-NyBS6217woHAJ4mDxF6O8Dafu9a1fv.webp"
          alt="Roman legionaries in formation"
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Join Our Ranks</h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Become a member of S.C.E.A.R. and step back in time to experience Roman military history
          </p>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-16 bg-stone-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-6">What Awaits You in Our Group?</h2>
          <p className="text-lg text-center text-stone-700 max-w-3xl mx-auto mb-12">
            If you're interested in the history of Roman military technology, strategy, Roman culture and society, and
            politics—you're in the right place. With us you will find:
          </p>

          <ScrollingFeatureCards cards={featureCards} />
        </div>
      </section>

      {/* Training Events and Map Section - REARRANGED */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Training & Events</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Events List Column - Left side */}
          <div className="space-y-6">
            {trainingEvents.map((event) => (
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
                        event.category === "training"
                          ? "bg-red-800"
                          : event.category === "meeting"
                            ? "bg-amber-700"
                            : "bg-emerald-700"
                      }`}
                    >
                      {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                    </Badge>
                    {event.recurring && <Badge className="absolute top-2 left-2 bg-stone-800">Opakujúce sa</Badge>}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">{event.title}</h3>
                    <div className="space-y-1 text-sm text-stone-600 mb-2">
                      <div className="flex items-center">
                        {event.icon && <event.icon className="h-4 w-4 mr-1" />}
                        <span>{event.recurring ? "Recurring event" : format(new Date(event.startDate), "PPP")}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{event.location.name}</span>
                      </div>
                    </div>
                    <p className="text-sm text-stone-700">{event.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Map Column - Right side */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="h-[500px] w-full rounded-lg overflow-hidden">
                  <SimpleMap
                    locations={mapLocations}
                    selectedLocationId={selectedEvent}
                    onMarkerClick={setSelectedEvent}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Membership Process and Calendar - REARRANGED */}
      <section className="py-16 bg-stone-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Membership Process</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Membership Process - Left side */}
            <div>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-800 flex items-center justify-center text-white font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Contact Us</h3>
                    <p className="text-stone-700">
                      Fill out the form to express your interest and we'll get in touch with you.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-800 flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Attend an Introduction</h3>
                    <p className="text-stone-700">
                      Join us for an introductory session to learn more about our group and activities.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-800 flex items-center justify-center text-white font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Begin Training</h3>
                    <p className="text-stone-700">
                      Start your journey with basic training in Roman military techniques and history.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-800 flex items-center justify-center text-white font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Become a Full Member</h3>
                    <p className="text-stone-700">
                      After completing initial training, you'll be welcomed as a full member of S.C.E.A.R.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Calendar - Right side */}
            <div>
              <div className="flex justify-end mb-4">
                <Button variant="outline" size="sm" onClick={() => setIsAdmin(!isAdmin)} className="text-sm">
                  {isAdmin ? "User Mode" : "Admin Mode"} (Demo)
                </Button>
              </div>

              <Card className="shadow-md">
                <CardContent className="p-4">
                  <ModernCalendar
                    events={calendarEventInstances}
                    onEventClick={handleCalendarEventClick}
                    isAdmin={isAdmin}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Interested in Joining?</h2>
          <p className="text-center text-stone-700 mb-8">
            Fill out the form below and we'll contact you with more information about becoming a member.
          </p>

          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
              <CardDescription>We'll get back to you within 48 hours.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Full Name
                    </label>
                    <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">
                    Phone Number
                  </label>
                  <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Why are you interested in joining?
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                <Button type="submit" className="w-full bg-red-800 hover:bg-red-900">
                  Submit
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 bg-stone-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left font-medium">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-stone-700">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </div>
  )
}

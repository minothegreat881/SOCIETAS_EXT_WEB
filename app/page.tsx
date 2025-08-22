import Link from "next/link"
import Image from "next/image"
import { Users, ImageIcon, BookOpen, ChevronRight, Calendar, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import LiveChat from "@/components/live-chat"
import { format, parseISO, isSameDay } from "date-fns"
import { sk } from "date-fns/locale"
import { getVisibleEvents } from "@/lib/events-data"

export default function Home() {
  // Get visible events from our centralized data store
  const events = getVisibleEvents()

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with new image */}
      <section className="relative w-full h-[80vh]">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/auxilia-hero-TTdTMAbB1pxlA21WXmSj3Wvkp3nuOX.png"
          alt="Roman auxiliary forces in formation"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center items-start">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">S.C.E.A.R.</h1>
          <p className="text-xl md:text-2xl text-white mb-6 max-w-2xl">Rímska armáda a pomocné zbory</p>
          <p className="text-lg text-white/90 mb-8 max-w-xl">
            Experience the authentic reconstruction of Roman auxiliary forces through historical reenactment
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg" className="bg-red-800 hover:bg-red-900">
              <Link href="/join-us">Join Our Group</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="bg-black/30 text-white border-white hover:bg-black/50"
            >
              <Link href="/gallery">View Gallery</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-16 bg-stone-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6 text-stone-800">About S.C.E.A.R.</h2>
              <p className="text-lg text-stone-700 mb-4">
                We are a dedicated group of history enthusiasts focused on the authentic reconstruction of Roman
                auxiliary forces.
              </p>
              <p className="text-lg text-stone-700 mb-6">
                Through meticulous research and craftsmanship, we bring to life the equipment, tactics, and daily life
                of Roman auxiliary soldiers who served alongside the legions.
              </p>
              <Button asChild className="bg-red-800 hover:bg-red-900">
                <Link href="/history">
                  Learn Our History <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="md:w-1/2 relative h-80 md:h-96 w-full rounded-lg overflow-hidden">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/auxilia-feature-nALxPqAUP6KnV6wpViBvho4fjZJ3J6.png"
                alt="Roman auxiliary soldiers in formation"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section - Using centralized data */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold text-stone-800">Upcoming Events</h2>
            <Button asChild className="bg-red-800 hover:bg-red-900">
              <Link href="/events">View All Events</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {events.slice(0, 3).map((event) => (
              <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
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
                  {event.recurring && <Badge className="absolute top-2 left-2 bg-stone-800">Recurring</Badge>}
                </div>
                <CardHeader>
                  <CardTitle>{event.title}</CardTitle>
                  <CardDescription>
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
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-stone-700 line-clamp-2">{event.description}</p>
                </CardContent>
                <CardFooter>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-red-800 text-red-800 hover:bg-red-50 bg-transparent"
                  >
                    <Link href={`/events?event=${event.id}`}>Learn More</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Navigation Sections */}
      <section className="py-16 bg-stone-800 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Explore S.C.E.A.R.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Link href="/gallery" className="group">
              <div className="bg-stone-700 p-8 rounded-lg transition-all hover:bg-stone-600 flex flex-col items-center text-center">
                <ImageIcon className="h-12 w-12 mb-4 text-red-400" />
                <h3 className="text-xl font-bold mb-2">Gallery</h3>
                <p className="text-stone-300">
                  Browse our collection of photos from events, reenactments, and training.
                </p>
                <ChevronRight className="mt-4 h-6 w-6 text-red-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
            <Link href="/join-us" className="group">
              <div className="bg-stone-700 p-8 rounded-lg transition-all hover:bg-stone-600 flex flex-col items-center text-center">
                <Users className="h-12 w-12 mb-4 text-red-400" />
                <h3 className="text-xl font-bold mb-2">Join Us</h3>
                <p className="text-stone-300">
                  Become a member of our historical reenactment group and step back in time.
                </p>
                <ChevronRight className="mt-4 h-6 w-6 text-red-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
            <Link href="/history" className="group">
              <div className="bg-stone-700 p-8 rounded-lg transition-all hover:bg-stone-600 flex flex-col items-center text-center">
                <BookOpen className="h-12 w-12 mb-4 text-red-400" />
                <h3 className="text-xl font-bold mb-2">History</h3>
                <p className="text-stone-300">Learn about Roman auxiliary forces through our articles and research.</p>
                <ChevronRight className="mt-4 h-6 w-6 text-red-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
            <Link href="/events" className="group">
              <div className="bg-stone-700 p-8 rounded-lg transition-all hover:bg-stone-600 flex flex-col items-center text-center">
                <Calendar className="h-12 w-12 mb-4 text-red-400" />
                <h3 className="text-xl font-bold mb-2">Events</h3>
                <p className="text-stone-300">Join our upcoming events, reenactments, and training sessions.</p>
                <ChevronRight className="mt-4 h-6 w-6 text-red-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Live Chat Component */}
      <LiveChat />
    </div>
  )
}

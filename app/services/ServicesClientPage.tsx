"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import WhatsAppChat from "@/components/whatsapp-chat"

export default function ServicesClientPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    eventType: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log("Form submitted:", formData)
    toast({
      title: "Message sent!",
      description: "We'll get back to you as soon as possible.",
    })
    setFormData({
      name: "",
      email: "",
      eventType: "",
      message: "",
    })
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[70vh]">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20250516_1200_Roman%20Honor%20Guard_simple_compose_01jvc8h7fef1wahr6t5q1sndqn-X8GapSfxFlYSooMsY4HM66YSuTONot.png"
          alt="Roman legionaries in formation"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center items-start">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Bring History to Life at Your Event</h1>
          <p className="text-xl md:text-2xl text-white mb-6 max-w-3xl">
            WE WILL ENRICH YOUR EVENTS WITH OUR PRESENTATIONS
          </p>
          <p className="text-lg text-white/90 mb-8 max-w-2xl">
            City/town festivals, cultural events, historical reenactments—let us augment your cultural programme with
            authentic Roman military experiences!
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg" className="bg-red-800 hover:bg-red-900">
              <a href="#services">Explore Our Services</a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="bg-black/30 text-white border-white hover:bg-black/50"
            >
              <a href="#contact">Contact Us</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-stone-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-stone-800">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Service Card 1 */}
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-red-800/20">
              <div className="relative h-64">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20250516_1158_Roman%20Legionary%20Reenactment_simple_compose_01jvc8db4rfr9s8b52k955kc2k-p0tWkVShU1UHb2ZgWeH8L1EVa6hQdV.png"
                  alt="Military Skill Demonstrations"
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader className="bg-red-800 text-white">
                <CardTitle className="text-amber-300">Military Skill Demonstrations</CardTitle>
                <CardDescription className="text-white/80">Authentic combat and tactical displays</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-stone-700">
                  Our troupe brings to life the discipline and prowess of the Roman legionary. Through theatrical-combat
                  shows, expert commentary on battle formations, and immersive camp life presentations, we recreate
                  every aspect of soldiering—from weapon drill to daily routine.
                </p>
                <p className="mt-4 text-stone-700">
                  Each program is tailored to your needs and accompanied by historical insights on equipment, tactics,
                  and legionary life.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full bg-red-800 hover:bg-red-900">
                  <a href="#contact">Request This Service</a>
                </Button>
              </CardFooter>
            </Card>

            {/* Service Card 2 */}
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-red-800/20">
              <div className="relative h-64">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20250516_1200_Roman%20Honor%20Guard_simple_compose_01jvc8h7fef1wahr6t5q1sndqn-X8GapSfxFlYSooMsY4HM66YSuTONot.png"
                  alt="Honor Guard & Road Patrol"
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader className="bg-red-800 text-white">
                <CardTitle className="text-amber-300">Honor Guard & Road Patrol</CardTitle>
                <CardDescription className="text-white/80">Ceremonial presence for special events</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-stone-700">
                  Roman auxiliary cohorts (auxilia) often served as personal escort for magistrates traveling across the
                  provinces. We rent out fully outfitted legionaries to serve as ceremonial guards or personal
                  protection at public ceremonies, corporate events, school programmes, or children's camps.
                </p>
                <p className="mt-4 text-stone-700">Pricing is bespoke based on your requirements and event duration.</p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full bg-red-800 hover:bg-red-900">
                  <a href="#contact">Request This Service</a>
                </Button>
              </CardFooter>
            </Card>

            {/* Service Card 3 */}
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-red-800/20">
              <div className="relative h-64">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20250516_1202_Roman%20Camp%20Authentic%20Experience_simple_compose_01jvc8n5fwfx6809gw5jmbmrry-msyHQ4W2rsi2YQkJxnuW6xdhDmUf2G.png"
                  alt="Camp & Workshop"
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader className="bg-red-800 text-white">
                <CardTitle className="text-amber-300">Camp & Workshop</CardTitle>
                <CardDescription className="text-white/80">Interactive historical experiences</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-stone-700">
                  Try your hand at legionary life! Participants can handle replica weapons, explore Roman material
                  culture, play period games, light a fire with friction, and sample ancient recipes cooked on a
                  portable "craticula."
                </p>
                <p className="mt-4 text-stone-700">
                  Perfect for hands-on history workshops, living-history encampments, or interactive school programmes.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full bg-red-800 hover:bg-red-900">
                  <a href="#contact">Request This Service</a>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-stone-800 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Contact Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-amber-300">Interested?</h3>
              <p className="mb-6">
                Drop us a line and we'll craft a custom offer for your event. Our team will work with you to create a
                memorable historical experience tailored to your specific needs and audience.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-3 text-amber-300"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <span>info@scear-roman-army.com</span>
                </div>
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-3 text-amber-300"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span>+421 123 456 789</span>
                </div>
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-3 text-amber-300"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>Bratislava, Slovakia</span>
                </div>
              </div>
              <div className="mt-8">
                <h4 className="text-xl font-bold mb-4">Follow Us</h4>
                <div className="flex space-x-4">
                  <a
                    href="https://www.instagram.com/cohvlvc/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-amber-300 transition-colors"
                    aria-label="Instagram"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6"
                    >
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                    </svg>
                  </a>
                  <a
                    href="https://www.facebook.com/rimska.kohorta/?locale=sk_SK"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-amber-300 transition-colors"
                    aria-label="Facebook"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6"
                    >
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  </a>
                  <a href="#" className="text-white hover:text-amber-300 transition-colors" aria-label="WhatsApp">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6"
                    >
                      <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.2.3-.767.966-.94 1.164-.173.199-.347.223-.646.075-.3-.15-1.269-.467-2.416-1.483-.893-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.462.13-.61.136-.137.3-.354.45-.53.149-.176.199-.301.3-.502.099-.2.05-.374-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172 0-.371-.025-.571-.025-.2 0-.523.074-.797.359-.273.283-1.045 1.022-1.045 2.492 0 1.47 1.069 2.889 1.22 3.089.149.2 2.095 3.18 5.076 4.458.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            <div>
              <form onSubmit={handleSubmit} className="bg-stone-700 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Send Us a Message</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                      Your Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="bg-stone-600 border-stone-500 text-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="bg-stone-600 border-stone-500 text-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="eventType" className="block text-sm font-medium mb-1">
                      Event Type
                    </label>
                    <Input
                      id="eventType"
                      name="eventType"
                      placeholder="Festival, School Event, Corporate, etc."
                      value={formData.eventType}
                      onChange={handleChange}
                      className="bg-stone-600 border-stone-500 text-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-1">
                      Your Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="bg-stone-600 border-stone-500 text-white"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-red-800 hover:bg-red-900">
                    Send Message
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp Chat Component */}
      <WhatsAppChat />
    </div>
  )
}

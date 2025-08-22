"use client"
import Image from "next/image"
import { motion } from "framer-motion"
import { galleryImages, galleryCategories } from "@/lib/gallery-data"
import ModernGallery from "@/components/modern-gallery"
import { Camera } from "lucide-react"

export default function GalleryClientPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh]">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <Image
          src="/images/gallery/colosseum-rome.jpeg"
          alt="Roman auxiliary forces gallery"
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-800/80 p-2 rounded-full">
                <Camera className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl text-red-200 font-medium">Photo Collection</h2>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">Our Gallery</h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl leading-relaxed">
              Explore our collection of photos showcasing Roman auxiliary reenactments, training sessions, and
              historical events across Europe.
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-stone-50 to-transparent z-10"></div>
      </section>

      {/* Gallery Content */}
      <section className="py-16 container mx-auto px-4">
        <ModernGallery images={galleryImages} categories={galleryCategories} />
      </section>
    </div>
  )
}

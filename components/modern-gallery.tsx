"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { GalleryImage } from "@/lib/gallery-data"
import GalleryLightbox from "./gallery-lightbox"

type ModernGalleryProps = {
  images: GalleryImage[]
  categories: string[]
}

export default function ModernGallery({ images, categories }: ModernGalleryProps) {
  const [activeCategory, setActiveCategory] = useState("All")
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null)
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([])
  const [featuredImages, setFeaturedImages] = useState<GalleryImage[]>([])
  const galleryRef = useRef<HTMLDivElement>(null)
  const featuredCarouselRef = useRef<HTMLDivElement>(null)

  // Filter images based on active category
  useEffect(() => {
    const filtered = activeCategory === "All" ? images : images.filter((img) => img.category === activeCategory)
    setFilteredImages(filtered)

    // Set featured images
    setFeaturedImages(images.filter((img) => img.featured))
  }, [activeCategory, images])

  // Handle image click
  const handleImageClick = (image: GalleryImage) => {
    setSelectedImageId(image.id)
  }

  // Close lightbox
  const closeLightbox = () => {
    setSelectedImageId(null)
  }

  const scrollFeatured = (direction: "left" | "right") => {
    if (featuredCarouselRef.current) {
      const scrollAmount = featuredCarouselRef.current.offsetWidth
      featuredCarouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className="space-y-12">
      {/* Featured Images Carousel */}
      {featuredImages.length > 0 && (
        <div className="relative">
          <div
            ref={featuredCarouselRef}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide rounded-xl shadow-xl"
          >
            {featuredImages.map((image) => (
              <div
                key={image.id}
                className="relative flex-shrink-0 w-full snap-center cursor-pointer"
                onClick={() => handleImageClick(image)}
              >
                <div className="relative h-[50vh] w-full">
                  <Image
                    src={image.src || "/placeholder.svg"}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    sizes="100vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <h3 className="text-3xl font-bold mb-3 drop-shadow-md">{image.alt}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-5 w-5 text-red-400" />
                      <span className="text-lg font-medium">{image.location}</span>
                    </div>
                    <p className="text-white/90 max-w-2xl text-lg">{image.activity}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 rounded-full w-12 h-12 shadow-lg transition-all duration-200 hover:scale-110"
            onClick={() => scrollFeatured("left")}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 rounded-full w-12 h-12 shadow-lg transition-all duration-200 hover:scale-110"
            onClick={() => scrollFeatured("right")}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex flex-wrap gap-3 justify-center">
        {categories.map((category) => (
          <Button
            key={category}
            variant={category === activeCategory ? "default" : "outline"}
            className={`px-6 py-2 rounded-full transition-all duration-300 ${
              category === activeCategory
                ? "bg-red-800 hover:bg-red-900 shadow-md"
                : "hover:border-red-800 hover:text-red-800"
            }`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Masonry Gallery using CSS columns for perfect aspect ratio handling */}
      <div ref={galleryRef} className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {filteredImages.map((image, index) => (
          <motion.div
            key={image.id}
            className="break-inside-avoid cursor-pointer group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            whileHover={{ y: -5 }}
            onClick={() => handleImageClick(image)}
          >
            <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
              <Image
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                width={400}
                height={600}
                className="w-full h-auto transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />

              {/* Category badge */}
              <div className="absolute top-3 left-3 z-10">
                <Badge className="bg-gradient-to-r from-red-800 to-red-700 hover:from-red-700 hover:to-red-600 px-2.5 py-0.5 text-xs font-medium shadow-lg border border-red-700/20">
                  {image.category}
                </Badge>
              </div>

              {/* Text container */}
              <div className="absolute bottom-0 right-0 max-w-[70%] bg-gradient-to-tl from-black/90 via-black/80 to-black/60 backdrop-blur-sm rounded-tl-lg shadow-lg transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 overflow-hidden">
                <div className="p-3 border-l-2 border-red-700">
                  <h3 className="font-medium text-sm text-white mb-1 line-clamp-1">{image.alt}</h3>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3 w-3 text-red-400 flex-shrink-0" />
                    <span className="text-xs font-light text-gray-200 line-clamp-1">{image.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedImageId !== null && (
        <GalleryLightbox images={filteredImages} currentImageId={selectedImageId} onClose={closeLightbox} />
      )}
    </div>
  )
}

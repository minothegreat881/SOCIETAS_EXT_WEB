"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight, Download, Share, Heart, MapPin, Tag, Info } from "lucide-react"

type GalleryLightboxProps = {
  images: {
    id: number
    src: string
    alt: string
    category: string
    location?: string
    activity?: string
    date?: string
  }[]
  currentImageId: number | null
  onClose: () => void
}

export default function GalleryLightbox({ images, currentImageId, onClose }: GalleryLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Set current index based on currentImageId
  useEffect(() => {
    if (currentImageId === null) return
    const index = images.findIndex((img) => img.id === currentImageId)
    if (index !== -1) setCurrentIndex(index)
  }, [currentImageId, images])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") prevImage()
      if (e.key === "ArrowRight") nextImage()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  const currentImage = images[currentIndex]

  // Simple navigation functions
  const nextImage = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation()
    }
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation()
    }
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  // Handle close with stopPropagation
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation()
    onClose()
  }

  if (!currentImage) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={onClose}>
      {/* Main container */}
      <div className="relative w-full h-full flex" onClick={(e) => e.stopPropagation()}>
        {/* Image container */}
        <div className={`${isMobile ? "w-full" : "w-[90%]"} h-full flex items-center justify-center relative`}>
          {/* Image */}
          <div className="relative h-[85vh] w-full">
            <Image
              src={currentImage.src || "/placeholder.svg"}
              alt={currentImage.alt}
              fill
              className="object-contain"
              sizes="90vw"
              priority
            />
          </div>

          {/* Navigation buttons - simplified and larger */}
          <div className="absolute left-6 top-1/2 -translate-y-1/2 z-20" onClick={(e) => e.stopPropagation()}>
            <button
              className="w-14 h-14 flex items-center justify-center bg-black/70 hover:bg-red-900/70 rounded-full transition-colors duration-200"
              onClick={prevImage}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-8 w-8 text-white" />
            </button>
          </div>

          <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20" onClick={(e) => e.stopPropagation()}>
            <button
              className="w-14 h-14 flex items-center justify-center bg-black/70 hover:bg-red-900/70 rounded-full transition-colors duration-200"
              onClick={nextImage}
              aria-label="Next image"
            >
              <ChevronRight className="h-8 w-8 text-white" />
            </button>
          </div>
        </div>

        {/* Info panel - redesigned for better aesthetics */}
        <div className={`${isMobile ? "hidden" : "block"} w-[10%] h-full bg-[#111] border-l border-red-900/30`}>
          {/* Close button */}
          <button
            className="absolute top-4 right-4 z-50 w-10 h-10 flex items-center justify-center bg-black/70 hover:bg-red-900/70 rounded-full transition-colors duration-200"
            onClick={handleClose}
          >
            <X className="h-5 w-5 text-white" />
          </button>

          {/* Content container */}
          <div className="h-full flex flex-col">
            {/* Title section */}
            <div className="p-4 border-b border-red-900/40 bg-black/50">
              <h3 className="text-base font-semibold text-white leading-tight">{currentImage.alt}</h3>
            </div>

            {/* Info sections */}
            <div className="flex-grow overflow-y-auto p-4 space-y-6">
              {/* Location */}
              {currentImage.location && (
                <div className="bg-black/30 rounded-md p-3 border-l-2 border-red-800">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-red-900/40 p-1.5 rounded-full">
                      <MapPin className="h-4 w-4 text-red-400" />
                    </div>
                    <h4 className="text-sm text-red-400 font-medium">Location</h4>
                  </div>
                  <p className="text-sm text-gray-300 pl-2">{currentImage.location}</p>
                </div>
              )}

              {/* Activity */}
              {currentImage.activity && (
                <div className="bg-black/30 rounded-md p-3 border-l-2 border-blue-800">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-blue-900/40 p-1.5 rounded-full">
                      <Info className="h-4 w-4 text-blue-400" />
                    </div>
                    <h4 className="text-sm text-blue-400 font-medium">Activity</h4>
                  </div>
                  <p className="text-sm text-gray-300 pl-2">{currentImage.activity}</p>
                </div>
              )}

              {/* Category */}
              {currentImage.category && (
                <div className="bg-black/30 rounded-md p-3 border-l-2 border-amber-800">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-amber-900/40 p-1.5 rounded-full">
                      <Tag className="h-4 w-4 text-amber-400" />
                    </div>
                    <h4 className="text-sm text-amber-400 font-medium">Category</h4>
                  </div>
                  <p className="text-sm text-gray-300 pl-2">{currentImage.category}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-red-900/40 bg-black/50 flex justify-between items-center">
              <span className="text-sm text-gray-400 bg-black/50 px-2 py-1 rounded-full">
                {currentIndex + 1}/{images.length}
              </span>
              <div className="flex gap-2">
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-black/40 hover:bg-red-900/40 transition-colors duration-200"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsLiked(!isLiked)
                  }}
                >
                  <Heart className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : "text-white"}`} />
                </button>
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-black/40 hover:bg-blue-900/40 transition-colors duration-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Share className="h-4 w-4 text-white" />
                </button>
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-black/40 hover:bg-green-900/40 transition-colors duration-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Download className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="absolute bottom-4 left-0 right-0 overflow-x-auto py-2 px-4">
        <div className="flex gap-2 justify-center">
          {images.slice(Math.max(0, currentIndex - 3), Math.min(images.length, currentIndex + 4)).map((img) => (
            <div
              key={img.id}
              className={`relative h-16 w-16 rounded-md overflow-hidden cursor-pointer transition-all duration-300 ${
                img.id === currentImage.id
                  ? "ring-2 ring-red-500 scale-110"
                  : "opacity-60 hover:opacity-100 hover:scale-105"
              }`}
              onClick={(e) => {
                e.stopPropagation()
                setCurrentIndex(images.findIndex((image) => image.id === img.id))
              }}
            >
              <Image src={img.src || "/placeholder.svg"} alt={img.alt} fill className="object-cover" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

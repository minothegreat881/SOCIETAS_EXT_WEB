"use client"
import { useState, useMemo } from "react"
import Image from "next/image"
import { Search, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { galleryImages, galleryCategories } from "@/lib/gallery-data"
import { ScrollArea } from "@/components/ui/scroll-area"

type MediaLibraryProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectImage: (imageUrl: string) => void
}

export default function MediaLibrary({ open, onOpenChange, onSelectImage }: MediaLibraryProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredImages = useMemo(() => {
    return galleryImages
      .filter((image) => {
        if (selectedCategory === "All") return true
        return image.category === selectedCategory
      })
      .filter((image) => {
        const searchLower = searchTerm.toLowerCase()
        return (
          image.alt.toLowerCase().includes(searchLower) ||
          image.location.toLowerCase().includes(searchLower) ||
          image.activity.toLowerCase().includes(searchLower)
        )
      })
  }, [searchTerm, selectedCategory])

  const handleSelect = (src: string) => {
    onSelectImage(src)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Media Library</DialogTitle>
          <DialogDescription>Select an image from the gallery or upload a new one.</DialogDescription>
        </DialogHeader>
        <div className="flex-shrink-0 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
            <Input
              placeholder="Search by title, location, or activity..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={() => setSearchTerm("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {galleryCategories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={
                  selectedCategory === category ? "bg-red-800 hover:bg-red-900" : "border-stone-300 text-stone-700"
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
        <ScrollArea className="flex-grow mt-4 pr-4 -mr-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredImages.map((image) => (
              <button
                key={image.id}
                onClick={() => handleSelect(image.src)}
                className="relative aspect-square rounded-md overflow-hidden group border-2 border-transparent hover:border-red-800 focus:border-red-800 focus:outline-none transition-all"
              >
                <Image src={image.src || "/placeholder.svg"} alt={image.alt} fill className="object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all" />
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-white text-xs font-semibold truncate">{image.alt}</p>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

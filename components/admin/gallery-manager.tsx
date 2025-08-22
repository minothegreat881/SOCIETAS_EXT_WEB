"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, Save, X, FolderPlus, ImageIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import MediaLibrary from "./media-library"

type GalleryItem = {
  id: number
  title: string
  description: string
  imageUrl: string
  category: string
  date: string
}

const initialGallery: GalleryItem[] = [
  {
    id: 1,
    title: "Battle Formation",
    description: "Roman auxiliary soldiers demonstrating battle formations during a reenactment event.",
    imageUrl: "/images/gallery/roman-battle-formation.png",
    category: "Reenactments",
    date: "2024-05-15",
  },
  {
    id: 2,
    title: "Equipment Display",
    description: "A detailed display of authentic Roman auxiliary equipment and weapons.",
    imageUrl: "/images/gallery/roman-armor-display.png",
    category: "Equipment",
    date: "2024-04-20",
  },
]

const initialCategories = ["Reenactments", "Equipment", "Training", "Members", "Events"]

export default function GalleryManager() {
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [isEditing, setIsEditing] = useState<number | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [formData, setFormData] = useState<Partial<GalleryItem>>({})
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<number | null>(null)
  const [newCategory, setNewCategory] = useState("")
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false)
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const savedGallery = localStorage.getItem("scear-gallery")
    if (savedGallery) setGallery(JSON.parse(savedGallery))
    else setGallery(initialGallery)

    const savedCategories = localStorage.getItem("scear-gallery-categories")
    if (savedCategories) setCategories(JSON.parse(savedCategories))
    else setCategories(initialCategories)
  }, [])

  useEffect(() => {
    if (gallery.length) localStorage.setItem("scear-gallery", JSON.stringify(gallery))
    if (categories.length) localStorage.setItem("scear-gallery-categories", JSON.stringify(categories))
  }, [gallery, categories])

  const handleEditItem = (item: GalleryItem) => {
    setFormData(item)
    setIsEditing(item.id)
    setIsAddingNew(false)
  }

  const handleAddNew = () => {
    setFormData({
      title: "",
      description: "",
      imageUrl: "",
      category: categories[0],
      date: new Date().toISOString().split("T")[0],
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

  const handleImageSelect = (imageUrl: string) => {
    setFormData((prev) => ({ ...prev, imageUrl }))
    setIsMediaLibraryOpen(false)
  }

  const handleSaveItem = () => {
    if (!formData.title || !formData.imageUrl || !formData.category) {
      toast({ title: "Missing information", variant: "destructive" })
      return
    }

    if (isAddingNew) {
      const newItem = { ...formData, id: Math.max(0, ...gallery.map((item) => item.id)) + 1 } as GalleryItem
      setGallery([...gallery, newItem])
      toast({ title: "Image added" })
    } else if (isEditing) {
      setGallery(gallery.map((item) => (item.id === isEditing ? ({ ...item, ...formData } as GalleryItem) : item)))
      toast({ title: "Image updated" })
    }

    handleCancelEdit()
  }

  const confirmDelete = (itemId: number) => {
    setItemToDelete(itemId)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteItem = () => {
    if (itemToDelete) {
      setGallery(gallery.filter((item) => item.id !== itemToDelete))
      setIsDeleteDialogOpen(false)
      setItemToDelete(null)
      toast({ title: "Image deleted" })
    }
  }

  const handleAddCategory = () => {
    if (!newCategory.trim() || categories.includes(newCategory.trim())) {
      toast({ title: "Invalid category name", variant: "destructive" })
      return
    }
    setCategories([...categories, newCategory.trim()])
    setNewCategory("")
    setIsAddCategoryDialogOpen(false)
    toast({ title: "Category added" })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Gallery</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsAddCategoryDialogOpen(true)}>
            <FolderPlus className="mr-2 h-4 w-4" /> Add Category
          </Button>
          <Button onClick={handleAddNew} className="bg-red-800 hover:bg-red-900">
            <Plus className="mr-2 h-4 w-4" /> Add New Image
          </Button>
        </div>
      </div>

      {(isEditing || isAddingNew) && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{isAddingNew ? "Add New Image" : "Edit Image"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="title">Title*</label>
                  <Input id="title" name="title" value={formData.title || ""} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="description">Description</label>
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
                  <Select value={formData.category} onValueChange={(v) => setFormData((p) => ({ ...p, category: v }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="date">Date</label>
                  <Input id="date" name="date" type="date" value={formData.date || ""} onChange={handleInputChange} />
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label>Image*</label>
                  <div className="relative aspect-video w-full border rounded-md overflow-hidden">
                    {formData.imageUrl ? (
                      <Image
                        src={formData.imageUrl || "/placeholder.svg"}
                        alt="Preview"
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
                    Select from Library
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleCancelEdit}>
              <X className="mr-2 h-4 w-4" /> Cancel
            </Button>
            <Button className="bg-red-800 hover:bg-red-900" onClick={handleSaveItem}>
              <Save className="mr-2 h-4 w-4" /> Save Image
            </Button>
          </CardFooter>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gallery.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="relative h-48">
              <Image src={item.imageUrl || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
            </div>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.category}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-stone-700 line-clamp-2">{item.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm" onClick={() => handleEditItem(item)}>
                <Pencil className="h-4 w-4 mr-1" /> Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 bg-transparent"
                onClick={() => confirmDelete(item.id)}
              >
                <Trash2 className="h-4 w-4 mr-1" /> Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteItem}>
              Delete Image
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddCategoryDialogOpen} onOpenChange={setIsAddCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddCategoryDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-red-800 hover:bg-red-900" onClick={handleAddCategory}>
              Add Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <MediaLibrary open={isMediaLibraryOpen} onOpenChange={setIsMediaLibraryOpen} onSelectImage={handleImageSelect} />
    </div>
  )
}

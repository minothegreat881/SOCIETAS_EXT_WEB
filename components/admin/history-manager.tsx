"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { BookOpen, Plus, Pencil, Trash2, Save, X, Layout, AlignLeft, AlignRight, Star } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import MediaLibrary from "./media-library"

type ArticleTemplate = "classic" | "image-left" | "image-right" | "featured"

type Article = {
  id: number
  title: string
  excerpt: string
  content: string
  imageUrl: string
  date: string
  author: string
  template: ArticleTemplate
}

const initialArticles: Article[] = [
  {
    id: 1,
    title: "The Role of Auxiliary Forces in the Roman Army",
    excerpt:
      "Auxiliary units provided the Roman army with specialized capabilities that legionaries lacked, including light infantry, archers, and cavalry.",
    content:
      "The Roman auxiliary forces (Latin: auxilia) constituted the standing non-citizen corps of the Imperial Roman army during the Principate era (30 BC–284 AD), alongside the citizen legions. By the 2nd century, the auxilia contained the same number of infantry as the legions and, in addition, provided almost all of the Roman army's cavalry and light troops.",
    imageUrl: "/images/gallery/roman-battle-formation.png",
    date: "2025-05-10",
    author: "Marcus Aurelius",
    template: "classic",
  },
  {
    id: 2,
    title: "Equipment and Weapons of Roman Auxiliaries",
    excerpt:
      "Unlike legionaries, auxiliary soldiers used a diverse range of equipment, often reflecting their ethnic origins and specialized roles.",
    content:
      "The equipment of Roman auxiliary soldiers varied widely depending on their unit type, ethnic origin, and specific role within the Roman army. Unlike the more standardized equipment of the legionaries, auxiliary equipment often reflected the traditional fighting styles of the provinces from which the soldiers were recruited.",
    imageUrl: "/images/gallery/roman-armor-display.png",
    date: "2025-04-25",
    author: "Julia Domna",
    template: "image-left",
  },
]

const TemplateCard = ({
  value,
  label,
  icon: Icon,
  isSelected,
  onSelect,
}: {
  value: ArticleTemplate
  label: string
  icon: React.ElementType
  isSelected: boolean
  onSelect: (value: ArticleTemplate) => void
}) => (
  <div
    onClick={() => onSelect(value)}
    className={`cursor-pointer rounded-lg border-2 p-4 flex flex-col items-center justify-center gap-2 text-center transition-all ${
      isSelected ? "border-red-800 ring-2 ring-red-800/50 bg-red-50" : "border-stone-200 hover:border-stone-400"
    }`}
  >
    <Icon className="h-8 w-8 text-red-800" />
    <p className="text-sm font-medium text-stone-800">{label}</p>
  </div>
)

export default function HistoryManager() {
  const [articles, setArticles] = useState<Article[]>([])
  const [isEditing, setIsEditing] = useState<number | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [formData, setFormData] = useState<Partial<Article>>({})
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [articleToDelete, setArticleToDelete] = useState<number | null>(null)
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const savedArticles = localStorage.getItem("scear-articles")
    if (savedArticles) setArticles(JSON.parse(savedArticles))
    else setArticles(initialArticles)
  }, [])

  useEffect(() => {
    if (articles.length) localStorage.setItem("scear-articles", JSON.stringify(articles))
  }, [articles])

  const handleEditArticle = (article: Article) => {
    setFormData(article)
    setIsEditing(article.id)
    setIsAddingNew(false)
  }

  const handleAddNew = () => {
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      imageUrl: "",
      date: new Date().toISOString().split("T")[0],
      author: "",
      template: "classic",
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

  const handleTemplateSelect = (template: ArticleTemplate) => {
    setFormData((prev) => ({ ...prev, template }))
  }

  const handleSaveArticle = () => {
    if (!formData.title || !formData.excerpt || !formData.content || !formData.author) {
      toast({ title: "Missing information", variant: "destructive" })
      return
    }

    if (isAddingNew) {
      const newArticle = { ...formData, id: Math.max(0, ...articles.map((a) => a.id)) + 1 } as Article
      setArticles([...articles, newArticle])
      toast({ title: "Article created" })
    } else if (isEditing) {
      setArticles(articles.map((a) => (a.id === isEditing ? ({ ...a, ...formData } as Article) : a)))
      toast({ title: "Article updated" })
    }

    handleCancelEdit()
  }

  const confirmDelete = (articleId: number) => {
    setArticleToDelete(articleId)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteArticle = () => {
    if (articleToDelete) {
      setArticles(articles.filter((article) => article.id !== articleToDelete))
      setIsDeleteDialogOpen(false)
      setArticleToDelete(null)
      toast({ title: "Article deleted" })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage History Articles</h2>
        <Button onClick={handleAddNew} className="bg-red-800 hover:bg-red-900">
          <Plus className="mr-2 h-4 w-4" /> Add New Article
        </Button>
      </div>

      {(isEditing || isAddingNew) && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{isAddingNew ? "Add New Article" : "Edit Article"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Article Layout Template</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <TemplateCard
                    value="classic"
                    label="Classic"
                    icon={Layout}
                    isSelected={formData.template === "classic"}
                    onSelect={handleTemplateSelect}
                  />
                  <TemplateCard
                    value="image-left"
                    label="Image Left"
                    icon={AlignLeft}
                    isSelected={formData.template === "image-left"}
                    onSelect={handleTemplateSelect}
                  />
                  <TemplateCard
                    value="image-right"
                    label="Image Right"
                    icon={AlignRight}
                    isSelected={formData.template === "image-right"}
                    onSelect={handleTemplateSelect}
                  />
                  <TemplateCard
                    value="featured"
                    label="Featured"
                    icon={Star}
                    isSelected={formData.template === "featured"}
                    onSelect={handleTemplateSelect}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="title">Title*</label>
                  <Input id="title" name="title" value={formData.title || ""} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="author">Author*</label>
                  <Input id="author" name="author" value={formData.author || ""} onChange={handleInputChange} />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="excerpt">Excerpt/Summary*</label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt || ""}
                  onChange={handleInputChange}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="content">Content*</label>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content || ""}
                  onChange={handleInputChange}
                  rows={10}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label>Article Image</label>
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
                        <BookOpen className="h-12 w-12 text-stone-400" />
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
                <div className="space-y-2">
                  <label htmlFor="date">Publication Date</label>
                  <Input id="date" name="date" type="date" value={formData.date || ""} onChange={handleInputChange} />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleCancelEdit}>
              <X className="mr-2 h-4 w-4" /> Cancel
            </Button>
            <Button className="bg-red-800 hover:bg-red-900" onClick={handleSaveArticle}>
              <Save className="mr-2 h-4 w-4" /> Save Article
            </Button>
          </CardFooter>
        </Card>
      )}

      <div className="space-y-4">
        {articles.map((article) => (
          <Card key={article.id} className="overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/4 relative h-48 md:h-auto">
                <Image src={article.imageUrl || "/placeholder.svg"} alt={article.title} fill className="object-cover" />
              </div>
              <div className="md:w-3/4 p-4">
                <h3 className="font-bold text-lg">{article.title}</h3>
                <p className="text-stone-700 mb-4 line-clamp-2">{article.excerpt}</p>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditArticle(article)}>
                    <Pencil className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 bg-transparent"
                    onClick={() => confirmDelete(article.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </div>
              </div>
            </div>
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
            <Button variant="destructive" onClick={handleDeleteArticle}>
              Delete Article
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <MediaLibrary open={isMediaLibraryOpen} onOpenChange={setIsMediaLibraryOpen} onSelectImage={handleImageSelect} />
    </div>
  )
}

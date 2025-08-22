"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, User, Calendar } from "lucide-react"

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

const slugify = (text: string) => {
  if (!text) return ""
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "")
}

const ArticleRenderer = ({ article }: { article: Article }) => {
  const paragraphs = article.content.split("\n").filter((p) => p.trim() !== "")

  const ArticleHeader = () => (
    <div className="mb-8">
      <h1 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4">{article.title}</h1>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-stone-500">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span>{article.author}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>{new Date(article.date).toLocaleDateString("sk-SK", { dateStyle: "long" })}</span>
        </div>
      </div>
    </div>
  )

  const ArticleBody = () => (
    <div className="prose prose-stone max-w-none lg:prose-lg">
      {paragraphs.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  )

  switch (article.template) {
    case "featured":
      return (
        <div>
          <div className="relative h-[60vh] w-full mb-12">
            <Image
              src={article.imageUrl || "/placeholder.svg"}
              alt={article.title}
              fill
              className="object-cover rounded-lg shadow-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg" />
            <div className="absolute bottom-0 p-8 text-white">
              <h1 className="text-4xl md:text-6xl font-bold">{article.title}</h1>
              <p className="mt-2 text-xl max-w-3xl">{article.excerpt}</p>
            </div>
          </div>
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-4 text-stone-500 mb-8">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" /> <span>{article.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />{" "}
                <span>{new Date(article.date).toLocaleDateString("sk-SK", { dateStyle: "long" })}</span>
              </div>
            </div>
            <ArticleBody />
          </div>
        </div>
      )
    case "image-left":
      return (
        <div className="container mx-auto px-4">
          <ArticleHeader />
          <div className="grid md:grid-cols-12 gap-8">
            <div className="md:col-span-5 lg:col-span-4">
              <div className="relative aspect-[3/4] w-full sticky top-24">
                <Image
                  src={article.imageUrl || "/placeholder.svg"}
                  alt={article.title}
                  fill
                  className="object-cover rounded-lg shadow-md"
                />
              </div>
            </div>
            <div className="md:col-span-7 lg:col-span-8">
              <ArticleBody />
            </div>
          </div>
        </div>
      )
    case "image-right":
      return (
        <div className="container mx-auto px-4">
          <ArticleHeader />
          <div className="grid md:grid-cols-12 gap-8">
            <div className="md:col-span-7 lg:col-span-8">
              <ArticleBody />
            </div>
            <div className="md:col-span-5 lg:col-span-4">
              <div className="relative aspect-[3/4] w-full sticky top-24">
                <Image
                  src={article.imageUrl || "/placeholder.svg"}
                  alt={article.title}
                  fill
                  className="object-cover rounded-lg shadow-md"
                />
              </div>
            </div>
          </div>
        </div>
      )
    case "classic":
    default:
      return (
        <div className="container mx-auto px-4 max-w-4xl">
          <ArticleHeader />
          <div className="relative aspect-video w-full mb-8">
            <Image
              src={article.imageUrl || "/placeholder.svg"}
              alt={article.title}
              fill
              className="object-cover rounded-lg shadow-md"
            />
          </div>
          <ArticleBody />
        </div>
      )
  }
}

export default function DynamicHistoryArticlePage() {
  const params = useParams()
  const slug = params.slug as string
  const [article, setArticle] = useState<Article | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (slug) {
      try {
        const savedArticles = JSON.parse(localStorage.getItem("scear-articles") || "[]")
        const foundArticle = savedArticles.find((art: Article) => slugify(art.title) === slug)
        if (foundArticle) {
          setArticle(foundArticle)
        } else {
          setError("Článok nebol nájdený.")
        }
      } catch (e) {
        setError("Nepodarilo sa načítať články.")
        console.error(e)
      }
    }
  }, [slug])

  return (
    <div className="min-h-screen bg-stone-50 py-12 md:py-20">
      <div className="container mx-auto px-4 mb-8">
        <Button asChild variant="outline">
          <Link href="/history">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Späť na históriu
          </Link>
        </Button>
      </div>

      {article ? (
        <ArticleRenderer article={article} />
      ) : (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold">{error || "Načítava sa článok..."}</h2>
        </div>
      )}
    </div>
  )
}

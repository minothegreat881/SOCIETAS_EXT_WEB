"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen } from "lucide-react"
import RomanSectionHeader from "@/components/roman-section-header"

type ArticleTemplate = "classic" | "image-left" | "image-right" | "featured"

type DynamicArticle = {
  id: number
  title: string
  excerpt: string
  imageUrl: string
  template: ArticleTemplate
}

type StaticArticle = {
  title: string
  description: string
  href: string
  imageUrl: string
}

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, "") // Trim - from end of text
}

export default function HistoryPage() {
  const [dynamicArticles, setDynamicArticles] = useState<DynamicArticle[]>([])

  useEffect(() => {
    const savedArticles = localStorage.getItem("scear-articles")
    if (savedArticles) {
      setDynamicArticles(JSON.parse(savedArticles))
    }
  }, [])

  const staticArticles: StaticArticle[] = [
    {
      title: "Rímska armáda a pomocné zbory",
      description: "Komplexný pohľad na štruktúru a význam pomocných zborov v rímskej armáde.",
      href: "/history/auxiliary-forces",
      imageUrl: "/images/gallery/roman-battle-formation.png",
    },
    {
      title: "XV. légia Apollinaris",
      description: "História XV. légie Apollinaris a jej pôsobenie v Rímskej ríši.",
      href: "/history/xv-legia-apollinaris",
      imageUrl: "/images/gallery/roman-formation.png",
    },
  ]

  const allArticles = [
    ...staticArticles.map((a) => ({ ...a, isStatic: true })),
    ...dynamicArticles.map((a) => ({
      title: a.title,
      description: a.excerpt,
      href: `/history/view/${slugify(a.title)}`,
      imageUrl: a.imageUrl,
      isStatic: false,
    })),
  ]

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800">
      <main>
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <RomanSectionHeader
              title="História a výskum"
              subtitle="Naše články"
              description="Ponorte sa do fascinujúceho sveta rímskej histórie prostredníctvom našich článkov a výskumu. Objavte príbehy légií, pomocných zborov a každodenného života v Rímskej ríši."
            />

            {allArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                {allArticles.map((article, index) => (
                  <Card
                    key={index}
                    className="overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  >
                    <Link href={article.href}>
                      <div className="relative h-56 w-full">
                        <Image
                          src={article.imageUrl || "/placeholder.svg"}
                          alt={article.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold text-red-900 mb-2">{article.title}</h3>
                        <p className="text-stone-600 line-clamp-3 mb-4">{article.description}</p>
                        <Button variant="link" className="p-0 text-red-800 font-semibold">
                          Čítať viac <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Link>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <BookOpen className="mx-auto h-16 w-16 text-stone-400 mb-4" />
                <h3 className="text-2xl font-semibold mb-2">Žiadne články</h3>
                <p className="text-stone-500">Momentálne tu nie sú žiadne historické články.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

"use client";

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

export default function HistoryDetailPage({ slug }: { slug: string }) {
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="container mx-auto px-4 py-8">
        <h1>History Detail Page - {slug}</h1>
        <Button asChild variant="outline">
          <Link href="/history" className="flex items-center">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to History
          </Link>
        </Button>
      </div>
    </div>
  )
}
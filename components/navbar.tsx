"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Lock, Instagram, Facebook, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import Image from "next/image"

export default function Navbar({ hideHeader = false }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Gallery", path: "/gallery" },
    { name: "Events", path: "/events" },
    { name: "Services", path: "/services" },
    { name: "Join Us", path: "/join-us" },
    { name: "History", path: "/history" },
  ]

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <header
      className={`bg-stone-900 text-white sticky top-0 z-50 transition-transform duration-300 ${
        hideHeader ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2" aria-label="Home">
            <div className="relative h-10 w-32">
              <Image src="/images/scear-logo.png" alt="S.C.E.A.R. Logo" fill className="object-contain" priority />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`text-sm font-medium transition-colors hover:text-red-400 ${
                  pathname === link.path ? "text-red-500" : "text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Social Media Links */}
            <div className="flex items-center gap-3 ml-2">
              <a
                href="https://www.instagram.com/cohvlvc/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://www.facebook.com/rimska.kohorta/?locale=sk_SK"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="text-white/70 hover:text-white transition-colors" aria-label="WhatsApp">
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>

            <Button variant="ghost" className="text-white/60 hover:text-white" asChild>
              <Link href="/admin" aria-label="Admin">
                <Lock className="h-4 w-4" />
              </Link>
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white" onClick={toggleMenu} aria-label="Toggle menu">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-stone-800 py-4">
          <nav className="container mx-auto px-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`text-sm font-medium py-2 transition-colors hover:text-red-400 ${
                  pathname === link.path ? "text-red-500" : "text-white"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            {/* Social Media Links for Mobile */}
            <div className="flex items-center gap-4 py-2">
              <a
                href="https://www.instagram.com/cohvlvc/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Instagram className="h-4 w-4" /> Instagram
              </a>
              <a
                href="https://www.facebook.com/rimska.kohorta/?locale=sk_SK"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Facebook className="h-4 w-4" /> Facebook
              </a>
              <a
                href="#"
                className="text-white/70 hover:text-white transition-colors flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            </div>

            <Link
              href="/admin"
              className="text-sm font-medium py-2 transition-colors hover:text-red-400 text-white/60 flex items-center gap-1"
              onClick={() => setIsMenuOpen(false)}
            >
              <Lock className="h-4 w-4" /> Admin
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}

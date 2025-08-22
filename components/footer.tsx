import Link from "next/link"
import { Shield, Mail, Phone, MapPin, Facebook, Instagram, Youtube, Lock, Building, FileText } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-8 w-8 text-red-500" />
              <span className="font-bold text-xl">S.C.E.A.R.</span>
            </div>
            <p className="text-stone-400 mb-4">
              Rímska armáda a pomocné zbory - Historical reenactment group dedicated to the authentic reconstruction of
              Roman auxiliary forces.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-stone-400 hover:text-red-400">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-stone-400 hover:text-red-400">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-stone-400 hover:text-red-400">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-stone-400 hover:text-red-400">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-stone-400 hover:text-red-400">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-stone-400 hover:text-red-400">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/join-us" className="text-stone-400 hover:text-red-400">
                  Join Us
                </Link>
              </li>
              <li>
                <Link href="/history" className="text-stone-400 hover:text-red-400">
                  History
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-stone-400 hover:text-red-400">
                  Roman History
                </Link>
              </li>
              <li>
                <Link href="#" className="text-stone-400 hover:text-red-400">
                  Equipment Guide
                </Link>
              </li>
              <li>
                <Link href="#" className="text-stone-400 hover:text-red-400">
                  Training Schedule
                </Link>
              </li>
              <li>
                <Link href="#" className="text-stone-400 hover:text-red-400">
                  Member Resources
                </Link>
              </li>
              <li>
                <Link href="#" className="text-stone-400 hover:text-red-400">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Building className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <p className="text-stone-300 font-medium">Societas civilis exercitus auxiliorumque Romanorum</p>
                  <p className="text-stone-400">Historicko-vojenská skupina</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-red-500 mt-0.5" />
                <span className="text-stone-400">Hutnícka 17, 841 10 Bratislava</span>
              </li>
              <li className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <p className="text-stone-400">IČO: 42170907</p>
                  <p className="text-stone-400">DIČ: 2023738530</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-red-500 mt-0.5" />
                <span className="text-stone-400">info@scear-example.com</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-red-500 mt-0.5" />
                <span className="text-stone-400">+421 123 456 789</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-800 pt-6 mt-6 text-center text-stone-500 text-sm">
          <p>&copy; {new Date().getFullYear()} S.C.E.A.R. - Rímska armáda a pomocné zbory. All rights reserved.</p>
          <div className="mt-2">
            <Link
              href="/admin"
              className="inline-flex items-center text-stone-500 hover:text-red-400 transition-colors"
            >
              <Lock className="h-3 w-3 mr-1" /> Admin Access
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

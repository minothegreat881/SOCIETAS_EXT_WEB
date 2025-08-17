# S.C.E.A.R. Frontend - Komplexná Analýza

## Základné Informácie
- **Názov**: S.C.E.A.R. (Societas civilis exercitus auxiliorumque Romanorum)
- **Typ**: Next.js 15 website pre slovenský rekonštrukčný spolok rímskych pomocných zborov
- **Technológie**: Next.js 15, React 19, TypeScript 5, Tailwind CSS, Radix UI
- **Deployment**: Vercel (automatická synchronizácia s v0.dev)

## Štruktúra Projektu

### Root adresár
```
v0-s-c-e-a-r-website-design/
├── app/                    # Next.js 15 App Router
├── components/             # React komponenty
├── lib/                   # Utility funkcie a dáta
├── public/                # Statické súbory
├── styles/                # CSS štýly
├── types/                 # TypeScript definície
├── hooks/                 # Custom React hooks
├── package.json
├── next.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

### App Router Štruktúra (/app)

#### Hlavné súbory
- **`layout.tsx`**: Root layout s metadátami
- **`page.tsx`**: Domovská stránka
- **`ClientLayout.tsx`**: Client-side wrapper
- **`globals.css`**: Globálne štýly

#### Stránky
- **`/admin/`**: Administrátorský panel
  - `AdminLoginPage.tsx` - Login stránka (heslo: "roman-auxiliary")
  - `/dashboard/` - Admin dashboard s CRUD operáciami
- **`/events/`**: Správa eventov
  - `EventsClientPage.tsx` - Kalendár a mapa eventov
- **`/gallery/`**: Fotogaléria
  - `GalleryClientPage.tsx` - Masonry layout s lightboxom
- **`/history/`**: Historické články
  - `HistoryDetailPage.tsx` - Detaily článkov
  - `/auxiliary-forces/` - Pomocné zbory
  - `/xv-legia-apollinaris/` - XV. Légia Apollinaris
- **`/join-us/`**: Registrácia členov
- **`/services/`**: Služby spolku

## Komponenty (/components)

### UI Komponenty (/ui) - Shadcn/ui
50+ komponentov založených na Radix UI:
- `button.tsx`, `card.tsx`, `dialog.tsx`
- `calendar.tsx`, `carousel.tsx`, `chart.tsx`
- `form.tsx`, `input.tsx`, `select.tsx`
- `table.tsx`, `tabs.tsx`, `toast.tsx`
- A ďalšie...

### Admin Komponenty (/admin)
- **`admin-logo.tsx`**: Admin logo komponenta
- **`dashboard-overview.tsx`**: Prehľad štatistík
- **`events-manager.tsx`**: CRUD pre eventy
- **`gallery-manager.tsx`**: Správa obrázkov
- **`history-manager.tsx`**: Správa článkov
- **`media-library.tsx`**: Centralizovaná mediálna knižnica
- **`stats-card.tsx`**: Štatistické karty

### Funkcionálne Komponenty
- **`navbar.tsx`**: Hlavná navigácia s responsive menu
- **`footer.tsx`**: Päta stránky
- **`live-chat.tsx`**: Tawk.to chat integrácia
- **`modern-calendar.tsx`**: Interaktívny kalendár
- **`dynamic-event-map.tsx`**: Leaflet mapa s eventmi
- **`gallery-lightbox.tsx`**: Lightbox pre obrázky
- **`masonry-grid.tsx`**: Masonry layout pre galériu
- **`telegram-button.tsx`**: Telegram integrácia
- **`whatsapp-chat.tsx`**: WhatsApp integrácia

### Ikony (/icons)
Vlastné SVG ikony s rímskou tematikou:
- `craft-icon.tsx`, `performance-icon.tsx`
- `rome-icon.tsx`, `training-icon.tsx`
- `workshop-icon.tsx`

## Dátové Štruktúry (/lib)

### events-data.ts
```typescript
type Event = {
  id: number
  title: string
  description: string
  startDate: string
  endDate: string
  location: {
    name: string
    address: string
    coordinates: [number, number]
  }
  image: string
  category: "reenactment" | "training" | "exhibition" | "workshop" | "meeting"
  attendees: number
  recurring?: boolean
  icon?: ElementType
  visible?: boolean
}
```

**Funkcie:**
- `getVisibleEvents()`: Filtruje viditeľné eventy
- `generateCalendarEvents()`: Generuje kalendárové eventy
- `generateMapLocations()`: Vytvára mapové značky

### gallery-data.ts
```typescript
type GalleryImage = {
  id: number
  src: string
  alt: string
  location: string
  activity: string
  category: string
  featured?: boolean
  width?: number
  height?: number
}
```

### utils.ts
Utility funkcie pre Tailwind CSS a všeobecné použitie.

## Statické Súbory (/public)

### Obrázky
- **`/images/gallery/`**: 18 obrázkov z eventov a tréningov
  - Roman-themed: `colosseum-rome.jpeg`, `roman-legionaries.jpeg`
  - Event photos: `roman-battle-formation.png`, `roman-training.png`
- **`/images/`**: Ikony a logá
  - `scear-logo.png`: Hlavné logo
  - Ikony aktivít: `craft-icon.png`, `training-icon.png`

### Placeholder súbory
Rôzne placeholder obrázky pre development.

## Konfiguračné Súbory

### next.config.mjs
```javascript
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}
```

### tailwind.config.ts
- Shadcn/ui integrácia
- Custom animácie
- CSS custom properties pre témy
- Rímska farebná paleta (stone + červené akcenty)

### tsconfig.json
- Strict mode zapnutý
- Path aliases: `@/*`
- Modern ES6+ target

## Špecializované Funkcie

### Administrátorský Panel
**Autentifikácia:**
- Jednoduchá password-based autentifikácia
- Heslo: `"roman-auxiliary"` (hardcoded)
- localStorage session management

**Funkcionality:**
- Event CRUD operácie
- Gallery management
- History/článok management
- Dashboard analytics
- Media library

### Interaktívne Mapy
- **Leaflet** integrácia
- GPS súradnice eventov
- Custom značky podľa kategórie
- SSR-safe implementácia

### Kalendár System
- **date-fns** s slovenskou lokalizáciou
- Recurring events podpora
- Admin/user mód
- Event filtering

### Komunikačné Kanály
- **Tawk.to**: Live chat
- **WhatsApp**: Priama komunikácia
- **Telegram**: Alternatívny kanál
- **Social media**: Facebook, Instagram linky

## Bezpečnostné Aspekty

### 🚨 Identifikované Problémy
1. **Hardcoded heslo** v source kóde
2. **Client-side autentifikácia** bez backend validácie
3. **localStorage** pre citlivé dáta
4. **Disabled build checks** (ESLint, TypeScript)
5. **Chýbajúca HTTPS enforcement**
6. **Žiadna CSRF ochrana**
7. **Chýbajúci rate limiting**

### 💡 Odporúčania pre Produkciu
1. Backend API s JWT tokenmi
2. Environment variables pre citlivé údaje
3. Proper session management
4. Input validation a XSS ochrana
5. Security headers implementácia
6. Build-time security checks

## Závislosti (Dependencies)

### Core Framework
- **next**: 15.2.4 (App Router)
- **react**: ^19 (Latest features)
- **typescript**: ^5 (Type safety)

### UI & Styling
- **tailwindcss**: ^3.4.17
- **@radix-ui/***: 20+ komponentov
- **framer-motion**: Animácie
- **lucide-react**: Ikony

### Funkcionality
- **date-fns**: Dátumová manipulácia
- **leaflet + react-leaflet**: Mapy
- **react-hook-form**: Formuláre
- **zod**: Validácia
- **recharts**: Grafy pre admin

### Development
- **eslint**: Code quality
- **postcss**: CSS processing
- **sharp**: Image optimization

## Architektonické Silné Stránky

✅ **Moderný Stack**: Latest Next.js 15 s App Router  
✅ **Komponentová Architektúra**: Dobre organizované, znovupoužiteľné komponenty  
✅ **Type Safety**: Komplexná TypeScript implementácia  
✅ **Responsive Design**: Mobile-first prístup  
✅ **Interaktívne Funkcie**: Mapy, kalendáre, galérie  
✅ **Admin Panel**: Plná content management funkcionalita  
✅ **Lokalizácia**: Slovenčina s date-fns  

## Oblasti pre Zlepšenie

⚠️ **Security Hardening**: Proper autentifikácia a autorizácia  
⚠️ **Backend Integration**: Náhrada localStorage databázou  
⚠️ **Performance Optimization**: Production optimalizácie  
⚠️ **Error Handling**: Error boundaries a logging  
⚠️ **Testing**: Unit a integration testy  
⚠️ **SEO**: Meta tags a structured data  
⚠️ **Monitoring**: Analytics a error tracking  

## Celkové Zhodnotenie

Projekt predstavuje moderne navrhnutú Next.js aplikáciu s komplexným feature setom pre historický rekonštrukčný spolok. Kód demonštruje dobré React/Next.js praktiky s dôrazom na user experience a content management.

**Pre produkčné nasadenie** je potrebné významné zlepšenie bezpečnosti a infraštruktúry, ale základ je kvalitne postavený na moderných technológiách.

**Hodnotenie**: 7/10 (pre development), 4/10 (pre produkciu bez security úprav)
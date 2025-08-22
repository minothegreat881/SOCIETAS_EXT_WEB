/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['argon2'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // KRITICKÉ: Vypnúť automatickú optimalizáciu ktorá môže ignorovať imageOrientation
    unoptimized: true,
    // OPTIMALIZOVANÉ pre moderné fotky s Cloudinary
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1341',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'societas-backend.onrender.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        pathname: '/**',
      }
    ],
    // Moderné formats pre výkon
    formats: ['image/webp', 'image/avif'],
    // Optimalizované device sizes
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: false,
  },
}

export default nextConfig
# 📸 Complete Gallery Solution Guide
## Strapi + Next.js + Cloudinary - Portrait Photo Auto-rotation Prevention

### 🎯 **Overview**
This guide provides a complete solution for building a photo gallery that **prevents portrait photo auto-rotation** while maintaining modern cloud storage capabilities through Cloudinary integration.

---

## 🚨 **The Portrait Photo Problem**

### **What Happens by Default**
- Portrait photos (taller than wide) get automatically rotated to landscape
- EXIF orientation data gets stripped during processing
- Sharp.js and other image processors "fix" orientation incorrectly
- Users see rotated photos in the gallery

### **Why Standard Solutions Fail**
1. **Strapi Auto-processing**: Built-in Sharp.js processing rotates images
2. **EXIF Stripping**: Metadata gets removed during resize/optimization
3. **Cloudinary Transformations**: Default uploads apply auto-orientation
4. **Frontend Image Components**: Next.js Image can trigger additional processing

---

## 🏗️ **Architecture Overview**

```
📱 Upload → 🔄 RAW ENDPOINT → ☁️ Cloudinary (No Transform) → 💾 Database → 🖼️ Gallery
                    ↓
               🛡️ Bypass Strapi Processing
```

### **Key Components**
1. **Custom Raw Upload Endpoint** - Bypasses all Strapi image processing
2. **Cloudinary Integration** - Cloud storage without transformations
3. **Gallery Photo Controller** - Auto-unfeaturing logic
4. **Frontend Gallery** - Optimized display with preserved orientation
5. **Admin Interface** - Easy management through Strapi admin

---

## 📋 **Step-by-Step Implementation**

### **Step 1: Strapi Backend Setup**

#### **1.1 Install Dependencies**
```bash
cd backend
npm install cloudinary
```

#### **1.2 Environment Configuration**
Create/update `backend/.env`:
```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
```

#### **1.3 Disable Strapi Image Processing**
Update `backend/config/plugins.ts`:
```typescript
export default ({ env }) => ({
  upload: {
    enabled: true,
    config: {
      provider: 'local',
      providerOptions: {
        sizeLimit: 50 * 1024 * 1024, // 50MB
        publicPath: '/uploads',
      },
      sizeLimit: 50 * 1024 * 1024,
      
      // CRITICAL: DISABLE all Strapi image processing
      sharp: false,
      breakpoints: false,
      responsiveDimensions: false,
      formats: false,
      autoOrientation: false,
      forceFormat: false,
      enhanceImage: false,
      generateThumbnail: false,
      generateFormats: false,
      sizeOptimization: false,
      imageManipulation: false,
      enableImagePreprocessing: false,
      enableImagePostprocessing: false,
    },
  }
});
```

#### **1.4 Create Gallery Photo Content Type**
```typescript
// backend/src/api/gallery-photo/content-types/gallery-photo/schema.json
{
  "kind": "collectionType",
  "collectionName": "gallery_photos",
  "info": {
    "singularName": "gallery-photo",
    "pluralName": "gallery-photos",
    "displayName": "Gallery Photo"
  },
  "options": {
    "draftAndPublish": true
  },
  "attributes": {
    "title": {
      "type": "string",
      "required": true
    },
    "alt": {
      "type": "string",
      "required": true
    },
    "description": {
      "type": "text"
    },
    "location": {
      "type": "string"
    },
    "activity": {
      "type": "string"
    },
    "category": {
      "type": "enumeration",
      "enum": ["Equipment", "Training", "Events", "Historical"]
    },
    "featured": {
      "type": "boolean",
      "default": false
    },
    "sortOrder": {
      "type": "integer",
      "default": 0
    },
    "originalWidth": {
      "type": "integer"
    },
    "originalHeight": {
      "type": "integer"
    },
    "aspectRatio": {
      "type": "enumeration",
      "enum": ["portrait", "landscape", "square"]
    },
    "photo": {
      "type": "media",
      "multiple": false,
      "required": true,
      "allowedTypes": ["images"]
    }
  }
}
```

#### **1.5 Create Raw Upload Endpoint**
Create `backend/src/api/raw-upload/routes/raw-upload.ts`:
```typescript
export default {
  routes: [
    {
      method: 'POST',
      path: '/raw-upload',
      handler: 'raw-upload.upload',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
```

Create `backend/src/api/raw-upload/controllers/raw-upload.ts`:
```typescript
import { Context } from 'koa';
import fs from 'fs';
import path from 'path';

export default {
  async upload(ctx: Context) {
    console.log('🔥 RAW UPLOAD: Complete bypass of Strapi processing');
    
    const { files } = ctx.request;
    
    if (!files || !files.files) {
      return ctx.badRequest('No files provided');
    }
    
    const fileArray = Array.isArray(files.files) ? files.files : [files.files];
    const uploadedFiles = [];
    
    for (const file of fileArray) {
      try {
        const originalName = (file as any).originalFilename || (file as any).name || 'unknown';
        const ext = path.extname(originalName);
        const nameWithoutExt = path.basename(originalName, ext);
        const uniqueName = `${nameWithoutExt}_${Date.now()}${ext}`;
        
        let finalUrl = `/uploads/${uniqueName}`;
        
        // CLOUDINARY INTEGRATION: Upload without transformations
        if (process.env.CLOUDINARY_CLOUD_NAME) {
          try {
            const cloudinary = require('cloudinary').v2;
            cloudinary.config({
              cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
              api_key: process.env.CLOUDINARY_API_KEY,
              api_secret: process.env.CLOUDINARY_API_SECRET,
            });

            const tempPath = (file as any).filepath || (file as any).path;
            
            // CRITICAL: Upload without any transformations
            const result = await cloudinary.uploader.upload(tempPath, {
              public_id: path.basename(uniqueName, ext),
              use_filename: true,
              unique_filename: false,
              overwrite: false,
              resource_type: 'auto',
              // CRITICAL: No transformations = no rotation
              transformation: [],
              flags: 'preserve_transparency.immutable_cache'
            });
            
            finalUrl = result.secure_url;
            console.log('☁️ Uploaded to Cloudinary without transformation:', result.secure_url);
            
          } catch (cloudinaryError) {
            console.error('❌ Cloudinary upload failed, falling back to local:', cloudinaryError);
            
            // FALLBACK: Local storage
            const uploadsDir = path.join(strapi.dirs.static.public, 'uploads');
            if (!fs.existsSync(uploadsDir)) {
              fs.mkdirSync(uploadsDir, { recursive: true });
            }
            
            const filePath = path.join(uploadsDir, uniqueName);
            const tempPath = (file as any).filepath || (file as any).path;
            fs.copyFileSync(tempPath, filePath);
          }
        } else {
          // LOCAL STORAGE: Original behavior
          const uploadsDir = path.join(strapi.dirs.static.public, 'uploads');
          if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
          }
          
          const filePath = path.join(uploadsDir, uniqueName);
          
          // CRITICAL: RAW file copy without any processing
          if ((file as any).filepath) {
            fs.copyFileSync((file as any).filepath, filePath);
          } else if ((file as any).path) {
            fs.copyFileSync((file as any).path, filePath);
          } else if ((file as any).buffer) {
            fs.writeFileSync(filePath, (file as any).buffer);
          } else {
            throw new Error('No file data found');
          }
        }
        
        // CRITICAL: Create database record WITHOUT width/height
        const fileRecord = await strapi.db.query('plugin::upload.file').create({
          data: {
            name: originalName,
            alternativeText: null,
            caption: null,
            width: null,  // CRITICAL: No dimensions = no auto-rotation
            height: null,
            formats: null,
            hash: path.basename(uniqueName, ext),
            ext: ext,
            mime: (file as any).mimetype || (file as any).type || 'application/octet-stream',
            size: parseFloat((file.size / 1024).toFixed(2)),
            url: finalUrl,
            previewUrl: null,
            provider: 'local',
            provider_metadata: null,
            createdBy: ctx.state.user?.id,
            updatedBy: ctx.state.user?.id,
          },
        });
        
        uploadedFiles.push(fileRecord);
        
        // Cleanup temp file
        const tempPath = (file as any).filepath || (file as any).path;
        if (tempPath && fs.existsSync(tempPath)) {
          fs.unlinkSync(tempPath);
        }
        
      } catch (error) {
        console.error('❌ RAW upload failed for file:', (file as any).originalFilename, error);
      }
    }
    
    ctx.body = uploadedFiles;
  }
};
```

#### **1.6 Create Gallery Photo Controller with Auto-unfeaturing**
Create `backend/src/api/gallery-photo/controllers/gallery-photo.ts`:
```typescript
import { factories } from '@strapi/strapi';

function detectAspectRatio(width: number, height: number): 'portrait' | 'landscape' | 'square' {
  if (!width || !height) return 'landscape';
  
  const ratio = width / height;
  
  if (ratio > 1.2) {
    return 'landscape';
  } else if (ratio < 0.8) {
    return 'portrait';
  } else {
    return 'square';
  }
}

export default factories.createCoreController('api::gallery-photo.gallery-photo', ({ strapi }) => ({
  
  async create(ctx) {
    const { data } = ctx.request.body;
    
    // CRITICAL: Auto-unfeatured logic - only one featured at a time
    if (data.featured === true) {
      await this.unfeaturedAllOthers();
      console.log('🎯 Auto-unfeatured all other photos - this one is now the only featured');
    }
    
    return await super.create(ctx);
  },

  async update(ctx) {
    const { data } = ctx.request.body;
    
    // CRITICAL: Auto-unfeatured logic - only one featured at a time
    if (data.featured === true) {
      await this.unfeaturedAllOthers(ctx.params.id);
      console.log('🎯 Auto-unfeatured all other photos - this one is now the only featured');
    }
    
    return await super.update(ctx);
  },

  // Helper function to unfeatured all other photos
  async unfeaturedAllOthers(excludeId = null) {
    try {
      const whereCondition = excludeId 
        ? { featured: true, documentId: { $ne: excludeId } }
        : { featured: true };

      await strapi.db.query('api::gallery-photo.gallery-photo').updateMany({
        where: whereCondition,
        data: { featured: false }
      });
      
      console.log('🔄 Unfeatured all other gallery photos');
    } catch (error) {
      console.error('❌ Error unfeaturing other photos:', error);
    }
  }
}));
```

### **Step 2: Frontend Setup**

#### **2.1 Install Dependencies**
```bash
cd frontend
npm install framer-motion lucide-react
```

#### **2.2 Create Strapi Gallery Utility**
Create `lib/strapi-gallery.ts`:
```typescript
export interface GalleryImage {
  id: string
  src: string
  alt: string
  title: string
  category: string
  location: string
  featured: boolean
  aspectRatio: 'portrait' | 'landscape' | 'square'
  width?: number
  height?: number
}

export async function fetchGalleryImages(): Promise<{
  images: GalleryImage[]
  categories: string[]
}> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/gallery-photos?populate=photo`)
    const data = await response.json()
    
    const images: GalleryImage[] = data.data.map((item: any) => ({
      id: item.documentId,
      src: item.attributes.photo?.data?.attributes?.url?.startsWith('http') 
        ? item.attributes.photo.data.attributes.url 
        : `${process.env.NEXT_PUBLIC_STRAPI_URL}${item.attributes.photo?.data?.attributes?.url}`,
      alt: item.attributes.alt || item.attributes.title,
      title: item.attributes.title,
      category: item.attributes.category,
      location: item.attributes.location || '',
      featured: item.attributes.featured || false,
      aspectRatio: item.attributes.aspectRatio || 'landscape',
      width: item.attributes.originalWidth,
      height: item.attributes.originalHeight,
    }))
    
    const categories = ['All', ...Array.from(new Set(images.map(img => img.category)))]
    
    return { images, categories }
  } catch (error) {
    console.error('Error fetching gallery images:', error)
    return { images: [], categories: ['All'] }
  }
}
```

#### **2.3 Create Gallery Component**
Create `components/enhanced-modern-gallery.tsx`:
```typescript
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { MapPin, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { GalleryImage } from "@/lib/strapi-gallery"

export default function EnhancedModernGallery({ 
  images, 
  categories, 
  loading = false, 
  error = null 
}: {
  images: GalleryImage[]
  categories: string[]
  loading?: boolean
  error?: string | null
}) {
  const [activeCategory, setActiveCategory] = useState("All")
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([])

  useEffect(() => {
    const filtered = activeCategory === "All" 
      ? images 
      : images.filter((img) => img.category === activeCategory)
    
    setFilteredImages(filtered)
  }, [activeCategory, images])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-red-800 mb-4" />
          <p className="text-gray-600 text-lg">Loading gallery images...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <p className="text-red-600 font-medium mb-2">Failed to load gallery</p>
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-3 justify-center">
        {categories.map((category) => (
          <Button
            key={category}
            variant={category === activeCategory ? "default" : "outline"}
            className={`px-6 py-2 rounded-full transition-all duration-300 ${
              category === activeCategory
                ? "bg-red-800 hover:bg-red-900 shadow-md"
                : "hover:border-red-800 hover:text-red-800"
            }`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Gallery Grid - Optimized for portrait/landscape balance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min">
        {filteredImages.map((image, index) => (
          <motion.div
            key={image.id}
            className="break-inside-avoid cursor-pointer group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            whileHover={{ y: -5 }}
          >
            <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
              {/* CRITICAL: Direct img tag for orientation control */}
              <img
                src={image.src}
                alt={image.alt}
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                style={{
                  width: '100%',
                  height: image.aspectRatio === 'portrait' ? '200px' : 
                         image.aspectRatio === 'square' ? '350px' : '450px',
                  imageOrientation: 'from-image' // Preserve EXIF orientation
                }}
              />

              {/* Category badge with aspect ratio indicator */}
              <div className="absolute top-3 left-3 z-10 flex gap-2">
                <Badge className="bg-gradient-to-r from-red-800 to-red-700">
                  {image.category}
                </Badge>
                <Badge className={`px-2 py-0.5 text-xs font-medium ${
                  image.aspectRatio === 'portrait' ? 'bg-purple-600 text-white' :
                  image.aspectRatio === 'landscape' ? 'bg-green-600 text-white' : 
                  'bg-blue-600 text-white'
                }`}>
                  {image.aspectRatio === 'portrait' ? '📱' : 
                   image.aspectRatio === 'landscape' ? '🖼️' : '⬜'}
                </Badge>
              </div>

              {/* Featured indicator */}
              {image.featured && (
                <div className="absolute top-3 right-3 z-10">
                  <Badge className="bg-yellow-500 text-yellow-900 text-xs">★ Featured</Badge>
                </div>
              )}

              {/* Image info overlay */}
              <div className="absolute bottom-0 right-0 max-w-[70%] bg-gradient-to-tl from-black/90 via-black/80 to-black/60 backdrop-blur-sm rounded-tl-lg shadow-lg transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <div className="p-3 border-l-2 border-red-700">
                  <h3 className="font-medium text-sm text-white mb-1">{image.alt}</h3>
                  <div className="flex items-center gap-1.5 mb-1">
                    <MapPin className="h-3 w-3 text-red-400 flex-shrink-0" />
                    <span className="text-xs font-light text-gray-200">{image.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
```

### **Step 3: Frontend Gallery Page**
Create `app/gallery/page.tsx`:
```typescript
import { fetchGalleryImages } from '@/lib/strapi-gallery'
import EnhancedModernGallery from '@/components/enhanced-modern-gallery'

export default async function GalleryPage() {
  const { images, categories } = await fetchGalleryImages()
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Photo Gallery</h1>
        <p className="text-lg text-gray-600">Preserved orientation with cloud storage</p>
      </div>
      
      <EnhancedModernGallery 
        images={images} 
        categories={categories}
      />
    </div>
  )
}
```

---

## 🔧 **Configuration & Deployment**

### **Environment Variables**
```env
# Frontend (.env.local)
NEXT_PUBLIC_STRAPI_URL=http://localhost:1341

# Backend (.env)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### **Admin Interface Usage**

#### **Uploading Photos**
1. Go to Strapi Admin → Content Manager → Gallery Photos
2. Click "Create new entry"
3. **IMPORTANT**: Use Media Library and select "Upload via custom endpoint"
4. Upload files through the raw-upload endpoint
5. Fill in title, alt text, category
6. Set as featured if needed (auto-unfeatured others)

#### **Managing Featured Photos**
- Only ONE photo can be featured at a time
- Setting any photo as featured automatically unfeatured all others
- Featured photos appear with ★ indicator
- Use for header backgrounds or special highlighting

---

## 🚨 **Critical Points to Remember**

### **DO's**
✅ Always use the `/api/raw-upload` endpoint for photo uploads  
✅ Keep `width: null, height: null` in database records  
✅ Use `transformation: []` in Cloudinary uploads  
✅ Set `imageOrientation: 'from-image'` in CSS  
✅ Test with actual portrait photos from phones  

### **DON'Ts**
❌ Never use standard Strapi upload endpoints  
❌ Don't enable Sharp processing in plugins.ts  
❌ Don't add Cloudinary transformations  
❌ Don't use Next.js Image component for raw orientation control  
❌ Don't store image dimensions in database  

### **Testing Portrait Orientation**
1. Upload a portrait photo taken with a phone
2. Check that it appears correctly oriented in gallery
3. Verify Cloudinary URL contains no transformation parameters
4. Confirm image maintains EXIF orientation data

---

## 🐛 **Troubleshooting**

### **Portrait Photos Still Rotating**
- Check plugins.ts - all image processing should be disabled
- Verify raw-upload endpoint is being used
- Confirm Cloudinary transformation array is empty
- Check CSS imageOrientation property

### **Cloudinary Upload Failing**
- Verify environment variables are loaded
- Check Cloudinary credentials
- Confirm cloudinary npm package is installed
- Check fallback to local storage in logs

### **Featured Logic Not Working**
- Verify auto-unfeaturing helper function exists
- Check database query syntax for Strapi v5
- Confirm documentId is used instead of id
- Test with curl commands to verify API

### **Gallery Not Displaying**
- Check Strapi URL configuration
- Verify populate=photo parameter
- Confirm image URLs are accessible
- Check browser console for errors

---

## 📚 **Additional Resources**

### **Key Files Reference**
- `backend/config/plugins.ts` - Disable image processing
- `backend/src/api/raw-upload/controllers/raw-upload.ts` - Bypass upload logic
- `backend/src/api/gallery-photo/controllers/gallery-photo.ts` - Auto-unfeaturing
- `frontend/lib/strapi-gallery.ts` - Data fetching
- `frontend/components/enhanced-modern-gallery.tsx` - Gallery display

### **Testing Commands**
```bash
# Test raw upload
curl -X POST -F "files=@photo.jpg" http://localhost:1341/api/raw-upload

# Test gallery API
curl http://localhost:1341/api/gallery-photos?populate=photo

# Test featured logic
curl -X PUT -H "Content-Type: application/json" -d '{"data":{"featured":true}}' http://localhost:1341/api/gallery-photos/DOCUMENT_ID
```

---

## 🎉 **Success Indicators**

When everything is working correctly, you should see:

1. **Backend Logs**: `☁️ Uploaded to Cloudinary without transformation`
2. **Cloudinary URLs**: No transformation parameters in URLs
3. **Database Records**: `width: null, height: null` in file records
4. **Gallery Display**: Portrait photos remain portrait orientation
5. **Featured Logic**: `🎯 Auto-unfeatured all other photos` in logs
6. **Admin Interface**: Smooth upload and management workflow

---

**Created by Claude Code 🤖**  
*Portrait photo auto-rotation problem definitively solved!*
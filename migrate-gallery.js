// Migration script to upload existing gallery images to Strapi with Cloudinary
// Enhanced for vertical/horizontal image support with aspect ratio preservation

const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const fetch = require('node-fetch'); // Note: You'll need to install this

const STRAPI_URL = 'http://localhost:1341';
const FRONTEND_PATH = 'C:\\Users\\milan\\Desktop\\Git-Projects\\SOCIETAS_EXT_WEB\\v0-s-c-e-a-r-website-design';

// Gallery data with metadata (from gallery-data.ts)
const galleryData = [
  {
    id: 1,
    src: "/images/gallery/roman-legionaries.jpeg",
    alt: "Roman Legion Battle Formation",
    location: "Carnuntum, Austria",
    activity: "Historical reenactment of Roman battle tactics",
    category: "Reenactments",
    featured: true,
  },
  {
    id: 2,
    src: "/images/gallery/roman-shield-spears.jpeg",
    alt: "Roman Auxiliary Armor",
    location: "Bratislava Museum",
    activity: "Exhibition of authentic Roman auxiliary equipment",
    category: "Equipment",
  },
  {
    id: 3,
    src: "/images/gallery/roman-training.png",
    alt: "Combat Training Session",
    location: "Devín Castle",
    activity: "Weekly combat training with shields and swords",
    category: "Training",
    featured: true,
  },
  {
    id: 4,
    src: "/images/gallery/roman-festival.png",
    alt: "Roman Festival Performance",
    location: "Xanten Archaeological Park, Germany",
    activity: "Annual Roman festival demonstration",
    category: "Festivals",
  },
  {
    id: 5,
    src: "/images/gallery/roman-marching.png",
    alt: "Legion Marching Formation",
    location: "Via Appia, Italy",
    activity: "Demonstration of Roman marching techniques",
    category: "Reenactments",
  },
  {
    id: 6,
    src: "/images/gallery/roman-camp.png",
    alt: "Roman Military Camp",
    location: "Aquincum, Hungary",
    activity: "Living history camp with authentic tents and equipment",
    category: "Camps",
    featured: true,
  },
  {
    id: 7,
    src: "/images/gallery/roman-weapons.png",
    alt: "Roman Weapons Collection",
    location: "S.C.E.A.R. Headquarters",
    activity: "Display of replica Roman weapons",
    category: "Equipment",
  },
  {
    id: 8,
    src: "/images/gallery/roman-cavalry.png",
    alt: "Roman Cavalry Demonstration",
    location: "Carnuntum Festival",
    activity: "Cavalry tactics and horsemanship display",
    category: "Reenactments",
    featured: true,
  },
  {
    id: 9,
    src: "/images/gallery/roman-archery.png",
    alt: "Roman Archery Practice",
    location: "Training Grounds, Bratislava",
    activity: "Weekly archery training session",
    category: "Training",
  },
  {
    id: 10,
    src: "/images/gallery/roman-feast.png",
    alt: "Roman Feast Celebration",
    location: "Annual Gathering, Vienna",
    activity: "Authentic Roman feast with traditional food",
    category: "Festivals",
  },
  {
    id: 11,
    src: "/images/gallery/roman-crafts.png",
    alt: "Roman Craftsmanship Workshop",
    location: "S.C.E.A.R. Workshop",
    activity: "Creating authentic Roman equipment and clothing",
    category: "Equipment",
  },
  {
    id: 12,
    src: "/images/gallery/roman-night-camp.png",
    alt: "Night Camp",
    location: "Summer Festival, Prague",
    activity: "Evening camp life demonstration",
    category: "Camps",
  },
  {
    id: 13,
    src: "/images/gallery/roman-formation.png",
    alt: "Shield Formation",
    location: "Historical Festival, Budapest",
    activity: "Testudo formation demonstration",
    category: "Reenactments",
    featured: true,
  },
  {
    id: 14,
    src: "/images/gallery/roman-standards.png",
    alt: "Legion Standards",
    location: "Museum Exhibition",
    activity: "Display of replica Roman military standards",
    category: "Equipment",
  },
  {
    id: 15,
    src: "/images/gallery/roman-children.png",
    alt: "Children's Workshop",
    location: "Educational Center, Bratislava",
    activity: "Teaching children about Roman history",
    category: "Training",
  },
  {
    id: 16,
    src: "/images/gallery/roman-armor-display.png",
    alt: "Roman Shield with Eagle Design",
    location: "Historical Museum, Rome",
    activity: "Display of authentic Roman scutum and pilum weapons",
    category: "Equipment",
    featured: true,
  },
  {
    id: 17,
    src: "/images/gallery/colosseum-rome.jpeg",
    alt: "The Colosseum",
    location: "Rome, Italy",
    activity: "Historical site where gladiatorial contests and public spectacles were held",
    category: "Reenactments",
  },
  {
    id: 18,
    src: "/images/gallery/roman-battle-formation.png",
    alt: "Roman Legionaries in Formation",
    location: "Historical Festival, Germany",
    activity: "Reenactors demonstrating Roman military formations and equipment",
    category: "Reenactments",
    featured: true,
  }
];

// Helper function to detect aspect ratio
function detectAspectRatio(width, height) {
  const ratio = width / height;
  if (ratio > 1.2) return 'landscape';
  else if (ratio < 0.8) return 'portrait';
  else return 'square';
}

// Get image dimensions using a simple method
function getImageDimensions(filePath) {
  // For now, return default dimensions - in real implementation you'd use image-size library
  // This is a placeholder - actual dimensions would be detected from the image file
  return { width: 1200, height: 800 }; // Default landscape
}

async function uploadSingleImage(imageData, index) {
  try {
    const fileName = path.basename(imageData.src);
    const filePath = path.join(FRONTEND_PATH, 'public', imageData.src.replace(/^\//, ''));
    
    console.log(`📤 Uploading ${index + 1}/18: ${fileName}`);
    
    if (!fs.existsSync(filePath)) {
      console.log(`❌ File not found: ${filePath}`);
      return false;
    }

    // Get image dimensions
    const dimensions = getImageDimensions(filePath);
    const aspectRatio = detectAspectRatio(dimensions.width, dimensions.height);
    
    // Step 1: Upload file to Strapi/Cloudinary
    const formData = new FormData();
    formData.append('files', fs.createReadStream(filePath));
    
    const uploadResponse = await fetch(`${STRAPI_URL}/api/upload`, {
      method: 'POST',
      body: formData,
    });
    
    if (!uploadResponse.ok) {
      console.log(`❌ Upload failed for ${fileName}: ${uploadResponse.status} ${uploadResponse.statusText}`);
      return false;
    }
    
    const uploadResult = await uploadResponse.json();
    const uploadedFile = uploadResult[0];
    
    console.log(`✅ File uploaded to Cloudinary: ${uploadedFile.url}`);
    
    // Step 2: Create gallery-image entry
    const galleryEntry = {
      data: {
        title: imageData.alt,
        alt: imageData.alt,
        location: imageData.location,
        activity: imageData.activity,
        category: imageData.category,
        featured: imageData.featured || false,
        image: uploadedFile.id,
        aspectRatio: aspectRatio,
        originalWidth: uploadedFile.width || dimensions.width,
        originalHeight: uploadedFile.height || dimensions.height,
        visible: true,
        sortOrder: index + 1
      }
    };
    
    const createResponse = await fetch(`${STRAPI_URL}/api/gallery-images`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(galleryEntry),
    });
    
    if (!createResponse.ok) {
      console.log(`❌ Gallery entry creation failed for ${fileName}: ${createResponse.status} ${createResponse.statusText}`);
      return false;
    }
    
    const result = await createResponse.json();
    console.log(`✅ Gallery entry created: ID ${result.data.id} - ${imageData.alt} (${aspectRatio})`);
    
    return true;
    
  } catch (error) {
    console.error(`❌ Error processing ${imageData.alt}:`, error.message);
    return false;
  }
}

async function migrateGallery() {
  console.log('🚀 Starting gallery migration to Strapi + Cloudinary');
  console.log('⚠️  Enhanced for vertical/horizontal image support');
  console.log('');
  
  // Test Strapi connection
  try {
    const testResponse = await fetch(`${STRAPI_URL}/api/gallery-images`);
    if (!testResponse.ok) {
      console.log('❌ Cannot connect to Strapi API. Make sure backend is running on port 1341');
      return;
    }
    console.log('✅ Strapi API connection successful');
  } catch (error) {
    console.log('❌ Strapi connection failed:', error.message);
    return;
  }
  
  console.log('');
  let successCount = 0;
  let failCount = 0;
  
  // Process each image
  for (let i = 0; i < galleryData.length; i++) {
    const success = await uploadSingleImage(galleryData[i], i);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
    
    // Small delay between uploads
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('');
  console.log('📊 Migration Complete!');
  console.log(`✅ Successful uploads: ${successCount}`);
  console.log(`❌ Failed uploads: ${failCount}`);
  console.log(`📁 Total processed: ${galleryData.length}`);
  
  if (successCount > 0) {
    console.log('');
    console.log('🎉 Gallery images are now available in:');
    console.log('   • Strapi admin: http://localhost:1341/admin');
    console.log('   • Frontend gallery: http://localhost:3002/gallery');
    console.log('   • Admin panel: http://localhost:3002/admin/dashboard');
  }
}

// Run migration
migrateGallery().catch(console.error);
// Script na konfiguráciu Strapi permissions pre Gallery API

const fetch = require('node-fetch');

const STRAPI_URL = 'http://localhost:1341';

async function configurePermissions() {
  try {
    // Test if gallery-images endpoint exists
    console.log('Testing gallery-images endpoint...');
    
    const testResponse = await fetch(`${STRAPI_URL}/api/gallery-images`);
    console.log(`Gallery API Status: ${testResponse.status} ${testResponse.statusText}`);
    
    if (testResponse.status === 403) {
      console.log('❌ 403 Forbidden - Permissions need to be configured manually in Strapi admin panel');
      console.log('');
      console.log('🔧 MANUAL SETUP REQUIRED:');
      console.log('1. Open: http://localhost:1341/admin');
      console.log('2. Login with your admin credentials');
      console.log('3. Go to: Settings → Users & Permissions → Roles → Public');
      console.log('4. Enable permissions for:');
      console.log('   ✅ Gallery-image: find, findOne, create, update, delete');
      console.log('   ✅ Upload: upload');
      console.log('5. Save changes');
    } else if (testResponse.status === 200) {
      console.log('✅ Gallery API is working correctly!');
      const data = await testResponse.json();
      console.log(`Found ${data.data?.length || 0} gallery images`);
    } else {
      console.log(`❓ Unexpected status: ${testResponse.status}`);
    }
    
  } catch (error) {
    console.error('Error testing permissions:', error.message);
  }
}

configurePermissions();
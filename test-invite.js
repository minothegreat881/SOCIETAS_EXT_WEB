const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function simulateInviteCreation() {
  try {
    console.log('🔍 Testing invitation creation...')
    
    // Find SUPERADMIN
    const superAdmin = await prisma.user.findFirst({
      where: { role: 'SUPERADMIN', active: true },
    })
    
    if (!superAdmin) {
      console.log('❌ No SUPERADMIN found!')
      return
    }
    
    console.log('✅ Found SUPERADMIN:', superAdmin.email)
    
    // Check existing user
    const testEmail = 'test.member@example.com'
    const existingUser = await prisma.user.findUnique({
      where: { email: testEmail },
    })
    
    if (existingUser) {
      console.log('ℹ️ User already exists:', testEmail)
      return
    }
    
    // Check existing invite
    const existingInvite = await prisma.userInvite.findFirst({
      where: {
        email: testEmail,
        consumed: false,
        expiresAt: {
          gt: new Date(),
        },
      },
    })
    
    if (existingInvite) {
      console.log('ℹ️ Active invite already exists for:', testEmail)
      return
    }
    
    console.log('💡 Should create invite for:', testEmail)
    console.log('📅 Expiration would be:', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

simulateInviteCreation()
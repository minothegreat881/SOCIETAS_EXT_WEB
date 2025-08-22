const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkDatabase() {
  try {
    console.log('🔍 Checking database state...')
    
    // Check users
    const users = await prisma.user.findMany()
    console.log('👥 Users:', users.length)
    users.forEach(user => {
      console.log(`   - ${user.email} (${user.role}) - Active: ${user.active}`)
    })
    
    // Check invites
    const invites = await prisma.userInvite.findMany()
    console.log('📧 User Invites:', invites.length)
    invites.forEach(invite => {
      console.log(`   - ${invite.email} (${invite.role}) - Expires: ${invite.expiresAt} - Consumed: ${invite.consumed}`)
    })
    
    // Check OTP codes
    const otps = await prisma.emailOtp.findMany()
    console.log('🔑 Email OTPs:', otps.length)
    
  } catch (error) {
    console.error('❌ Database error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkDatabase()
const { PrismaClient } = require('@prisma/client')
const { hash } = require('argon2')

const prisma = new PrismaClient()

async function resetAdminPassword() {
  try {
    console.log('🔐 Resetujem heslo pre SUPERADMIN...')
    
    const newPassword = 'admin123'
    const passwordHash = await hash(newPassword, {
      type: 2, // Argon2id
      memoryCost: 2 ** 16, // 64 MB
      timeCost: 3,
      parallelism: 1,
    })
    
    const updatedUser = await prisma.user.update({
      where: { email: 'milanhrabkovsky@gmail.com' },
      data: { 
        passwordHash,
        failedLogins: 0,
        lastFailedAt: null
      }
    })
    
    console.log('✅ Heslo resetované!')
    console.log('📧 Email: milanhrabkovsky@gmail.com')
    console.log('🔑 Nové heslo: admin123')
    console.log('')
    console.log('Môžeš sa teraz prihlásiť na: http://localhost:3010/auth/login')
    
  } catch (error) {
    console.error('❌ Chyba pri resetovaní hesla:', error)
  } finally {
    await prisma.$disconnect()
  }
}

resetAdminPassword()
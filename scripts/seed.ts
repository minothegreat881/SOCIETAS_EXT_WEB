import { PrismaClient } from '@prisma/client'
import { CryptoUtils } from '../lib/crypto'

const prisma = new PrismaClient()

async function main() {
  console.log('🛡️ Seeding SCEAR databázy...')

  // Vytvor prvého SUPERADMIN používateľa pre SCEAR
  const superAdminEmail = 'admin@scear.sk'
  const superAdminPassword = 'SCEARAdmin2024!'

  // Skontroluj či už existuje
  const existingAdmin = await prisma.user.findUnique({
    where: { email: superAdminEmail }
  })

  if (existingAdmin) {
    console.log('✅ SCEAR SUPERADMIN používateľ už existuje:', superAdminEmail)
  } else {
    const hashedPassword = await CryptoUtils.hashPassword(superAdminPassword)
    
    const superAdmin = await prisma.user.create({
      data: {
        email: superAdminEmail,
        passwordHash: hashedPassword,
        role: 'SUPERADMIN',
        active: true,
      }
    })

    console.log('✅ Vytvorený SCEAR SUPERADMIN používateľ:')
    console.log('   E-mail:', superAdminEmail)
    console.log('   Heslo:', superAdminPassword)
    console.log('   ID:', superAdmin.id)
  }

  // Vytvor testovacích používateľov pre SCEAR
  const testUsers = [
    { email: 'editor@scear.sk', role: 'EDITOR', password: 'SCEAREditor2024!' },
    { email: 'moderator@scear.sk', role: 'ADMIN', password: 'SCEARModerator2024!' },
    { email: 'user@scear.sk', role: 'USER', password: 'SCEARUser2024!' },
  ]

  for (const userData of testUsers) {
    const existing = await prisma.user.findUnique({
      where: { email: userData.email }
    })

    if (!existing) {
      const hashedPassword = await CryptoUtils.hashPassword(userData.password)
      
      const user = await prisma.user.create({
        data: {
          email: userData.email,
          passwordHash: hashedPassword,
          role: userData.role as any,
          active: true,
        }
      })

      console.log(`✅ Vytvorený SCEAR ${userData.role} používateľ:`, userData.email)
    } else {
      console.log(`⚠️  SCEAR ${userData.role} používateľ už existuje:`, userData.email)
    }
  }

  console.log('\n🎉 SCEAR seeding dokončený!')
  console.log('\n📋 SCEAR testovacie účty:')
  console.log('   SUPERADMIN: admin@scear.sk / SCEARAdmin2024!')
  console.log('   ADMIN:      moderator@scear.sk / SCEARModerator2024!')
  console.log('   EDITOR:     editor@scear.sk / SCEAREditor2024!')
  console.log('   USER:       user@scear.sk / SCEARUser2024!')
  console.log('\n⚔️ Societas Classis Et Auxilia Romana - Admin systém pripravený!')
}

main()
  .catch((e) => {
    console.error('❌ Chyba pri SCEAR seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
const nodemailer = require('nodemailer')

// Testovanie Gmail SMTP pripojenia a odosielania emailu
async function testEmail() {
  console.log('🧪 Testujem Gmail SMTP pripojenie...')

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'milanhrabkovsky@gmail.com',
      pass: 'sbyg vinq trae rvjy'
    }
  })

  try {
    // Test pripojenia
    console.log('🔗 Overujem pripojenie...')
    await transporter.verify()
    console.log('✅ SMTP pripojenie úspešné!')

    // Odoslanie testovacieho emailu
    console.log('📧 Odosiela sa test email...')
    const info = await transporter.sendMail({
      from: 'SCEAR Admin System <milanhrabkovsky@gmail.com>',
      to: 'milanhrabkovsky@gmail.com',
      subject: '🔐 Test OTP kód - SCEAR Admin',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Test OTP Kód</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { padding: 30px; background: #f8f9fa; border-radius: 0 0 8px 8px; }
              .code { font-size: 32px; font-weight: bold; text-align: center; 
                     background: white; padding: 20px; margin: 20px 0; 
                     border: 2px solid #dc2626; border-radius: 8px; letter-spacing: 4px; }
              .warning { background: #fff3cd; border: 1px solid #ffeaa7; 
                        padding: 15px; border-radius: 5px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>⚔️ SCEAR Admin System</h1>
                <p>Overovací kód pre prihlásenie</p>
              </div>
              <div class="content">
                <p>Dobrý deň,</p>
                <p>Toto je testovací email s OTP kódom:</p>
                
                <div class="code">123456</div>
                
                <div class="warning">
                  <strong>🎉 Test úspešný!</strong>
                  <ul>
                    <li>Gmail SMTP funguje správne</li>
                    <li>Emails sa odosielajú na produkciu</li>
                    <li>Dvojfaktorová autentifikácia je pripravená</li>
                  </ul>
                </div>
                
                <p><strong>Societas Classis Et Auxilia Romana</strong></p>
              </div>
            </div>
          </body>
        </html>
      `
    })

    console.log('✅ Email úspešne odoslaný!')
    console.log('📧 Message ID:', info.messageId)
    console.log('🎉 Gmail SMTP test ÚSPEŠNÝ!')
    console.log('')
    console.log('📋 Zhrnutie:')
    console.log('   ✅ SMTP pripojenie funguje')
    console.log('   ✅ Autentifikácia úspešná') 
    console.log('   ✅ Email odoslaný')
    console.log('   ✅ Systém pripravený na produkciu')

  } catch (error) {
    console.error('❌ Chyba pri teste:', error.message)
  }
}

testEmail()
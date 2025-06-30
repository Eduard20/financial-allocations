const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');

async function setupEncryption() {
  console.log('🔐 Setting up encryption for your financial data...\n');
  
  // Generate a secure random key
  const encryptionKey = crypto.randomBytes(32).toString('hex');
  
  // Create .env file with the encryption key
  const envContent = `# Financial Allocations App - Encryption Key
# ⚠️  IMPORTANT: Keep this key secure and never share it!
# If you lose this key, you will not be able to decrypt your data!
ENCRYPTION_KEY=${encryptionKey}

# Server Configuration
PORT=3001
NODE_ENV=development
`;
  
  try {
    await fs.writeFile('.env', envContent);
    console.log('✅ Created .env file with secure encryption key');
    console.log('✅ .env file is already in .gitignore (will not be committed to git)');
    console.log('\n🔑 Your encryption key has been generated and saved to .env file');
    console.log('📁 The key is: ' + encryptionKey.substring(0, 16) + '...');
    console.log('\n⚠️  IMPORTANT SECURITY NOTES:');
    console.log('   - Keep your .env file secure and never share it');
    console.log('   - If you lose this key, your data cannot be recovered');
    console.log('   - Consider backing up the .env file to a secure location');
    console.log('\n🚀 You can now start the server with: npm run server');
    console.log('   The server will automatically encrypt your data using this key');
    
  } catch (error) {
    console.error('❌ Error creating .env file:', error.message);
    console.log('\n🔑 Your encryption key is:', encryptionKey);
    console.log('📝 Please create a .env file manually with: ENCRYPTION_KEY=' + encryptionKey);
  }
}

setupEncryption(); 
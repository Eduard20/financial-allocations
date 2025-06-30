# 🔐 Data Encryption Setup

Your financial allocation tracking app now includes **AES-256-CBC encryption** to protect your sensitive financial data.

## 🚀 Quick Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up encryption:**
   ```bash
   npm run setup-encryption
   ```
   This will:
   - Generate a secure random encryption key
   - Create a `.env` file with the key
   - Migrate your existing data to encrypted format

3. **Start the server:**
   ```bash
   npm run server
   ```

## 🔑 How It Works

### Encryption Features:
- **AES-256-CBC encryption** for maximum security
- **Automatic migration** from plain text to encrypted format
- **Environment variable** for the encryption key
- **Backup creation** of original files

### File Structure:
- `investments.encrypted.json` - Your encrypted financial data
- `investments.json.backup` - Backup of original plain text file
- `.env` - Contains your encryption key (never committed to git)

## ⚠️ Security Important Notes

### 🔒 Keep Your Key Safe:
- The encryption key is stored in `.env` file
- **NEVER share or commit the `.env` file**
- If you lose the key, your data cannot be recovered
- Consider backing up the `.env` file to a secure location

### 🛡️ Data Protection:
- All financial data is encrypted at rest
- Data is only decrypted in memory when the server is running
- The encrypted file cannot be read without the key

## 🔧 Manual Setup (Alternative)

If the automatic setup doesn't work:

1. **Generate a key manually:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Create `.env` file:**
   ```env
   ENCRYPTION_KEY=your-generated-key-here
   PORT=3001
   NODE_ENV=development
   ```

3. **Start the server:**
   ```bash
   npm run server
   ```

## 🔄 Migration Process

When you first run the server with encryption:

1. **Detection**: Server detects existing `investments.json`
2. **Migration**: Data is encrypted and saved as `investments.encrypted.json`
3. **Backup**: Original file is renamed to `investments.json.backup`
4. **Verification**: Server confirms migration success

## 🚨 Recovery

### If you lose your encryption key:
- Your data cannot be decrypted
- You'll need to restore from backup or start fresh

### If you need to restore from backup:
1. Stop the server
2. Rename `investments.json.backup` to `investments.json`
3. Run `npm run setup-encryption` to generate a new key
4. Restart the server

## 🔍 Verification

To verify encryption is working:

1. **Check file contents:**
   ```bash
   cat investments.encrypted.json
   ```
   You should see encrypted hex data, not readable JSON.

2. **Check server logs:**
   The server will show "Encrypted data file: investments.encrypted.json"

## 🛠️ Production Deployment

For production use:

1. **Generate a strong key:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Set environment variable:**
   ```bash
   export ENCRYPTION_KEY=your-production-key
   ```

3. **Never use the default key in production!**

## 📁 Protected Files

The following files are now protected and excluded from git:
- `investments.encrypted.json` - Encrypted data
- `investments.json.backup` - Backup file
- `.env` - Environment variables with encryption key
- `investments.json` - Original plain text file (if exists)

Your financial data is now **securely encrypted** and protected from unauthorized access! 🔐 
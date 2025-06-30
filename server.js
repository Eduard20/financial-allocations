const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');
const crypto = require('crypto');

// Load environment variables
require('dotenv').config();

const app = express();
const PORT = 3001;
const DATA_FILE = 'investments.json';
const ENCRYPTED_FILE = 'investments.encrypted.json';

// Encryption configuration
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'your-secret-key-change-this-in-production';
const ALGORITHM = 'aes-256-cbc';

// Encryption functions
function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipher(ALGORITHM, ENCRYPTION_KEY);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

function decrypt(text) {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = textParts.join(':');
  const decipher = crypto.createDecipher(ALGORITHM, ENCRYPTION_KEY);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// Middleware
app.use(cors());
app.use(express.json());

// Initialize data file if it doesn't exist
async function initializeDataFile() {
  try {
    await fs.access(ENCRYPTED_FILE);
  } catch (error) {
    // File doesn't exist, create it with empty investments array
    const initialData = { investments: [] };
    await writeInvestments(initialData.investments);
  }
}

// Read investments from encrypted file
async function readInvestments() {
  try {
    const encryptedData = await fs.readFile(ENCRYPTED_FILE, 'utf8');
    const decryptedData = decrypt(encryptedData);
    return JSON.parse(decryptedData);
  } catch (error) {
    console.error('Error reading encrypted investments file:', error);
    return { investments: [] };
  }
}

// Write investments to encrypted file
async function writeInvestments(investments) {
  try {
    const data = JSON.stringify({ investments }, null, 2);
    const encryptedData = encrypt(data);
    await fs.writeFile(ENCRYPTED_FILE, encryptedData);
    return true;
  } catch (error) {
    console.error('Error writing encrypted investments file:', error);
    return false;
  }
}

// Migration function to encrypt existing plain text file
async function migrateToEncryption() {
  try {
    // Check if plain text file exists
    try {
      await fs.access(DATA_FILE);
      console.log('Found plain text investments.json, migrating to encrypted format...');
      
      // Read plain text file
      const plainData = await fs.readFile(DATA_FILE, 'utf8');
      const data = JSON.parse(plainData);
      
      // Write encrypted version
      await writeInvestments(data.investments);
      
      // Backup original file
      await fs.rename(DATA_FILE, `${DATA_FILE}.backup`);
      console.log(`Migration complete. Original file backed up as ${DATA_FILE}.backup`);
      
    } catch (error) {
      // Plain text file doesn't exist, that's fine
      console.log('No plain text file to migrate');
    }
  } catch (error) {
    console.error('Migration error:', error);
  }
}

// Routes
app.get('/api/investments', async (req, res) => {
  try {
    const data = await readInvestments();
    res.json(data.investments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read investments' });
  }
});

app.post('/api/investments', async (req, res) => {
  try {
    const newInvestment = req.body;
    const data = await readInvestments();
    
    // Add the new investment
    data.investments.push(newInvestment);
    
    // Save to encrypted file
    const success = await writeInvestments(data.investments);
    
    if (success) {
      res.json(newInvestment);
    } else {
      res.status(500).json({ error: 'Failed to save investment' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to add investment' });
  }
});

app.put('/api/investments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedInvestment = req.body;
    const data = await readInvestments();
    
    // Find and update the investment
    const index = data.investments.findIndex(inv => inv.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Investment not found' });
    }
    
    data.investments[index] = updatedInvestment;
    
    // Save to encrypted file
    const success = await writeInvestments(data.investments);
    
    if (success) {
      res.json(updatedInvestment);
    } else {
      res.status(500).json({ error: 'Failed to update investment' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update investment' });
  }
});

app.delete('/api/investments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await readInvestments();
    
    // Remove the investment
    const filteredInvestments = data.investments.filter(inv => inv.id !== id);
    
    // Save to encrypted file
    const success = await writeInvestments(filteredInvestments);
    
    if (success) {
      res.json({ message: 'Investment deleted successfully' });
    } else {
      res.status(500).json({ error: 'Failed to delete investment' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete investment' });
  }
});

// Start server
async function startServer() {
  await migrateToEncryption();
  await initializeDataFile();
  
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Encrypted data file: ${ENCRYPTED_FILE}`);
    console.log('⚠️  IMPORTANT: Change the ENCRYPTION_KEY environment variable in production!');
  });
}

startServer(); 
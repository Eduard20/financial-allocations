const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001;
const DATA_FILE = 'investments.json';

// Middleware
app.use(cors());
app.use(express.json());

// Initialize data file if it doesn't exist
async function initializeDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch (error) {
    // File doesn't exist, create it with empty investments array
    await fs.writeFile(DATA_FILE, JSON.stringify({ investments: [] }, null, 2));
  }
}

// Read investments from file
async function readInvestments() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading investments file:', error);
    return { investments: [] };
  }
}

// Write investments to file
async function writeInvestments(investments) {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify({ investments }, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing investments file:', error);
    return false;
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
    
    // Save to file
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
    
    // Save to file
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
    
    // Save to file
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
  await initializeDataFile();
  
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Data file: ${DATA_FILE}`);
  });
}

startServer(); 
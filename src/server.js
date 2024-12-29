// server.js
const express = require('express');
const cors = require('cors');
const { processFormData } = require('./src/aiProcessor');
const { setupDatabase } = require('./database/setup');

// If you have storeTracking & setupAutomatedTracking defined somewhere:
// const { storeTracking, setupAutomatedTracking } = require('./services/trackingService');

// If they do NOT exist yet, create dummy versions:
async function storeTracking(data) {
  // For now, just log
  console.log('Storing tracking:', data);
}
async function setupAutomatedTracking(data) {
  console.log('Setting up automated tracking:', data);
}

const app = express();

app.use(cors());
app.use(express.json());

// Handle form submission
app.post('/api/submit-tracking', async (req, res) => {
  try {
    const formData = req.body;
    
    // Process the data with AI
    const processedData = await processFormData(formData);
    
    // Store in database
    await storeTracking(processedData);
    
    // Set up automated tracking
    await setupAutomatedTracking(processedData);
    
    res.json({
      success: true,
      message: 'Tracking setup completed',
      trackingId: processedData.trackingId
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error setting up tracking',
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 3001;
setupDatabase();
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
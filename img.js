const express = require('express');
const port = 8000;
const mongodb = require('./config/mongodb');
const app = express();
const imageRout = require('./Route/imageRout');
const { loadModels } = require('./controllers/image');

// MongoDB connection
mongodb();

// Initialize face-api models
loadModels().then(() => {
    console.log('Face detection models loaded successfully');
    
    // Middleware
    app.use(express.json());
    app.use(imageRout);
    
    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    });
}).catch(err => {
    console.error('Error loading face detection models:', err);
    process.exit(1); // Exit the application if models fail to load
});

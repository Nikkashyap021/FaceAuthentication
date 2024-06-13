const mongoose = require('mongoose');

function connectToMongoDB() {
    const mongoDBURI = 'mongodb://localhost:27017/face';

    return mongoose.connect(mongoDBURI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log('✅ MongoDB connected ✅');
        })
        .catch(error => {
            console.error('Error connecting to MongoDB:', error);
            throw error; 
        });
}

module.exports = connectToMongoDB;

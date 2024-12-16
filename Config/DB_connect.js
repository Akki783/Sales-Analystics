require("dotenv").config();
const mongoose = require('mongoose');

// MongoDB connection URI
const dbURI = process.env.DBURL;

// Function to connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(dbURI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1); // Exit the process on failure
    }
};

module.exports = connectDB;
/*
3. API to fetch data by region and store code
app.get('/data', async (req, res) => {
    try {
        const { region, storeCode } = req.query;
        if (!region || !storeCode) {
            return res.status(400).json({ success: false, message: 'Region and Store Code are required.' });
        }
        const data = await Store.find({ Region: region, 'Store Code': storeCode });
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

*/ 
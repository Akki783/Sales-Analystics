require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT;
const db_connect = require("./Config/DB_connect");
const Store = require("./Model/sales_schema");

db_connect();

app.use(express.json());

app.get('/',(req,res)=>{
    res.send(`Sever is running`);
})

/*
app.get('/regions', async (req, res) => {
    try {
        const regions = await Store.distinct('Region');

        // const regionObj2 = Object.assign({},regions);
        // res.status(200).json({ success: true, regions: regionObj2 });

        res.status(200).json({ success: true, regions: regions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
*/

app.get('/regions', async (req, res) => {
    try {
        const regions = await Store.distinct('Region');

        // Transform regions into an array of objects with key-value pairs
        const regionObjects = regions.map(region => ({ region }));

        console.log("Data ",regions);

        res.status(200).json({
            success: true,
            data: regionObjects,
            regions
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


app.get('/store-codes', async (req, res) => {
    try {
        console.log(req.body);
        const region = req.body.region; // Ensure middleware for parsing req.body is added (express.json())
        
        if (!region) {
            return res.status(400).json({
                success: false,
                message: `Region is required.`,
            });
        }

        // Query MongoDB for the document with the matching region
        const storeData = await Store.findOne({ "Region": region });

        if (!storeData || !storeData['Store Code']) {
            return res.status(404).json({
                success: false,
                message: `No store codes found for region: ${region}`,
            });
        }

        // Extract 'Store Code' field
        const storeCodes = storeData['Store Code'];

        const storeCodesJson = Object.assign({},storeCodes);

        res.status(200).json({
            success: true,
            storeCodesJson,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// TODO : EXTRA APIs
app.get('/regionsv2', async (req, res) => {
    try {
        const regions = await Store.distinct('Region');

        // Transform regions into an object with unique keys for each region
        const regionObjects = regions.reduce((acc, region, index) => {
            acc[`region${index + 1}`] = { region };
            return acc;
        }, {});

        res.status(200).json({
            success: true,
            data: regionObjects,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// DATA
// API 1: Get YTD Details
app.post('/api/ytd-details', async (req, res) => {
    const { region, storeCode } = req.body;

    try {
        const store = await Store.findOne({ Region: region, "Store Code": storeCode }, { YTD: 1 });

        if (!store) {
            return res.status(404).json({ success: false, message: 'Store not found' });
        }

        res.status(200).json({ success: true, data: store.YTD });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// API 2: Get MTD Details of Specific Month and Previous Month
app.post('/api/mtd-details', async (req, res) => {
    const { region, storeCode, month } = req.body;

    try {
        const store = await Store.findOne({ Region: region, "Store Code": storeCode }, { MTD: 1 });

        if (!store) {
            return res.status(404).json({ success: false, message: 'Store not found' });
        }

        const filteredMonths = store.MTD.filter(data => data.Month === month || data.Month < month);

        res.status(200).json({ success: true, data: filteredMonths });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// API 3: Get Opportunity Birthday Details
app.post('/api/opportunity-birthday', async (req, res) => {
    const { region, storeCode } = req.body;

    try {
        const store = await Store.findOne({ Region: region, "Store Code": storeCode }, { "Opportunity Birthday": 1 });

        if (!store) {
            return res.status(404).json({ success: false, message: 'Store not found' });
        }

        res.status(200).json({ success: true, data: store["Opportunity Birthday"] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// API 4: Get Opportunity Anniversary Details
app.post('/api/opportunity-anniversary', async (req, res) => {
    const { region, storeCode } = req.body;

    try {
        const store = await Store.findOne({ Region: region, "Store Code": storeCode }, { "Opportunity Anniversary": 1 });

        if (!store) {
            return res.status(404).json({ success: false, message: 'Store not found' });
        }

        res.status(200).json({ success: true, data: store["Opportunity Anniversary"] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// API 5: Get Data of Selected Month and Last 3 Months
app.post('/api/monthly-data', async (req, res) => {
    const { region, storeCode, month } = req.body;

    try {
        const store = await Store.findOne({ Region: region, "Store Code": storeCode }, { MTD: 1 });

        if (!store) {
            return res.status(404).json({ success: false, message: 'Store not found' });
        }

        const monthIndex = store.MTD.findIndex(data => data.Month === month);

        if (monthIndex === -1) {
            return res.status(404).json({ success: false, message: 'Month not found' });
        }

        const lastThreeMonths = store.MTD.slice(Math.max(0, monthIndex - 3), monthIndex + 1);

        res.status(200).json({ success: true, data: lastThreeMonths });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.listen(PORT,()=>{
    console.log(`Server Is Running on : http://localhost:${PORT}`);
})
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

app.listen(PORT,()=>{
    console.log(`Server Is Running on : http://localhost:${PORT}`);
})
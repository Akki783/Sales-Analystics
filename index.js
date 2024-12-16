require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT;
const db_connect = require("./Config/DB_connect");
const Store = require("./Model/sales_schema");

db_connect();

app.get('/',(req,res)=>{
    res.send(`Sever is running`);
})

app.get('/regions', async (req, res) => {
    try {
        const regions = await Store.distinct('Region');
        const regionObj2 = Object.assign({},regions);
        res.status(200).json({ success: true, regions: regionObj2 });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


app.get('/store-codes', async (req, res) => {
    try {
        const storeCodes = await Store.distinct('Store Code');
        res.status(200).json({ success: true, storeCodes });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.listen(PORT,()=>{
    console.log(`Server Is Running on : http://localhost:${PORT}`);
})
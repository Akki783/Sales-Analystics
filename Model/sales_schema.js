const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
    Region: {
        type: String,
        required: true,
    },
    "Store Code": [{
        type: String,
    }],
    YTD: {
        "Store Age": {
            type: String,
        },
        "New Customer": {
            type: Number,
        },
        "New Customer Revenue": {
            type: Number,
        },
        "Repeat Customer": {
            type: Number,
        },
        "Repeat Customer Revenue": {
            type: Number,
        },
    },
    MTD: [{
        Month: {
            type: String,
        },
        "New Customer": {
            type: Number,
        },
        "New Customer Revenue": {
            type: Number,
        },
        "Repeat Customer": {
            type: Number,
        },
        "Repeat Customer Revenue": {
            type: Number,
        },
    }],
    "Opportunity Birthday": [{
        "Total Count": {
            type: Number,
        },
        "Revenue Potential": {
            type: Number,
        },
        "Redeemed Count": {
            type: Number,
        },
        "Sale Achieved": {
            type: Number,
        },
        "Ach %": {
            type: String,
            default: function() {
                return this["Total Count"] > 0 ? ((this["Redeemed Count"] / this["Total Count"]) * 100).toFixed(2) + '%' : '0%';
            }
        },
    }],
    "Opportunity Anniversary": [{
        "Total Count": {
            type: Number,
        },
        "Revenue Potential": {
            type: Number,
        },
        "Redeemed Count": {
            type: Number,
        },
        "Sale Achieved": {
            type: Number,
        },
        "Ach %": {
            type: String,
            default: function() {
                return this["Total Count"] > 0 ? ((this["Redeemed Count"] / this["Total Count"]) * 100).toFixed(2) + '%' : '0%';
            }
        },
    }],
});

const Store = mongoose.model('Store', storeSchema);
module.exports = Store;

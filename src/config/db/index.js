// Cầu nối giữa nodejs và mongodb
const mongoose = require('mongoose')

async function connect() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/blog')
        console.log('connect succesfully')
    } catch (error) {
        console.log('connect fail')
    }
}

module.exports = { connect }
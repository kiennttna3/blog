// Cầu nối giữa nodejs và mongodb
const mongoose = require('mongoose')
const slug = require('mongoose-slug-updater')
var mongoosedelete = require('mongoose-delete')
const AutoIncrement = require('mongoose-sequence')(mongoose)

// Constructor 
const Schema = mongoose.Schema

const Course = new Schema({
    _id: { type: Number },
    name: { type: String, required: true, maxLength: 255 },
    description: { type: String },
    image: { type: String, maxLength: 255 },
    videoId: { type: String, required: true, maxLength: 255 },
    level: { type: String, maxLength: 255 },
    slug: { type: String, slug: "name", unique: true },
}, {
    _id: false,
    timestamps: true,
})

// Add plugin
mongoose.plugin(slug)
Course.plugin(mongoosedelete, {
    deletedAt : true,
    overrideMethods: 'all'
})
Course.plugin(AutoIncrement)
  
module.exports = mongoose.model('Course', Course)
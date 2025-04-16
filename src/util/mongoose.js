const { default: mongoose } = require("mongoose")

// Mongooses helper
module.exports = {
    // Nhận 1 mảng doc
    mutipleMongooseToObject: function (mongooses) {
        // Dùng map để gọi toObject trên từng doc và trả về Object thuần
        return mongooses.map(mongoose => mongoose.toObject())
    },
    // Nhận 1 doc duy nhất
    mongooseToObject: function (mongoose) {
        // doc -> convert object
        // null -> null
        return mongoose ? mongoose.toObject() :  mongoose
    }
}
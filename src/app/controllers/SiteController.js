const Course = require('../models/Course')
const { mutipleMongooseToObject } = require('../../util/mongoose')

class SiteController {
    // [GET] /
    index(req, res, next){
        // Bất đồng bộ
        Promise.all([Course.find({}), Course.countDocuments(), Course.countDocumentsDeleted()])
            .then(([courses, NumberCount, deleteCount]) =>
                res.render('home', {
                    courses: mutipleMongooseToObject(courses),
                    NumberCount,
                    deleteCount
                })
            )
            .catch(next)

        // Course.find({})
        //     .then(courses => {
        //         res.render('home', {
        //             courses: mutipleMongooseToObject(courses)
        //         })
        //     })
        //     .catch(next)
    }

    // [GET] /search
    search(req, res) {
        res.render('search')
    }
}

module.exports = new SiteController
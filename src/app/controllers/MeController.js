const Course = require('../models/Course')
const { mutipleMongooseToObject } = require('../../util/mongoose')

class MeController {
    // [GET] /me/stored/courses
    storedCourses(req, res, next) {
        let courseQuery = Course.find({})
        
        // Sắp xếp
        if (req.query.hasOwnProperty('_sort')) {
            courseQuery = courseQuery.sort({
                [req.query.column]: req.query.type
            })
        }

        // Bất đồng bộ
        Promise.all([courseQuery, Course.countDocuments(), Course.countDocumentsDeleted()])
            .then(([courses, NumberCount, deleteCount]) =>
                res.render('me/stored-courses', {
                    courses: mutipleMongooseToObject(courses),
                    NumberCount,
                    deleteCount
                })
            )
            .catch(next)

        // Course.countDocumentsDeleted()
        //     .then((deleteCount) => {

        //     })
        //     .catch(() => {})

        // Course.find({})
        //     .then(courses => res.render('me/stored-courses', {
        //         courses: mutipleMongooseToObject(courses)
        //     }))
        //     .catch(next)
    }

    // [GET] /me/trash/courses
    trashCourses(req, res, next) {

        // Bất đồng bộ
        Promise.all([Course.findDeleted({}), Course.countDocuments(), Course.countDocumentsDeleted()])
            .then(([courses, NumberCount, deleteCount]) =>
                res.render('me/trash-courses', {
                    courses: mutipleMongooseToObject(courses),
                    NumberCount,
                    deleteCount
                })
            )
            .catch(next)

        // Course.findDeleted({})
        //     .then(courses => res.render('me/trash-courses', {
        //         courses: mutipleMongooseToObject(courses)
        //     }))
        //     .catch(next)
    }
}

module.exports = new MeController
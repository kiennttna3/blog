const Course = require('../models/Course')
const { mongooseToObject } = require('../../util/mongoose')

class SiteController {
    // [GET] /courses/:slug
    show(req, res, next) {
        // Bất đồng bộ
        Promise.all([Course.findOne({ slug: req.params.slug }), Course.countDocuments(), Course.countDocumentsDeleted()])
            .then(([course, NumberCount, deleteCount]) =>
                res.render('courses/show', {
                    course: mongooseToObject(course),
                    NumberCount,
                    deleteCount
                })
            )
            .catch(next)

        // Course.findOne({ slug: req.params.slug })
        //     .then(course => {
        //         res.render('courses/show', { 
        //             course: mongooseToObject(course)
        //         })
        //     })
        //     .catch(next)
    }

    // [GET] /courses/create
    create(req, res, next) {
        // Bất đồng bộ
        Promise.all([Course.countDocuments(), Course.countDocumentsDeleted()])
            .then(([NumberCount, deleteCount]) =>
                res.render('courses/create', {
                    NumberCount,
                    deleteCount
                })
            )
            .catch(next)

        // res.render('courses/create')
    }

    // [GET] /courses/:id/edit
    edit(req, res, next) {
        // Bất đồng bộ
        Promise.all([Course.findById(req.params.id), Course.countDocuments(), Course.countDocumentsDeleted()])
            .then(([course, NumberCount, deleteCount]) =>
                res.render('courses/edit', {
                    course: mongooseToObject(course),
                    NumberCount,
                    deleteCount
                })
            )
            .catch(next)

        // Course.findById(req.params.id)
        //     .then(course => res.render('courses/edit', {
        //         course: mongooseToObject(course)
        //     }))
        //     .catch(next)
    }

    // [PUT] /courses/:id
    update(req, res, next) {
        Course.updateOne({ _id: req.params.id }, req.body)
            .then(() => res.redirect('/me/stored/courses'))
            .catch(next)
    }

    // [POST] /courses/store
    store(req, res, next) {
        req.body.image = `https://i.ytimg.com/vi/${req.body.videoId}/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs`
        const course = new Course(req.body)
        course.save()
            .then(() => res.redirect('/me/stored/courses'))
            .catch(next)
    }

    // [DELETE] /courses/:id
    destroy(req, res, next) {
        Course.delete({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next)
    }

    // [PATCH] /courses/:id/restore
    restore(req, res, next) {
        Course.restore({ _id: req.params.id })
            .then(() => {return Course.updateOne({ _id: req.params.id }, { deleted: false });})
            .then(() => res.redirect("back"))
            .catch(next)
    }

    // [DELETE] /courses/:id/force
    forceDestroy(req, res, next) {
        Course.deleteOne({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next)
    }

    // [POST] /courses/handle-form-action
    handleFormAction(req, res, next) {
        switch (req.body.action) {
            case 'restore':
                Course.restore({ _id: { $in: req.body.courseIds } })
                    .then(() => {return Course.updateMany({ _id: { $in: req.body.courseIds } }, { deleted: false });})
                    .then(() => res.redirect("back"))
                    .catch(next)
                break
            case 'delete':
                Course.delete({ _id: { $in: req.body.courseIds }})
                    .then(() => res.redirect('back'))
                    .catch(next)
                break
            default:
                res.json({ message: 'Action is invalid' })
        }
    }
}

module.exports = new SiteController
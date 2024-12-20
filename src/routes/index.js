const { Router } = require('express')

const usersRoutes = require('./users.routes')
const notesRoutes = require('./notes.routes')
const tagsRoutes = require('./tags.routes')
const sessionsRoutes = require('./sessions.routes')

const routes = Router()

routes.use('/tags', tagsRoutes)
routes.use('/users', usersRoutes)
routes.use('/notes', notesRoutes)
routes.use('/sessions', sessionsRoutes)

module.exports = routes

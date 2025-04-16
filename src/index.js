const express = require('express')
const morgan = require('morgan')
const path = require('path')
const { engine } = require('express-handlebars')
const methodOverride = require('method-override')
const SortMiddlewares = require('./app/middlewares/SortMiddlewares')

// run express
const app = express()
// run port
const port = 3000

const route = require('./routes')
const db = require('./config/db')

// Connect to DB
db.connect()

// Use static folder
app.use(express.static(path.join(__dirname, 'public')))

app.use(express.urlencoded({
  extended: true
}))
app.use(express.json())

//HTTP Logger
app.use(morgan('combined'))

// override with POST having ?_method=PUT
app.use(methodOverride('_method'))

// custom middlewares
app.use(SortMiddlewares)

//Template engine
app.engine('.hbs', engine({
  extname: '.hbs',
  helpers: {
    sum: (a, b) => a + b,
    sortable: (field, sort) => {
      const sortType = field === sort.column ? sort.type : 'default'

      const icons = {
        default: 'bi bi-caret-down-fill',
        asc: 'bi bi-caret-down-fill',
        desc: 'bi bi-caret-up-fill'
      }

      const types = {
        default: 'desc',
        asc: 'desc',
        desc: 'asc'
      }

      const icon = icons[sortType]
      const type = types[sortType]
      
      return `<a class="text-white" href="?_sort&column=${field}&type=${type}">
            <i class="${icon}"></i>
          </a>`
    }
  }
}));
app.set('view engine', '.hbs')
// Use path folder
app.set('views', path.join(__dirname, 'resources', 'views'))

//Routes Init
route(app)


app.listen(port, () => {
  console.log(`App listening on port http://localhost:${port}`)
})

// End

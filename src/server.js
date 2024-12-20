require('express-async-errors')
const AppError = require('./utils/AppError')
const uploadConfig = require('./config/upload')

const express = require('express')
const routes = require('./routes')

const app = express()
app.use(express.json())

app.use('/files', express.static(uploadConfig.UPLOAD_FOLDER))

app.use(routes)

app.use((error, request, response, next) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    })
  }

  console.error(error)

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  })
})

const PORT = 3000

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})

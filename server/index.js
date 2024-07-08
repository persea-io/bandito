const express = require('express')

const app = express()

const port = 8080

app.get('/', (req, res) => {
  res.json({message: 'Welcome to Bandito'})
})

app.listen(port)

console.log('Server started on port: ' + port)


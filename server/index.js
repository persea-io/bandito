const express = require('express')
const fs = require('fs')
const cors = require('cors')


const app = express()
app.use(express.json())

app.use(cors())

const port = 8080

//function to read a file into an array (line by line)
const readFileLines = filename =>
  fs
    .readFileSync(filename)
    .toString('UTF8')
    .split('\n');

//Keep get request
app.get('/', (req, res) => {
  let arr = readFileLines('./data.txt').map(line => line.trim()).filter(line => line); 
  res.json({
    dates: arr})
})

//keep post request
app.post('/', (req, res) => {
  fs.writeFile('./data.txt', `${req.body.date}\n`, {flush: true, flag: "a+"} , (err)=>{})
  res.end()
})

app.listen(port)

console.log('Server started on port: ' + port)


const express = require('express')
const fs = require('fs')


const app = express()
app.use(express.json())

const port = 8080

//function to read a file into an array (line by line)
const readFileLines = filename =>
  fs
    .readFileSync(filename)
    .toString('UTF8')
    .split('\n');

function lastMeal(lastDate) {
  var returnString = ''
  var currDate = new Date()
  //return either 'this' or 'last' depending on if last meal was today or yesterday
  if (lastDate.getDay() == currDate.getDay()) { returnString = 'This ' }
  else { returnString = 'Last ' }

  //return the time of day depending on the hour
  if ((lastDate.getHours() >=0 && lastDate.getHours() <= 11)) { returnString += 'Morning' }
  else if ((lastDate.getHours() >= 12 && lastDate.getHours() <= 16)) { returnString += 'Afternoon' }
  else { returnString += 'Evening' }

  return returnString
}

function formatTime(lastTime) {
  return lastTime.getHours() + ":" + lastTime.getMinutes()
}

app.get('/', (req, res) => {
  let arr = readFileLines('./data.txt');
  let lastDate = new Date(arr[arr.length-2])
  res.send(`Bandit ate: ${lastMeal(lastDate)} at ${formatTime(lastDate)}`)
})

app.post('/', (req, res) => {
  fs.writeFile('./data.txt', `${new Date().toISOString()}\n`, {flush: true, flag: "a+"} , (err)=>{})
  res.end()
})


app.listen(port)

console.log('Server started on port: ' + port)


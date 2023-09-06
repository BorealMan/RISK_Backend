import express from 'express'
import cors from 'cors'
// Game Imports
import CONFIG from './config.js'
import GameRouter from './api/game.js'

// Init Express API
const app = express()
const icors = cors()
app.use(icors)

// Add Paths
app.use('/game', GameRouter)


// Default Working
app.get('/', (req, res) => {
    res.status(200).send(`<h1>Hello World</h1>`)
})


app.listen(CONFIG.PORT, () => {
    console.log(`Listening at http://localhost:${CONFIG.PORT}`)
})
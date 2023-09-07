import express from 'express'
import cors from 'cors'
import expressWS from 'express-ws'
// Game Imports
import CONFIG from './config.js'
import GameRouter from './api/game.js'

// Init Express API
const app = express()
const icors = cors()
app.use(icors)
app.use(express.json())

// Initalize WebSocket
expressWS(app)

// Add Paths
app.use('/game', GameRouter)


app.ws('/', (ws, req) => {

    ws.on('message', (msg) => {
        
        if (msg.username == "Ryan") {
            return ws.send("Hello Ryan")
        }

        return ws.send(msg)
    })

})

// Default Working
app.get('/', (req, res) => {
    res.status(200).send(`<h1>Hello World</h1>`)
})


app.listen(CONFIG.PORT, () => {
    console.log(`Listening at http://localhost:${CONFIG.PORT}`)
})
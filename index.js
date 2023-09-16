import express from 'express'
import cors from 'cors'
import { createServer } from 'node:http';
import { Server } from 'socket.io';
// Game Imports
import CONFIG from './config.js'
import GameRouter from './api/game.js'

// Init Express API
const app = express()
app.use(cors())
app.use(express.json())

// Initalize Socket.io
const server = createServer(app);
const io = new Server(server)

// Add Paths
// app.use('/game', GameRouter)


// Testing Socket.io
io.on('connection', (socket) => {
    console.log(`A New User Connected`)

    socket.on('disconnect', (socket) => {
        console.log(`A User Disconnected`)
    })

})


// Default Working
app.get('/', (req, res) => {
    res.status(200).send(`<h1>Hello World</h1>`)
})


server.listen(CONFIG.PORT, () => {
    console.log(`Listening at http://localhost:${CONFIG.PORT}`)
})
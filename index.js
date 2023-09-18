import express from 'express'
import cors from 'cors'
import { createServer } from 'node:http';
import { Server } from 'socket.io';
// Game Imports
import CONFIG from './config.js'
// import GameRouter from './api/game.js'
import { randomUUID } from 'crypto'

// Init Express API
const app = express()
app.use(cors())
app.use(express.json())

// Initalize Socket.io
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*'
    },
    connectionStateRecovery: {
        maxDisconnectionDuration: 2 * 60 * 1000,
        skipMiddlewares: true,
    }
})

// Game Imports
import Game from './game/game.js'
import { GAMES, RemoveDeadGames } from './data/games.js'

// Testing Socket.io
io.on('connection', (socket) => {
    if (CONFIG.DEBUG) console.log(`A New User Connected\n`)

    socket.on('disconnect', () => {
        if (CONFIG.DEBUG) console.log(`A User Disconnected\n`)
    })

    socket.on('newgame', (username) => {
        // Generate New ID, Create New Game, Add Game To Memory
        const newid = randomUUID()
        if (CONFIG.DEBUG) console.log(`Creating New Game With ID: ${newid}\n`)
        const game = new Game(newid)
        GAMES[newid] = game;
        // Create New Player, Return On Error
        const player = game.addPlayer(username)
        if (player.err !== undefined) return socket.emit('newgame', player.err);
        // Join Socket Room, Send Game And Player
        socket.join(newid);
        return socket.emit('newgame', {player_id: player.id, game: game})
    })

    socket.on('joingame', (gameid, username) => {
        if (CONFIG.DEBUG) console.log(`Joining Game:\nId: ${gameid}\nUsername: ${username}\n`)
        // Get Game, Check That It Exists
        const game = GAMES[gameid]
        if (game === undefined) {
            return socket.emit('joingame', {err: `Game Doesn't Exist`});
        }
        // Try To Create New Player
        const player = GAMES[gameid].addPlayer(username);
        if (player.err !== undefined) return socket.emit('joingame', player.err);
        socket.join(gameid);
        return socket.emit('joingame', {player_id: player.id, game: game})
    })

    socket.on('leavegame', (gameid, playerid) => {
        if (CONFIG.DEBUG) console.log(`Leaving Game\nGameId: ${gameid}\nPlayerId: ${playerid}\n`)
        // Get Game, Check That It Exists
        const game = GAMES[gameid]
        if (game === undefined) {
            return socket.emit('joingame', {err: `Game Doesn't Exist`});
        }
        const result = GAMES[gameid].removePlayer(playerid);
        if (result.err !== undefined) {
            return socket.emit('leavegame', result.err);
        }
        socket.leave(gameid);
        return socket.emit('leavegame', 'Success')
    })

    socket.on('message', (gameid, playerid, message) => {
        if (CONFIG.DEBUG) console.log(`Message Event: ${message}\n`)
        return io.to(gameid).broadcast.emit({message: {playerid: playerid, content: message}});
    })

    socket.on('sync', (gameid) => {

    })

})


// Default Working
app.get('/', (req, res) => {
    res.status(200).send(`<h1>Backend Is Working</h1>`)
})


server.listen(CONFIG.PORT, () => {
    console.log(`Listening at http://localhost:${CONFIG.PORT}`)
    // Remove Games With No Players Periodically (minutes * seconds * miliseconds)
    setInterval(() => RemoveDeadGames(), 1 * 60 * 1000)
})
import express from 'express';
import { randomUUID } from 'crypto'

// Game Imports
import Game from '../game/game.js'
import GAMES from '../data/games.js'

export const router = express.Router()

router.get("/", (req, res) => {
    res.status(404).json({err: "Invalid Path"})
})

router.get('/newgame', (req, res) => {
    // Create a new game and return the key
    const key = randomUUID()
    GAMES[key] = new Game(key)

    console.log(GAMES)

    return res.status(200).json({game: GAMES[key]})
})

router.get('/:key', (req, res) => {
    // Get Game
    const key = req.params['key']
    const game = GAMES[key]
    // Handle Invalid Key
    if (game === undefined) {
        return res.status(400).json({err: "Invalid Game Key"})
    }
    // Send Game Data
    return res.status(200).json({game: GAMES[key]})
})

router.post('/:key/addplayer', (req, res) => {
    // Get Game
    const key = req.params['key']
    const game = GAMES[key]
    // Handle Invalid Key
    if (game === undefined) {
        return res.status(400).json({err: "Invalid Game Key"})
    }
    const username = req.body.username

    if (username === undefined) return res.status(400).json({err: "Username Required"});

    const result = game.addPlayer(username)

    if (result.err !== undefined) return res.status(400).json({err: result.err})

    return res.status(201).json({game: game})
})

router.post(':key/removeplayer', (req, res) => {
    // Get Game
    const key = req.params['key']
    const game = GAMES[key]
    // Handle Invalid Key
    if (game === undefined) {
        return res.status(400).json({err: "Invalid Game Key"})
    }

    const id = req.body.id

    if (id === undefined) return res.status(400).json({err: result.err})

    const result = game.removePlayer(id)

    if (result.err !== undefined) return res.status(400).json({err: result.err})

    return res.status(201).json({game:game})
})

export default router;
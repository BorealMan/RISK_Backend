import express from 'express';
import { randomUUID } from 'crypto'

import Game from '../game.js'

export const router = express.Router()

// Game Dict
export const Games = {};

router.get("/", (req, res) => {
    res.status(400).json({err: "Invalid Path"})
})

router.get('/newgame', (req, res) => {
    // Create a new game and return the key
    const key = randomUUID()
    Games[key] = new Game(key)

    console.log(Games)

    return res.status(200).json({key: key})
})

router.get('/:key', (req, res) => {
    // Get Game
    const key = req.params['key']
    const game = Games[key]
    // Handle Invalid Key
    if (game === undefined) {
        return res.status(404).json({err: "Invalid Game Key"})
    }
    // Send Game Data
    return res.status(200).json({game: Games[key]})
})

export default router;
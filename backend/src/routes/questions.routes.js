import express from 'express'
import { getSoloPracticeQuestions, endSoloSession } from '../controllers/questions.controller.js'

const router = express.Router()

 
router.get('/get-solo', getSoloPracticeQuestions)
router.post('/end-solo-session', endSoloSession)

export default router

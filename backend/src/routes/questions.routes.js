import express from 'express'
import { getSoloPracticeQuestions, endSoloSession } from '../controllers/questions.controller.js'
import { authenticateUser } from '../middlewares/auth.js'
import { validate, schemas } from '../middlewares/validate.js'

const router = express.Router()

router.use(authenticateUser)

router.get('/get-solo', validate({ query: schemas.soloQuery }), getSoloPracticeQuestions)
router.post('/end-solo-session', validate({ body: schemas.endSolo }), endSoloSession)

export default router

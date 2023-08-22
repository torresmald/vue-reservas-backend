import express from 'express'
import { authMiddleware } from '../middleware/authMiddleware.js'
import { getCitasUsers } from '../controllers/userController.js'

const router = express.Router()


router.route('/:user/citas')
    .get(authMiddleware, getCitasUsers)

export default router
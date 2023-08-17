import express from 'express'
import { registerUser, verifyAccount, loginUser, user } from '../controllers/authController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/verify/:token', verifyAccount)

router.get('/user', authMiddleware, user)



export default router
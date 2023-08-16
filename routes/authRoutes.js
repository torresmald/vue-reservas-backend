import express from 'express'
import { registerUser, verifyAccount, loginUser } from '../controllers/authController.js'

const router = express.Router()


router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/verify/:token', verifyAccount)




export default router
import express from 'express'
import { registerUser, verifyAccount, loginUser, user, forgotPassword, updatePassword, verifyPasswordResetToken, admin} from '../controllers/authController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/forgot-password', forgotPassword)
router.route('/forgot-password/:token')
    .get(verifyPasswordResetToken)
    .post(updatePassword)

router.get('/verify/:token', verifyAccount)

router.get('/user', authMiddleware, user)
router.get('/admin', authMiddleware, admin)




export default router
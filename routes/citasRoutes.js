import express from 'express'
import {createCita, getCitaByDate} from '../controllers/citasController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'



const router = express.Router()

router.route('/')
    .post(authMiddleware, createCita)
    .get(authMiddleware, getCitaByDate)


export default router
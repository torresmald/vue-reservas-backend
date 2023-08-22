import express from 'express'
import {createCita, deleteCita, getCitaByDate, getCitaById, updateCita} from '../controllers/citasController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'



const router = express.Router()

router.route('/')
    .post(authMiddleware, createCita)
    .get(authMiddleware, getCitaByDate)

router.route('/:id')
    .get(authMiddleware, getCitaById)
    .put(authMiddleware, updateCita)
    .delete(authMiddleware, deleteCita)

export default router
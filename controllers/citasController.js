import { validateObjectId } from "../helpers/validate.js";
import Citas from "../models/Citas.model.js";
import { startOfDay, endOfDay, isValid, parse, formatISO } from 'date-fns'
import { sendNewCita, sendUpdateCita, sendDeleteCita } from '../email/citasEmailService.js';
import { formatEmailDate } from '../helpers/dates.js'



const createCita = async (request, response) => {
    try {
        const cita = request.body;
        cita.user = request.user;
        console.log(cita);
        const newCita = new Citas(cita)
        const savedCita = await newCita.save()
        await sendNewCita({
            date: formatEmailDate(savedCita.date),
            time: savedCita.time
        })
        response.status(200).json({
            msg: 'Cita Guardada Correctamente'
        })
    } catch (error) {
        console.log(error);
    }
}

const getCitaByDate = async (request, response) => {
    const { date } = request.query

    const newDate = parse(date, 'dd/MM/yyyy', new Date())

    if(!isValid(newDate)) {
        const error = new Error('Fecha no válida')
        return response.status(400).json({  msg: error.message })
    }

    const isoDate = formatISO(newDate)
    const appointments = await Citas.find({ date: {
        $gte : startOfDay(new Date(isoDate)),
        $lte: endOfDay(new Date(isoDate))
    }}).select('time')

    response.json(appointments)
}



const deleteCita = async (request, response) => {
    const { id } = request.params
    try {
        if (validateObjectId(id, response)) return
        const cita = await Citas.findById(id).populate('services')
        if (!cita) {
            const error = new Error('No se encuentra la Cita')
            return response.status(404).json({ msg: error.message })
        }
        const deletedCita = await cita.deleteOne()
        await sendDeleteCita({
            cita
        })
        response.status(200).json({
            msg: 'Cita Eliminada con Éxito'
        })
    } catch (error) {
        console.log(error);
    }
}

const getCitaById = async (request, response) => {
    const { id } = request.params
    if (validateObjectId(id, response)) return
    try {
        const cita = await Citas.findById(id).populate('services')
        if (!cita) {
            const error = new Error('Cita no Encontrada')
            return response.status(404).json({
                msg: error.message
            })
        }
        if (cita.user.toString() !== request.user._id.toString()) {
            const error = new Error('No Tienes permisos')
            return response.status(403).json({
                msg: error.message
            })
        }
        response.status(200).json(cita)
    } catch (error) {
        console.log(error);
    }
}

const updateCita = async (request, response) => {
    const { id } = request.params
    if (validateObjectId(id, response)) return
    try {
        const cita = await Citas.findById(id).populate('services')
        if (!cita) {
            const error = new Error('Cita no Encontrada')
            return response.status(404).json({
                msg: error.message
            })
        }
        if (cita.user.toString() !== request.user._id.toString()) {
            const error = new Error('No Tienes permisos')
            return response.status(403).json({
                msg: error.message
            })
        }
        const { date, time, totalPay, services } = request.body
        cita.date = date
        cita.time = time
        cita.totalPay = totalPay
        cita.services = services

        const updatedCita = await cita.save()
        await sendUpdateCita({
            date: formatEmailDate(updatedCita.date),
            time: updatedCita.time
        })

        response.status(201).json({
            msg: 'Cita Actualizada Correctamente'
        })

    } catch (error) {
        console.log(error);
    }
}

export {
    createCita,
    getCitaByDate,
    deleteCita,
    getCitaById,
    updateCita
}
import Citas from "../models/Citas.model.js";
import { startOfDay, endOfDay, isValid, parse, formatISO } from 'date-fns'


const createCita = async (request, response) => {
    try {
        const cita = request.body;
        cita.user = request.user;
        const newCita = new Citas(cita)
        const savedCita = await newCita.save()
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
    if (!isValid(newDate)) {
        const error = new Error('Fecha no Válida')
        return response.status(400).json({ msg: error.message })
    }
    const isoDate =  formatISO(newDate)
    const citas = await Citas.find({
        date: {
            $gte: startOfDay(new Date(isoDate)),
            $lte: endOfDay(new Date(isoDate))
        }
    })

    response.status(200).json(
        citas
    )
}

export {
    createCita,
    getCitaByDate
}
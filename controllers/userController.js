import Citas from "../models/Citas.model.js";

const getCitasUsers = async (request, response) => {
    const { user } = request.params

    if (user !== request.user._id.toString()) {
        const error = new Error('Acceso Denegado')
        return response.status(400).json({ msg: error.message })
    }

    try {
        const query = request.user.admin ? { date: { $gte: new Date() } } : { user, date: { $gte: new Date() } }
        const citas = await Citas
            .find(query)
            .populate('services')
            .populate({ path: 'user', select: 'name email' })
            .sort({ date: 'asc' })

        response.json(citas)
    } catch (error) {
        console.log(error)
    }
}

export {
    getCitasUsers
}
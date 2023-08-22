import Citas from "../models/Citas.model.js";
import Users from "../models/Users.model.js";

const getCitasUsers = async (request, response) =>{
    const {user} = request.params;

    try {
        if(user != request.user._id.toString()){
            const error = new Error('Acceso Denegado')
            return response.status(403).json({
                msg: error.message
            })
        }
        const userFinded = await Users.findById(user)
        const citasUser = await Citas.find({user}).populate('services').sort({date: 'asc', time: 'asc'})
        if(!userFinded){
            const error = new Error('Usuario no Encontrado')
            return response.status(404).json({
                msg: error.message
            })
        }
        if(!citasUser){
            const error = new Error('No hay Citas para el Usuario')
            return response.status(404).json({
                msg: error.message
            })
        }
        response.status(200).json(
            citasUser
        )
    } catch (error) {
        
    }
} 

export {
    getCitasUsers
}
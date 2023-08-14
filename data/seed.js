import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { connect } from '../config/db/db.js'
import Services from '../models/Services.model.js'
import { services } from '../data/beautyServices.js'

dotenv.config()
await connect()

const seedDB = async () => {
    try {
        await Services.insertMany(services)
        console.log('Se agregaron los Servicios');
        process.exit(0)
    } catch (error) {
        console.log(error);
        process.exit(1)
    }

}

const clearDB = async () => {
    try {
        await Services.deleteMany()
        console.log('Se borraron los Servicios');
        process.exit(0)
    } catch (error) {
        console.log(error);
        process.exit(1)
    }

}


if (process.argv[2] === '--import') {
    seedDB()
} else {
    clearDB()
}
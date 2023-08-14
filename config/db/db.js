import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()
const url = process.env.MONGO_URL

export const connect = async () => {
    try {
        const db = await mongoose.connect(url, { useNewUrlParser: true })
        console.log('Conectado a MONGO ATLAS');
    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit(1)
    }

}
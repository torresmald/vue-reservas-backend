import express from 'express'
import { connect } from './config/db/db.js';
import servicesRoutes from './routes/servicesRoutes.js';
import dotenv from 'dotenv'
import cors from 'cors'

const PORT = process.env.PORT || 4000

dotenv.config()

const app = express();

app.use(express.json())

connect()

const whiteList = [process.env.FRONT_URL]
const corsOptions = {
    origin: function(origin, callback) {
        if(whiteList.includes(origin)){
            callback(null, true)
        }else {
            callback(new Error('Error de Cors'), false)
        }
    }
}
app.use(cors(corsOptions))

app.use('/api/services' ,servicesRoutes)


app.listen(PORT, () => {
    console.log(`Servidor funcionando en http://localhost:${PORT}`);
})


import express from 'express'
import { connect } from './config/db/db.js';
import servicesRoutes from './routes/servicesRoutes.js';
import authRoutes from './routes/authRoutes.js';
import citasRoutes from './routes/citasRoutes.js';
import userRoutes from './routes/userRoutes.js'


import dotenv from 'dotenv'
import cors from 'cors'

const PORT = process.env.PORT || 4000

dotenv.config()

const app = express();

app.use(express.json())

connect()

// const whiteList = process.env.FRONT_URL
// const corsOptions = {
//     origin: function(origin, callback) {
//         if(whiteList.includes(origin)){
//             callback(null, true)
//         }else {
//             callback(new Error('Error de Cors'), false)
//         }
//     }
// }
app.use(cors())

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get('/', (request, response) => {
    response.status(200).json('Bienvenido a mi API Reservas.')
  })

app.use('/api/services' ,servicesRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/citas', citasRoutes)
app.use('/api/users', userRoutes)




app.listen(PORT, () => {
    console.log(`Servidor funcionando en http://localhost:${PORT}`);
})

export default app
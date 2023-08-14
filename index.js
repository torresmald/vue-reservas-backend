import express from 'express'
import servicesRoutes from './routes/servicesRoutes.js';


const app = express();


app.use('/api/services' ,servicesRoutes)


const PORT = process.env.PORT || 4000


app.listen(PORT, () => {
    console.log(`Servidor funcionando en http://localhost:${PORT}`);
})
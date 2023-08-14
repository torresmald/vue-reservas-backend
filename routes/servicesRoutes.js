import express from 'express'

const router = express.Router()

router.get('/', (request, response) => {
    response.send('Desde qwewqewqe')
})


export default router
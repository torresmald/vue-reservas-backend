import mongoose from 'mongoose'


const citasSchema = new mongoose.Schema({
    services: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Services'
        }
    ],
    date: Date,
    time: String,
    totalPay: Number,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    }
},
    {
        timestamps: true
    })





const Citas = mongoose.model('Citas', citasSchema);

export default Citas;
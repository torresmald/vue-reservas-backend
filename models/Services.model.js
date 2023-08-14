import mongoose from 'mongoose'


const servicesSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, trim: true }
},
    {
        timestamps: true
    })





const Services = mongoose.model('Services', servicesSchema);

export default Services;
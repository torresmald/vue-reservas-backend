import mongoose from 'mongoose'
import { uniqueId } from '../helpers/uniqueId.js';

const usersSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true, lowercase: true},
    password: { type: String, required: true, trim: true },
    token: {
        type: String,
        default: () => uniqueId()
    },
    verified: {
        type: Boolean,
        default: false
    },
    admin: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true
    })





const Users = mongoose.model('Users', usersSchema);

export default Users;
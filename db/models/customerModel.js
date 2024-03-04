import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    city: { type: String, required: true },
    street: { type: String, required: true },
    buildingNumber: { type: String, required: true },
    floor: { type: String },
    apartmentNumber: { type: String }
});

let customerSchema = new mongoose.Schema({
    name: { type: String},
    email: { type: String },
    password: { type: String },
    address: { type: addressSchema },
    phones: [{ type: String }],
}) 
const customerModel = mongoose.model('Customer', customerSchema)
export default customerModel ;
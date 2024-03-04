import Joi from 'joi'

export const newCustomerSchema = Joi.object({
    name:Joi.string().min(3).max(20).required(),
    email:Joi.string().required(),
    password:Joi.string().min(8).max(20).required(),
    address: Joi.object({
        city: Joi.string().required(),
        street: Joi.string().required(),
        buildingNumber: Joi.string().required(),
        floor: Joi.string(),
        apartmentNumber: Joi.string()
    }).required(),
    phones:Joi.array().items(Joi.string().regex(/^01[0125][0-9]{8}$/)).required()
})

export const updateCustomerSchema = Joi.object({
    name:Joi.string().forbidden(),
    email:Joi.string().forbidden(),
    password:Joi.string().min(8).max(20).required(),
    newPassword:Joi.string().min(8).max(20),
    address: Joi.object({
        city: Joi.string().required(),
        street: Joi.string().required(),
        buildingNumber: Joi.string().required(),
        floor: Joi.string(),
        apartmentNumber: Joi.string()
    }),
    phones:Joi.array().items(Joi.string().regex(/^01[0125][0-9]{8}$/))
})
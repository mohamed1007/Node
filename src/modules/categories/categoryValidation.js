import Joi from 'joi'

export const newCategorySchema = Joi.object({
    name: Joi.string().required(),
    image: Joi.string().uri().required(),
})

export const updateCategorySchema = Joi.object({
    name: Joi.forbidden(),
    image: Joi.string().uri().required(),

})
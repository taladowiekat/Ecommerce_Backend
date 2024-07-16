import Joi from "joi" ;

export const createCuoponSchema = Joi.object({
    name : Joi.string().min(3).required(),
    amount: Joi.number().integer().min(50).max(100).optional(), 
    expireDate: Joi.date().greater('now')
})

export const getDetailsSchema = Joi.object({
    id:Joi.string().hex().length(24),
});

export const updateCategorySchema = Joi.object({
    id:Joi.string().hex().length(24),
    name:Joi.string().min(3),
    status: Joi.string().valid("Active", "NotActive"),
    image: Joi.object({
        fieldname: Joi.string().required(),
        originalname: Joi.string().required(),
        encoding: Joi.string().required(),
        mimeType: Joi.string().valid('image/png', 'image/jpeg', 'image/webp').required(),
        destination: Joi.string().required(),
        filename: Joi.string().required(),
        path: Joi.string().required(),
        size: Joi.number().max(5000000).required()
    }).optional(),
})

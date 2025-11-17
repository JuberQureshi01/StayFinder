import joi from 'joi';

const userSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(4).required(),
    profile: joi.object({
        fullName: joi.string().optional(),
        profilePictureUrl: joi.string().uri().optional()
    }).optional()
});

const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(4).required()
});

const propertySchema = joi.object({
    title: joi.string().required(),
    description: joi.string().required(),
    propertyType: joi.string().valid('APARTMENT', 'HOUSE', 'HOTEL', 'UNIQUE_STAY').required(),
    category: joi.string().valid('Trending', 'Mountains', 'Beachfront', 'Swimming Pools', 'Countryside', 'City Center').required(),
    location: joi.string().required(),
    amenities: joi.array().items(joi.string()).required(),
    basePricePerNight: joi.number().min(100).required(),
});

const reviewSchema = joi.object({
    rating: joi.number().min(1).max(5).required(),
    comment: joi.string().required()
});


const bookingSchema = joi.object({
    checkInDate: joi.date().required(),
    checkOutDate: joi.date().required(),
});

export { userSchema, propertySchema, reviewSchema, bookingSchema,loginSchema };
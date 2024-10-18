const Joi = require('joi');

// validasi user
const userSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    profile: Joi.object({
        identityType: Joi.string().valid('ktp', 'sim').required(), // Menyesuaikan dengan tipe identitas yang diizinkan
        identityNumber: Joi.string().required(),
        address: Joi.string().required(),
    }).required()
});


// validasi Akun
const accountSchema = Joi.object({
    userId: Joi.number().integer().required(),
    bankName: Joi.string().required(),
    bankAccountNumber: Joi.string().required(),
    balance: Joi.number().greater(0).required()
});

// validasi Transaksi
const transactionSchema = Joi.object({
    sourceAccountId: Joi.number().integer().required(),
    destinationAccountId: Joi.number().integer().required(),
    amount: Joi.number().greater(0).required()
});

module.exports = {
    userSchema,
    accountSchema,
    transactionSchema
};

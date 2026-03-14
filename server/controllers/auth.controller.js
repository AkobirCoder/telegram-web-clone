const BaseError = require("../errors/base.error");
const userModel = require("../models/user.model");

class AuthController {
    async login(req, res, next) {
        try {
            const {email} = req.body;

            const existUser = await userModel.findOne({ email });

            if (existUser) {
                throw BaseError.BadRequest("User already exist", [{email: "User already exist"}]);
            }

            const createdUser = await userModel.create({ email });

            res.status(201).json(createdUser);
        } catch (error) {
            next(error);  
        }
    }

    async verify(req, res, next) {
        const {email, otp} = req.body;

        res.json({email, otp});
    }
}

module.exports = new AuthController();

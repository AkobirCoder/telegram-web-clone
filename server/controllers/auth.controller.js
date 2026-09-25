const BaseError = require("../errors/base.error");
const userModel = require("../models/user.model");
const mailService = require("../services/mail.service");

class AuthController {
    async login(req, res, next) {
        try {
            const email = typeof req.body?.email === 'string'
                ? req.body.email.trim().toLowerCase()
                : '';

            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                throw BaseError.BadRequest("A valid email is required");
            }

            const existUser = await userModel.findOne({ email });

            if (existUser) {
                await mailService.sendOtp(existUser.email);

                return res.status(200).json({email: existUser.email});
            }

            const newUser = await userModel.create({email});

            await mailService.sendOtp(newUser.email);

            res.status(200).json({email: newUser.email});
        } catch (error) {
            next(error);  
        }
    }

    async verify(req, res, next) {
        try {
            const email = typeof req.body?.email === 'string'
                ? req.body.email.trim().toLowerCase()
                : '';
            const otp = typeof req.body?.otp === 'string' ? req.body.otp.trim() : '';

            if (!email || !/^\d{6}$/.test(otp)) {
                throw BaseError.BadRequest("A valid email and six-digit OTP are required");
            }

            const result = await mailService.verifyOtp(email, otp);

            if (result) {
                const user = await userModel.findOneAndUpdate({email}, {isVerified: true});

                res.status(200).json({user});
            } 
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AuthController();

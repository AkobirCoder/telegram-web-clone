const BaseError = require('../errors/base.error');
const { CONST } = require('../lib/constants');
const messageModel = require('../models/message.model');
const userModel = require('../models/user.model');
const mailService = require('../services/mail.service');

class UserController {
    // [GET]
    async getMessages(req, res, next) {
        try {
            const user = '69b5c6fdc5b403a211e7c184';

            const {contactId} = req.params;

            const messages = await messageModel
                .find({
                    $or: [
                        {sender: user, receiver: contactId},
                        {sender: contactId, receiver: user},
                    ],
                })
                .populate({path: 'sender', select: 'email'})
                .populate({path: 'receiver', select: 'email'});

            await messageModel.updateMany(
                {sender: contactId, receiver: user, status: 'SENT'},
                {status: CONST.READ}
            );  

            res.status(200).json({messages});
        } catch (error) {
            next(error);
        }
    }

    async getContacts(req, res, next) {
        try {
            const userId = '69b5c6fdc5b403a211e7c184';
            // const user = await userModel.findById(userId);

            const contacts = await userModel.findById(userId).populate('contacts');
            const allContacts = contacts.contacts.map((contact) => {
                return contact.toObject();
            });

            for (const contact of allContacts) {
                const lastMessage = await messageModel
                    .findOne({
                        $or: [
                            {sender: userId, receiver: contact._id},
                            {sender: contact._id, receiver: userId},
                        ],
                    })
                    .populate({path: 'sender'})
                    .populate({path: 'receiver'})
                    .sort({createdAt: -1});

                contact.lastMessage = lastMessage;
            }

            return res.status(200).json({contacts: allContacts});
        } catch (error) {
            next(error);
        }
    }

    // [POST]
    async createMessage(req, res, next) {
        try {
            const {sender, receiver, ...payload} = req.body;

            const newMessage = await messageModel.create(req.body);

            const currentMessage = await messageModel
                .findById(newMessage._id)
                .populate({path: 'sender', select: 'email'})
                .populate({path: 'receiver', select: 'email'});

            res.status(201).json({message: "Message sent successfully", newMessage: currentMessage});
        } catch (error) {
            next(error);
        }
    }

    async messageRead(req, res, next) {
        try {
            const {messages} = req.body;
            const allMessages = [];

            for (const message of messages) {
                const updatedMessage = await messageModel.findByIdAndUpdate(message._id, {status: CONST.READ}, {new: true});

                allMessages.push(updatedMessage);
            }

            res.status(201).json({allMessages});
        } catch (error) {
            next(error);
        }
    }

    async createContact(req, res, next) {
        try {
            const {email} = req.body;

            const userId = '69b5c6fdc5b403a211e7c184';
            const user = await userModel.findById(userId);

            const contact = await userModel.findOne({email});

            if (!contact) throw BaseError.BadRequest("User with this email does not exist"); 

            if (user.email === contact.email) throw BaseError.BadRequest("You cannot add yourself as a contact");

            const existContact = await userModel.findOne({_id: userId, contacts: contact._id});

            if (existContact) throw BaseError.BadRequest("Contact already exist");
            
            await userModel.findByIdAndUpdate(userId, {$push: {contacts: contact._id}});

            const addedContact = await userModel.findByIdAndUpdate(contact._id, {$push: {contacts: userId}}, {new: true});

            return res.status(201).json({message: "Contact added successfully", contact: addedContact});
        } catch (error) {
            next(error);
        }
    }

    async createReaction(req, res, next) {
        try {
            const {messageId, reaction} = req.body;
            const updatedMessage = await messageModel.findByIdAndUpdate(messageId, {reaction}, {new: true});

            res.status(201).json({updatedMessage});
        } catch (error) {
            next(error);
        }
    }

    async sendOtp(req, res, next) {
        try {
            const {email} = req.body;

            const existUser = await userModel.findOne({email});

            if (existUser) throw BaseError.BadRequest("User with this email does not exist");

            await mailService.sendOtp(email);

            res.status(200).json({message: "OTP sent successfully"});
        } catch (error) {
            next(error);
        }
    }

    // [PUT]
    async updateProfile(req, res, next) {
        try {
            const {userId, ...payload} = req.body;

            await userModel.findByIdAndUpdate(userId, payload);

            res.status(200).json({message: "Profile updated successfully"});
        } catch (error) {
            next(error);
        }
    }

    async updateMessage(req, res, next) {
        try {
            const {text} = req.body;

            const {messageId} = req.params;
            const updatedMessage = await messageModel.findByIdAndUpdate(messageId, {text}, {new: true});

            res.status(200).json({updatedMessage});
        } catch (error) {
            next(error);
        }
    }

    async updateEmail(req, res, next) {
        try {
            const {email, otp} = req.body;

            const result = await mailService.verifyOtp(email, otp);

            if (result) {
                const userId = '69b6ab64ee86c76e256dbd02';
                const user = await userModel.findByIdAndUpdate(userId, {email}, {new: true});

                res.status(200).json({message: "Email updated successfully", user});
            }
        } catch (error) {
            next(error);
        }
    }

    // [DELETE]
    async deleteMessage(req, res, next) {
        try {
            const {messageId} = req.params;
            await messageModel.findByIdAndDelete(messageId);

            res.status(200).json({message: "Message deleted successfully"});
        } catch (error) {
            next(error);
        }
    }

    async deleteUser(req, res, next) {
        try {
            const userId = '69b71b154c6b86279afb2c8d';
            await userModel.findByIdAndDelete(userId);

            res.status(200).json({message: "User deleted successfully"});
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new UserController();
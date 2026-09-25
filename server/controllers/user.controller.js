const BaseError = require('../errors/base.error');
const { CONST } = require('../lib/constants');
const messageModel = require('../models/message.model');
const userModel = require('../models/user.model');
const mailService = require('../services/mail.service');

class UserController {
    // [GET]
    async getMessages(req, res, next) {
        try {
            // const user = '69b5c6fdc5b403a211e7c184';

            const user = req.user._id;

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
                {sender: contactId, receiver: user, status: CONST.SENT},
                {status: CONST.READ}
            );  

            res.status(200).json({messages});
        } catch (error) {
            next(error);
        }
    }

    async getContacts(req, res, next) {
        try {
            // const userId = '69b5c6fdc5b403a211e7c184';
            // const user = await userModel.findById(userId);

            const userId = req.user._id;

            const contacts = await userModel.findById(userId).populate('contacts');
            if (!contacts) throw BaseError.Unauthorized();

            const allContacts = (contacts.contacts || []).map((contact) => {
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
            const userId = req.user._id;
            const {receiver: receiverId, text, image} = req.body || {};

            if (!receiverId || (!text?.trim() && !image)) {
                throw BaseError.BadRequest("A receiver and message content are required");
            }

            const isContact = await userModel.exists({_id: userId, contacts: receiverId});
            if (!isContact) throw BaseError.BadRequest("You can only message your contacts");

            const createdMessage = await messageModel.create({
                receiver: receiverId,
                text: typeof text === 'string' ? text.trim() : undefined,
                image,
                sender: userId,
            });

            const newMessage = await messageModel
                .findById(createdMessage._id)
                .populate({path: 'sender', select: 'email'})
                .populate({path: 'receiver', select: 'email'});

            const receiver = await userModel.findById(createdMessage.receiver);

            const sender = await userModel.findById(createdMessage.sender);

            res.status(201).json({
                message: "Message sent successfully", 
                newMessage,
                sender,
                receiver,
            });
        } catch (error) {
            next(error);
        }
    }

    async messageRead(req, res, next) {
        try {
            const {messages} = req.body || {};
            if (!Array.isArray(messages)) throw BaseError.BadRequest("Messages must be an array");

            const allMessages = [];

            for (const message of messages) {
                const updatedMessage = await messageModel.findOneAndUpdate(
                    {_id: message._id, receiver: req.user._id},
                    {status: CONST.READ},
                    {returnDocument: 'after'},
                );

                if (updatedMessage) allMessages.push(updatedMessage);
            }

            res.status(201).json({messages: allMessages});
        } catch (error) {
            next(error);
        }
    }

    async createContact(req, res, next) {
        try {
            const {email} = req.body;

            const userId = req.user._id;
            const user = await userModel.findById(userId);

            const contact = await userModel.findOne({email});

            if (!contact) throw BaseError.BadRequest("User with this email does not exist");

            if (!user) throw BaseError.Unauthorized();
            if (user._id.equals(contact._id)) throw BaseError.BadRequest("You cannot add yourself as a contact");

            const existContact = await userModel.findOne({_id: userId, contacts: contact._id});

            if (existContact) throw BaseError.BadRequest("Contact already exists");
            
            await userModel.findByIdAndUpdate(userId, {$push: {contacts: contact._id}});

            const addedContact = await userModel.findByIdAndUpdate(contact._id, {$push: {contacts: userId}}, {returnDocument: 'after'});

            return res.status(201).json({message: "Contact added successfully", contact: addedContact});
        } catch (error) {
            next(error);
        }
    }

    async createReaction(req, res, next) {
        try {
            const {messageId, reaction} = req.body;
            if (!messageId || typeof reaction !== 'string') {
                throw BaseError.BadRequest("A message and reaction are required");
            }

            const updatedMessage = await messageModel.findOneAndUpdate(
                {$or: [{_id: messageId, sender: req.user._id}, {_id: messageId, receiver: req.user._id}]},
                {reaction: reaction.trim()},
                {returnDocument: 'after'},
            );
            if (!updatedMessage) throw BaseError.BadRequest("Message not found");

            res.status(201).json({updatedMessage});
        } catch (error) {
            next(error);
        }
    }

    async sendOtp(req, res, next) {
        try {
            const email = typeof req.body?.email === 'string'
                ? req.body.email.trim().toLowerCase()
                : '';
            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                throw BaseError.BadRequest("A valid email is required");
            }

            const existUser = await userModel.findOne({email});

            if (existUser) throw BaseError.BadRequest("User with this email already exist");

            await mailService.sendOtp(email);

            res.status(200).json({message: "OTP sent successfully", email});
        } catch (error) {
            next(error);
        }
    }

    // [PUT]
    async updateProfile(req, res, next) {
        try {
            const user = req.user;
            const {firstName, lastName, bio, avatar, muted, notificationSound, sendingSound} = req.body || {};

            await userModel.findByIdAndUpdate(user._id, {
                firstName, lastName, bio, avatar, muted, notificationSound, sendingSound,
            }, {runValidators: true});

            res.status(200).json({message: "Profile updated successfully"});
        } catch (error) {
            next(error);
        }
    }

    async updateMessage(req, res, next) {
        try {
            const {text} = req.body;

            const {messageId} = req.params;
            if (typeof text !== 'string' || !text.trim()) {
                throw BaseError.BadRequest("Message text is required");
            }

            const updatedMessage = await messageModel.findOneAndUpdate(
                {_id: messageId, sender: req.user._id},
                {text: text.trim(), editedStatus: true},
                {returnDocument: 'after'},
            );
            if (!updatedMessage) throw BaseError.BadRequest("Message not found");

            res.status(200).json({message: 'Message updated successfully', updatedMessage});
        } catch (error) {
            next(error);
        }
    }

    async updateEmail(req, res, next) {
        try {
            const email = typeof req.body?.email === 'string'
                ? req.body.email.trim().toLowerCase()
                : '';
            const otp = typeof req.body?.otp === 'string' ? req.body.otp.trim() : '';
            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !/^\d{6}$/.test(otp)) {
                throw BaseError.BadRequest("A valid email and six-digit OTP are required");
            }

            const existingUser = await userModel.findOne({email, _id: {$ne: req.user._id}});
            if (existingUser) throw BaseError.BadRequest("Email is already in use");

            const result = await mailService.verifyOtp(email, otp);

            if (result) {
                const userId = req.user._id;
                const user = await userModel.findByIdAndUpdate(userId, {email}, {returnDocument: 'after', runValidators: true});

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
            const deletedMessage = await messageModel.findOneAndDelete({
                _id: messageId,
                sender: req.user._id,
            });
            if (!deletedMessage) throw BaseError.BadRequest("Message not found");

            res.status(200).json({deletedMessage, message: "Message deleted successfully"});
        } catch (error) {
            next(error);
        }
    }

    async deleteUser(req, res, next) {
        try {
            const userId = req.user._id;
            await userModel.findByIdAndDelete(userId);
            await userModel.updateMany({contacts: userId}, {$pull: {contacts: userId}});
            await messageModel.deleteMany({$or: [{sender: userId}, {receiver: userId}]});

            res.status(200).json({message: "User deleted successfully"});
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new UserController();
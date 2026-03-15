const authController = require('../controllers/auth.controller');
const userController = require('../controllers/user.controller');

const router = require('express').Router();

require('express-group-routes');

router.group('/auth', (route) => {
    route.post('/login', authController.login);
    route.post('/verify', authController.verify);
});

router.group('/user', (route) => {
    route.get('/messages/:contactId', userController.getMessages);
    route.get('/contacts', userController.getContacts);

    route.post('/message', userController.createMessage);
    route.post('/message-read', userController.messageRead);
    route.post('/contact', userController.createContact);
    route.post('/reaction', userController.createReaction);
    route.post('/send-otp', userController.sendOtp);

    route.put('/profile', userController.updateProfile);
    route.put('/message/:messageId', userController.updateMessage);
    route.put('/email', userController.updateEmail);

    route.delete('/message/:messageId', userController.deleteMessage);
    route.delete('/', userController.deleteUser);
});

module.exports = router;
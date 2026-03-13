const router = require('express').Router();

require('express-group-routes');

router.group('/auth', (route) => {
    route.get('/login', (req, res) => {
        res.send('Login page');
    });

    route.get('/verify', (req, res) => {
        res.send('Verify page');
    });
});

module.exports = router;
require("dotenv").config()

const passport = require("passport")
const express = require("express")
const router = express.Router()

const CLIENT_DOMAIN = process.env.CLIENT_DOMAIN

const google = (route) => {
    router.get('/',
        passport.authenticate('google', { scope: ['profile', 'email'] }));

    router.get('/redirect',
        passport.authenticate('google', { failureRedirect: '/redirect' }),
        function (req, res) {
            return res.redirect(CLIENT_DOMAIN);
        });

    return route.use("/auth/google", router)
}

module.exports = google
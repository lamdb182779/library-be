require("dotenv").config()

const passport = require("passport")
const session = require("express-session")

const SESSION_SECRET = process.env.SESSION_SECRET

const sess = (app) => {
    const store = session.MemoryStore()

    app.use(session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false,
        },
        store
    }))

    app.use(passport.initialize())
    app.use(passport.session())
    app.use(passport.authenticate('session'))

    passport.serializeUser(function (user, cb) {
        console.log("check before");

        process.nextTick(function () {
            cb(null, user);
        });
    });

    passport.deserializeUser(function (user, cb) {
        console.log("check after");
        process.nextTick(function () {
            return cb(null, user);
        });
    });

}

module.exports = sess
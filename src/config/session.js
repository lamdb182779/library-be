require("dotenv").config()

const passport = require("passport")
const session = require("express-session")
const RedisStore = require('connect-redis')(session);
const redis = require('redis');

const SESSION_SECRET = process.env.SESSION_SECRET
const REDIS_URL = process.env.REDIS_URL

const redisClient = redis.createClient({
    url: REDIS_URL
});

const sess = (app) => {

    app.use(session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false,
        },
        store: new RedisStore({ client: redisClient })
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
require("dotenv").config()

const passport = require("passport")
const session = require("express-session")
const connect = require("connect-redis")
const { createClient } = require('redis');

const SESSION_SECRET = process.env.SESSION_SECRET
const REDIS_HOST = process.env.REDIS_HOST
const REDIS_PORT = process.env.REDIS_PORT

const redisClient = createClient();
const RedisStore = connect(session)

let redisStore = new RedisStore({ host: REDIS_HOST, port: REDIS_PORT, client: redisClient })

const sess = (app) => {

    app.use(session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false,
        },
        store: redisStore
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
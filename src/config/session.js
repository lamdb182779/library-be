require("dotenv").config()

const passport = require("passport")
const session = require("express-session")
const Sequelize = require('sequelize');


const SESSION_SECRET = process.env.SESSION_SECRET
const SequelizeStore = require('connect-session-sequelize')(session.Store)
const sequelize = new Sequelize(`${process.env.DB_URL}?sslmode=no-verify`, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
})

const sess = (app) => {
    const myStore = new SequelizeStore({
        db: sequelize,
    })

    app.use(session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false,
        },
        store: myStore
    }))

    myStore.sync()

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
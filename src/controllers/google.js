require("dotenv").config()

const passport = require("passport")
const GoogleStrategy = require('passport-google-oauth20').Strategy
const db = require("../models")
const { where } = require("sequelize")

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const GOOGLE_CLIENT_CALLBACK = process.env.GOOGLE_CLIENT_CALLBACK

const loginWithGoogle = () => passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: GOOGLE_CLIENT_CALLBACK
},
    async function (accessToken, refreshToken, profile, cb) {
        try {
            const [user, created] = await db.User.findOrCreate({
                where: {
                    id: profile.id,
                },
                defaults: {
                    id: profile.id,
                    email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null,
                    name: `${profile.name.familyName} ${profile.name.givenName}`,
                    image: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null,
                }
            })
            return cb(null, user)
        } catch (error) {
            console.log("Cannot find or create user! Error: ", error)
        }
    }
));

module.exports = loginWithGoogle
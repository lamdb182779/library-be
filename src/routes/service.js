const express = require("express")
const router = express.Router()

const service = (route) => {

    router.get("/check-login", (req, res) => {
        if (req.user) {
            console.log("log in");

            return res.status(200).json({
                message: "Logged in!",
                user: req.user
            })
        }
        else {
            console.log("log in");
            return res.status(200).json({
                message: "Not logged in!"
            })
        }
    })

    router.get("/logout", (req, res) => {
        req.logout(error => {
            if (error) {
                console.log("Cannot log out! Error:", error)
                return res.status(500).json({
                    message: "Server error!"
                })
            }
            return res.status(200).json({
                message: "Log out successfully!"
            })
        })
    })

    return route.use("/", router)
}

module.exports = service
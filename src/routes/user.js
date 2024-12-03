const express = require("express")
const router = express.Router()

const { getAllUser, changeRole } = require("../controllers/user")
const { firstRank, secondRank } = require("../middleware/permission-action")

const user = (route) => {
    router.get("/", secondRank, getAllUser)
    router.put("/role/:id", firstRank, changeRole)
    return route.use("/user", router)
}

module.exports = user
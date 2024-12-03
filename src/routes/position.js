const express = require("express")
const router = express.Router()

const { addPosition, getPositions, updatePosition, getPositionById } = require("../controllers/position")
const { secondRank } = require("../middleware/permission-action")

const position = (route) => {
    router.all("*", secondRank)
    router.put("/:id", updatePosition)
    router.post("/", addPosition)
    router.get("/", getPositions)
    router.get("/:id", getPositionById)
    return route.use("/position", router)
}

module.exports = position
const express = require("express")
const router = express.Router()

const { addPublisher, getPublishers, updatePublisher, getPublisherById } = require("../controllers/publisher")
const { secondRank } = require("../middleware/permission-action")

const publisher = (route) => {
    router.all("*", secondRank)
    router.put("/:id", updatePublisher)
    router.post("/", addPublisher)
    router.get("/", getPublishers)
    router.get("/:id", getPublisherById)
    return route.use("/publisher", router)
}

module.exports = publisher
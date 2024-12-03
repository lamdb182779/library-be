const express = require("express")
const publisher = require("./publisher")
const google = require("./google")
const service = require("./service")
const user = require("./user")
const author = require("./author")
const book = require("./book")
const tag = require("./tag")
const position = require("./position")
const loan = require("./loan")
const search = require("./search")
const self = require("./readerRoute")

const router = express.Router()

const route = (app) => {
    self(router)
    search(router)
    loan(router)
    tag(router)
    book(router)
    author(router)
    user(router)
    google(router)
    service(router)
    position(router)
    publisher(router)

    return app.use('/', router)
}

module.exports = route
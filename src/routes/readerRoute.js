const express = require('express');
const ReaderController = require('../controllers/readerController');

const router = express.Router();

const self = (route) => {

    // Xem danh sách sách đã mượn
    router.get('/borrowed', ReaderController.viewBorrowedBooks);

    // Gia hạn sách
    router.put('/renew', ReaderController.renewBook);

    // Tra cứu sách
    router.get('/search-books', ReaderController.searchBooks);
    return route.use("/", router)
}

module.exports = self;

const db = require('../models')
const { Op } = require("sequelize")

const bookReaderController = {
  // Thêm phiếu mượn
  addBookReader: async (req, res) => {
    const { readerId, bookId, startedDate, duration } = req.body;

    try {
      const book = await db.Book.findByPk(bookId, {
        include: [
          {
            model: db.User,
            attributes: ['id'],
            through: { attributes: [] },
          },
        ]
      });
      if (!book) {
        return res.status(404).json({ message: 'Không tìm thấy sách!' });
      }
      if (book.quantity - book.Users.length < 1) {
        return res.status(500).json({ message: 'Không còn sách này trong kho!' });
      }

      const reader = await db.User.findByPk(readerId);
      if (!reader) {
        return res.status(404).json({ message: 'Người dùng không tồn tại!' });
      }

      if (duration > 30 * 6) return res.status(500).json({ message: 'Không thể mượn quá 180 ngày!' });
      if (duration < 1) return res.status(500).json({ message: 'Không thể mượn ít hơn 1 ngày!' });

      const expiredDate = new Date(startedDate);
      expiredDate.setDate(expiredDate.getDate() + duration);

      const [newBookReader, created] = await db.BookReader.findOrCreate({
        where: {
          bookId,
          readerId,
          [Op.or]: [
            { startedDate },
            { isReturned: false }
          ]
        },
        defaults: {
          bookId,
          readerId,
          startedDate,
          expiredDate,
        }
      });
      if (!created) return res.status(500).json({ message: 'Người đọc này đã mượn cuốn sách này!' })
      return res.status(201).json({ message: 'Thêm phiếu mượn thành công!' });
    } catch (error) {
      console.log("Cannot add loan! Error: ", error)
      return res.status(500).json({ message: 'Lỗi server!' });
    }
  },

  getLoans: async (req, res) => {
    try {
      let { page = 1, pagesize = 10, keyword = "", type = "book", filter } = req.query;

      page = parseInt(page) || 1
      pagesize = parseInt(pagesize) || 10
      pagesize = pagesize > 25 ? 25 : pagesize
      type = type || "book"
      let where = { name: { [Op.iLike]: `%${keyword.trim()}%` } }
      let find = {}
      switch (filter) {
        case "returned": {
          find = { isReturned: true }
          break
        }
        case "borrowing": {
          find = { isReturned: false }
          break
        }
        case "expired": {
          find = { isReturned: false, expiredDate: { [Op.lt]: new Date() } }
          break
        }
        default: {
          find = {}
          break
        }
      }

      const condition = (t) => (keyword?.trim() && type === t) ? where : {}

      let skip = (page - 1) * pagesize
      let { count, rows } = await db.BookReader.findAndCountAll({
        distinct: true,
        where: find,
        limit: pagesize,
        offset: skip,
        include: [
          {
            model: db.Book,
            where: condition("book"),
            attributes: ['id', 'name'],
          },
          {
            model: db.User,
            where: condition("reader"),
            attributes: ['id', 'name'],
          },
        ],
      })


      return res.status(200).json({
        message: "Get data successfully!",
        result: rows,
        pageCount: Math.ceil(count / pagesize)
      })
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Lỗi server!" });
    }
  },

  // Trả sách
  returnBook: async (req, res) => {
    const { readerId, bookId, startedDate } = req.body;

    try {
      const bookReader = await db.BookReader.findOne({
        where: { readerId, bookId, startedDate }
      });

      if (!bookReader) {
        return res.status(404).json({ message: 'Không tìm thấy phiếu mượn' });
      } else {
        if (bookReader.isReturned) {
          bookReader.isReturned = false;
          bookReader.returnedDate = null;
        } else {
          bookReader.isReturned = true;
          bookReader.returnedDate = new Date();
        }
        await bookReader.save();
        return res.status(200).json({ message: bookReader.isReturned ? 'Trả sách thành công' : "Hoàn tác thành công" });
      }
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi khi trả sách', error });
    }
  },
  deleteLoan: async (req, res) => {
    const { readerId, bookId, startedDate } = req.body;

    try {
      const bookReader = await db.BookReader.findOne({
        where: { readerId, bookId, startedDate }
      });

      if (!bookReader) {
        return res.status(404).json({ message: 'Không tìm thấy phiếu mượn' });
      } else {
        await bookReader.destroy();
        return res.status(200).json({ message: bookReader.isReturned ? 'Trả sách thành công' : "Hoàn tác thành công" });
      }
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi khi trả sách', error });
    }
  },

};

module.exports = bookReaderController;

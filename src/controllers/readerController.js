const db = require('../models');
const { Op } = require('sequelize');

const ReaderController = {
  // Xem danh sách sách đã mượn
  viewBorrowedBooks: async (req, res) => {
    const user = req.user
    if (!user) return res.status(500).json({ message: "Cần đăng nhập để thực hiện thao tác này!" })
    let { page = 1, pagesize = 10 } = req.query;

    page = parseInt(page) || 1
    pagesize = parseInt(pagesize) || 10
    pagesize = pagesize > 25 ? 25 : pagesize
    let skip = (page - 1) * pagesize
    try {
      let { count, rows } = await db.BookReader.findAndCountAll({
        where: { readerId: user.id },
        distinct: true,
        limit: pagesize,
        offset: skip,
        include: [
          {
            model: db.Book,
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
      return res.status(500).json({ message: 'Lỗi khi lấy danh sách sách đã mượn', error });
    }
  },

  // Gia hạn sách
  renewBook: async (req, res) => {
    const user = req.user
    if (!user) return res.status(500).json({ message: "Cần đăng nhập để thực hiện thao tác này!" })
    const { bookId } = req.body;

    try {
      const bookReader = await db.BookReader.findOne({
        where: { bookId, readerId: user.id, isReturned: false }
      });

      if (!bookReader) {
        return res.status(404).json({ message: 'Không tìm thấy giao dịch mượn sách' });
      }

      // Kiểm tra nếu sách đã đc gia hạn trước đó
      if (bookReader.isExtended) {
        return res.status(500).json({ message: 'Không thể gia hạn thêm' });
      }

      // Gia hạn sách thêm 7 ngày
      const newExpiredDate = new Date(bookReader.expiredDate);
      newExpiredDate.setDate(newExpiredDate.getDate() + 7);
      bookReader.expiredDate = newExpiredDate;
      bookReader.isExtended = true;
      await bookReader.save();

      return res.status(200).json({ message: 'Gia hạn sách thành công', bookReader });
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi khi gia hạn sách', error });
    }
  },

  // Tra cứu sách
  searchBooks: async (req, res) => {
    const { bookName, authorName, publisherName } = req.query;

    try {
      const books = await db.Book.findAll({
        where: {
          ...(bookName && { name: { [Op.iLike]: `%${bookName}%` } })
        },
        include: [
          {
            model: Author,
            where: authorName ? { name: { [Op.iLike]: `%${authorName}%` } } : {},
            attributes: ['name'],
            through: { attributes: [] }
          },
          {
            model: Publisher,
            where: publisherName ? { name: { [Op.iLike]: `%${publisherName}%` } } : {},
            attributes: ['name']
          }
        ]
      });

      return res.status(200).json(books);
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi khi tìm kiếm sách', error });
    }
  }
};

module.exports = ReaderController;


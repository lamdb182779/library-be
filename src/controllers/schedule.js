const db = require('../models');
const { Op } = require("sequelize")
const { addDays, startOfDay, endOfDay, format } = require('date-fns');
const nodeMailer = require("nodemailer")

const MAIL_ACCOUNT = process.env.MAIL_ACCOUNT
const MAIL_PASSWORD = process.env.MAIL_PASSWORD

const transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
        user: MAIL_ACCOUNT,
        pass: MAIL_PASSWORD,
    },
});

// Hàm gửi email
const sendEmail = async (email, book, date) => {
    try {
        const info = await transporter.sendMail({
            from: MAIL_ACCOUNT,
            to: email,
            subject: 'Sắp đến hạn trả sách',
            text: `Bạn có hạn trả cuốn sách "${book} vào ngày ${format(new Date(date), "dd/MM/yyyy")}"`,
            html: `<b>Bạn có hạn trả cuốn sách "${book}" vào ngày ${format(new Date(date), "dd/MM/yyyy")}</b>`,
        });

        console.log('Email sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

exports.mailSchedule = async () => {

    // Tính thời gian ngày kia (start và end để lọc chính xác)
    const dayAfterTomorrowStart = startOfDay(addDays(new Date(), 2));
    const dayAfterTomorrowEnd = endOfDay(addDays(new Date(), 2));

    const bookReaders = await db.BookReader.findAll({
        where: {
            expiredDate: {
                [Op.between]: [dayAfterTomorrowStart, dayAfterTomorrowEnd]
            },
            isReturned: false
        },
        include: [
            {
                model: db.Book,
                attributes: ['id', 'name']
            },
            {
                model: db.User,
                attributes: ['id', 'name', "email"]
            }
        ]
    });

    bookReaders.forEach(bookReader => {
        sendEmail(bookReader.User.email, bookReader.Book.name || "", bookReader.expiredDate)
    });
}
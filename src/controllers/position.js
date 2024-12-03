const db = require('../models');

// Thêm vị trí
exports.addPosition = async (req, res) => {
    try {
        // Kiểm tra xem name có được cung cấp và hợp lệ hay không
        if (!req.body.name || typeof req.body.name !== 'string' || req.body.name.trim() === '') {
            console.log('Position name must be valid');
            return res.status(400).json({ message: 'Position name must be valid' });
        }

        const { name } = req.body;


        const newPosition = await db.Position.create({
            name
        });

        return res.status(201).json({ message: 'Position created successfully', position: newPosition });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Lỗi server!" });
    }
};

// Xóa vị trí
exports.deletePosition = async (req, res) => {
    try {
        const { id } = req.params;

        // Kiểm tra xem vị trí với `id` có tồn tại không
        const position = await db.Position.findByPk(id);

        if (!position) {
            return res.status(404).json({ message: 'Position not found' });
        }

        // Xóa vị trí
        await position.destroy();

        return res.status(200).json({ message: 'Position deleted successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Lỗi server!" });
    }
};

// Cập nhật vị trí
exports.updatePosition = async (req, res) => {
    try {
        const { id, name } = req.body;

        // Kiểm tra xem vị trí với `id` có tồn tại không
        const position = await db.Position.findByPk(id);

        if (!position) {
            return res.status(404).json({ message: 'Position not found' });
        }

        // Kiểm tra tính hợp lệ của tên nếu có
        if (name && (typeof name !== 'string' || name.trim() === '')) {
            return res.status(400).json({ message: 'Position name must be a valid, non-empty string' });
        }

        // Cập nhật thông tin mới cho vị trí
        position.name = name || position.name;

        await position.save();

        // Trả về phản hồi thành công với thông tin vị trí cập nhật
        return res.status(200).json({ message: 'Position updated successfully', position });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Lỗi server!" });
    }
};

// Lấy thông tin vị trí theo ID hoặc tất cả nếu không có ID
exports.getPositions = async (req, res) => {
    try {

        const positions = await db.Position.findAll();
        return res.status(200).json({
            message: "Get data successfully!",
            result: positions
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Lỗi server!" });
    }
};

exports.getPositionById = async (req, res) => {
    try {
        const { id } = req.params;

        const position = await db.Position.findByPk(id);

        if (!position) {
            return res.status(404).json({ message: 'Position not found' });
        }

        return res.status(200).json({
            message: "Get data successfully!",
            result: position
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Lỗi server!" });
    }
};

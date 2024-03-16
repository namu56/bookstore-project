const pool = require('../../mariadb'); // db 모듈
const { StatusCodes } = require('http-status-codes');
const { QueryErrorHandler } = require('../middlewares/errorHandler');

const addLike = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        // 좋아요 추가
        const { bookId } = req.params;
        const { userId } = req.decodedJwt;

        let sql = 'INSERT INTO likes (user_id, book_id) VALUES (?, ?)';
        let values = [userId, bookId];
        const [results] = await connection.query(sql, values);

        return res.status(StatusCodes.OK).json(results);
    } catch (err) {
        throw err;
    } finally {
        connection.release();
    }
};

const removeLike = async (req, res) => {
    // 좋아요 취소
    const connection = await pool.getConnection();
    try {
        const { bookId } = req.params;
        const { userId } = req.decodedJwt;

        let sql = 'DELETE FROM likes WHERE user_id = ? AND book_id = ?';
        let values = [userId, bookId];
        const [results] = await connection.query(sql, values);

        return res.status(StatusCodes.OK).json(results);
    } catch (err) {
        throw err;
    } finally {
        connection.release();
    }
};

module.exports = { addLike, removeLike };

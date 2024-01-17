const conn = require('../mariadb'); // db 모듈
const { StatusCodes } = require('http-status-codes');
const { QueryErrorHandler } = require('../utils/errorHandler');
const jwt = require('jsonwebtoken');

// (카테고리 별, 신간 여부) 전체 도서 목록 조회
const getAllBooks = (req, res) => {
    let allBooksRes = {};

    let { categoryId, news, limit, currentPage } = req.query;

    let offset = limit * (currentPage - 1);

    let sql = `SELECT SQL_CALC_FOUND_ROWS 
                    *, 
                    (SELECT count(*) FROM likes WHERE books.id = book_id)AS likes 
               FROM books`;
    let values = [];

    if (categoryId && news) {
        sql += ' WHERE category_id = ? AND published_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()';
        values.push(categoryId);
    } else if (categoryId) {
        sql += ' WHERE category_id = ?';
        values.push(categoryId);
    } else if (news) {
        sql += ' WHERE published_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()';
    }

    sql += ' LIMIT ? OFFSET ?';
    values.push(parseInt(limit), offset);

    conn.query(sql, values, (err, results) => {
        if (err) throw new QueryErrorHandler('쿼리 에러 발생');
        if (results.length) {
            allBooksRes.books = results;
        } else {
            return res.status(StatusCodes.NOT_FOUND).end();
        }
    });

    sql = `SELECT found_rows()`;

    conn.query(sql, values, (err, results) => {
        if (err) throw new QueryErrorHandler('쿼리 에러 발생');

        let pagination = {
            currentPage: parseInt(currentPage),
            totalCount: results[0]['found_rows()'],
        };

        allBooksRes.pagination = pagination;
        return res.status(StatusCodes.OK).json(allBooksRes);
    });
};

const getBookDetail = (req, res) => {
    // 로그인 상태가 아니면, liked 빼고 보내준다
    // 로그인 상태이면, liked 추가해서 보내준다

    const { bookId } = req.params;
    const { userId } = req.decodedJwt;

    let likedColumn = userId ? `,EXISTS (SELECT * FROM likes WHERE user_id=? AND book_id=?) AS liked` : ``;
    let sql = `SELECT *,
                          (SELECT count(*) FROM likes WHERE books.id = book_id )AS likes
                          ${likedColumn}
                   FROM books
                   LEFT JOIN category ON books.category_id = category.id
                   WHERE books.id=?;`;
    let values = userId ? [userId, bookId, bookId] : [bookId];
    conn.query(sql, values, (err, results) => {
        if (err) throw new QueryErrorHandler('쿼리 에러 발생');

        if (results[0]) {
            return res.status(StatusCodes.OK).json(results[0]);
        } else {
            return res.status(StatusCodes.NOT_FOUND).end();
        }
    });
};

module.exports = { getAllBooks, getBookDetail };

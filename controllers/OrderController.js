const pool = require('../mariadb'); // db 모듈
const { StatusCodes } = require('http-status-codes');
const { QueryErrorHandler } = require('../middlewares/errorHandler');
const jwt = require('jsonwebtoken');

// 주문하기
const order = async (req, res) => {
    const conn = await pool.getConnection();
    const { cartItems, delivery, totalQuantity, totalPrice, firstBookTitle } = req.body;

    try {
        // delivery 테이블 삽입
        let sql = `INSERT INTO delivery (address, receiver, contact) VALUES (?, ?, ?)`;
        let values = [delivery.address, delivery.receiver, delivery.contact];
        const [deliveryResult] = await conn.query(sql, values);
        let deliveryId = deliveryResult.insertId;

        // orders 테이블 삽입
        sql = `INSERT INTO orders (user_id, delivery_id, book_title, total_quantity, total_price)
               VALUES (?, ?, ?, ?, ?)`;
        values = [authorization.userId, deliveryId, firstBookTitle, totalQuantity, totalPrice];
        const [orderResult] = await conn.query(sql, values);
        let orderId = orderResult.insertId;

        // 결제할 도서정보 장바구니에서 가져오기
        sql = `SELECT * FROM cartItems WHERE id IN (?)`;
        const [getCartItems] = await conn.query(sql, [cartItems]);

        // orderedBook 테이블 삽입
        sql = `INSERT INTO orderedBook (order_id, book_id, quantity) VALUES ?;`;
        values = [];
        getCartItems.forEach((cartItem) => {
            values.push([orderId, cartItem.book_id, cartItem.quantity]);
        });
        const [orderedBookResult] = await conn.query(sql, [values]);

        // 결제된 도서 장바구니 삭제
        sql = `DELETE FROM cartItems WHERE id IN (?)`;
        const [removeCartItemsResult] = await conn.query(sql, [cartItems]);

        return res.status(StatusCodes.OK).json(removeCartItemsResult);
    } catch (err) {
        throw new QueryErrorHandler('쿼리 에러 발생');
    }
};

// 주문 목록 조회
const getOrders = async (req, res) => {
    const { userId } = req.decodeJwt;

    let sql = `SELECT 
                        orders.id,
                        created_at,
                        address,
                        receiver,
                        contact,
                        book_title,
                        total_quantity,
                        total_price
                    FROM orders
                    LEFT JOIN delivery 
                    ON orders.delivery_id = delivery.id
                    WHERE user_id = ?`;
    let [getOrdersResult] = await conn.query(sql, userId);

    return res.status(StatusCodes.OK).json(getOrdersResult);
};

// 주문 상세 조회
const getOrderDetail = async (req, res) => {
    const { orderId } = req.params;

    let sql = `SELECT 
                        book_id,
                        title,
                        author,
                        price,
                        quantity
                    FROM orderedBook
                    LEFT JOIN books 
                    ON orderedBook.book_id = books.id
                    WHERE order_id = ? AND ;`;
    let [getOrderDetailResult] = await conn.query(sql, [orderId]);

    return res.status(StatusCodes.OK).json(getOrderDetailResult);
};

module.exports = { order, getOrders, getOrderDetail };

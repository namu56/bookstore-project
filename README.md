## 📚 BOOKSTORE

> 온라인 도서 구매 사이트

## 📌 프로젝트 소개

> 도서 검색과 구매 가능한 가상의 온라인 서점입니다.

## 💽 ERD 구조

![book_store_erd](https://github.com/namu56/book-store-project/assets/107787137/8c4fe903-971e-436c-8191-05c8025ef68c)

## 📬 API 명세

| Domain       | URL                                                                                           | HTTP Method | Description                 |
| ------------ | --------------------------------------------------------------------------------------------- | ----------- | --------------------------- |
| **User**     | /signup                                                                                       | `POST`      | 회원가입                    |
|              | /login                                                                                        | `POST`      | 로그인                      |
|              | /reset                                                                                        | `POST`      | 비밀번호 초기화 요청        |
|              | /reset                                                                                        | `PUT`       | 비밀번호 초기화             |
| **Book**     | /books?categoryId={categoryId}&news={boolean}limit={page당 도서 수}&currentPage={현재 페이지} | `GET`       | 전체 도서 조회              |
|              | /books/{bookId}                                                                               | `GET`       | 개별 도서 조회              |
| **Category** | /category                                                                                     | `GET`       | 카테고리 전체 조회          |
| **Like**     | /likes/{bookId}                                                                               | `POST`      | 좋아요 추가                 |
|              | /likes/{bookId}                                                                               | `DELETE`    | 좋아요 취소                 |
| **Cart**     | /cart                                                                                         | `POST`      | 장바구니 담기               |
|              | /cart                                                                                         | `GET`       | (선택한) 장바구니 목록 조회 |
|              | /cart/cartItemId                                                                              | `DELETE`    | 장바구니 아이템 삭제        |
| **Order**    | /orders                                                                                       | `POST`      | 주문하기                    |
|              | /orders                                                                                       | `GET`       | 주문 내역 조회              |
|              | /orders/{orderId}                                                                             | `GET`       | 주문 상세 상품 조회         |

## 📌 주요 기능

### 회원가입

-   사용자는 이메일과 비밀번호를 통해 회원가입을 진행할 수 있습니다.

### 로그인

-   회원가입 때 사용한 이메일과 비밀번호로 로그인할 수 있습니다.

### 비밀번호 관리

-   비밀번호를 잊어버린 경우, 이메일을 통해 비밀번호 초기화를 요청할 수 있습니다.
-   사용자는 아내 받은 사항에 따라 비밀번호를 설정하여 초기화할 수 있습니다.

### 도서 조회 기능

-   사용자는 전체 도서 목록을 조회할 수 있습니다.
-   최근 추가된 신간 도서 목록을 조회할 수 있습니다.
-   특정 카테고리에 속하는 도서 목록을 필터링하여 조회할 수 있습니다.
-   각 조회에서 페이지당 설정된 수의 도서만을 조회할 수 있습니다.
-   사용자는 각 도서에 대한 상세 정보를 볼 수 있습니다.
-   로그인한 회원은 도서에 대해 '좋아요'를 누를 수 있으며 취소할 수 있습니다. 비로그인 사용자는 이 기능을 이용할 수 없습니다.

### 장바구니

-   사용자는 원하는 도서를 장바구니에 추가할 수 있습니다.
-   장바구니에 담긴 도서 목록을 확인하고, 원하는 도서만을 선택해 주문할 수 있습니다.
-   사용자는 장바구니에서 더 이상 원하지 않는 도서를 선택하여 삭제할 수 있습니다.

### 주문

-   사용자는 배송정보를 입력하고 장바구니에서 선택한 도서들에 대해 주문할 수 있습니다.
-   사용자가 주문한 도서의 주문 내역을 조회할 수 있습니다.

## ✅ 개선 사항

## 🛠️ 기술 스택

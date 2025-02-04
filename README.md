
# Test Cases for CRUD API
# 1) Test Cases for products

    | Operation | HTTP Method | URL                         | Request Body                     | Expected Status |
    |-----------|-------------|-----------------------------|----------------------------------|-----------------|
    | Create    | POST        | /products                   | {                                | 201 Created     |
    | Read      | GET         | /products/{id} or /products | "name": "Alligator food",        | 200 OK          |
    | Update    | PUT         | /products/{id}              | "description": "Very nice food", | 200 OK          |
    | Delete    | DELETE      | /products/{id}              | "price": 30.99,                  | 204 No Content  |
    |           |             |                             | "stock": 50,                     |                 |
    |           |             |                             | "category": "Reptilians"         |                 |
    |           |             |                             | }                                |                 |

# 2) Test Cases for Register and Login

## 2.1) Register

    | Operation | HTTP Method | URL       | Request Body                         | Expected Status |
    |-----------|-------------|-----------|--------------------------------------|-----------------|
    | Register  | POST        | /register | {                                    | 201 Created     |
    |           |             |           | "email": "azabraza061005@gmail.com", |                 |
    |           |             |           | "password": "aza061005",             |                 |
    |           |             |           | "first_name": "Baiken",              |                 | 
    |           |             |           | "last_name": "Ashimov",              |                 |
    |           |             |           | "address": "Astana",                 |                 |
    |           |             |           | "phone": "+77072050305"              |                 |
    |           |             |           | }                                    |                 |

## 2.2) Login

    | Operation | HTTP Method | URL    | Request Body                         | Expected Status |
    |-----------|-------------|--------|--------------------------------------|-----------------|
    | Login     | POST        | /login | {                                    | 200 OK          |
    |           |             |        | "email": "azabraza061005@gmail.com", |                 |
    |           |             |        | "password": "aza061005"              |                 |
    |           |             |        | }                                    |                 |


# 3) Create Subscription

    | Operation | HTTP Method | URL                 | Request Body         | Expected Status |
    |-----------|-------------|---------------------|----------------------|-----------------|
    | Create    | POST        | /subscriptions      | {                    | 201 Created     |
    | Delete    | DELETE      | /subscriptions/{id} | "user_id": 1,        | 204 No Content  |
    |           |             |                     | "interval_days": 30, |                 |
    |           |             |                     | "type": "premium",   |                 |
    |           |             |                     | "status": "active"   |                 |
    |           |             |                     | }                    |                 |

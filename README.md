
# Test Cases for CRUD API
# 1) Test Cases for products

    | Operation | HTTP Method | URL                         | Expected Status |
    |-----------|-------------|-----------------------------|-----------------|
    | Create    | POST        | /products                   | 201 Created     |
    | Read      | GET         | /products/{id} or /products | 200 OK          |
    | Update    | PUT         | /products/{id}              | 200 OK          |
    | Delete    | DELETE      | /products/{id}              | 204 No Content  |

    Request Body:
    {
    "name": "Dog's food",
    "description": "Very nice food",
    "price": 30.99,
    "stock": 10,
    "category": "dogs",
    "subcategory": "feed",
    "type": "dry"
    }

# 2) Test Cases for Register and Login

## 2.1) Register

    | Operation | HTTP Method | URL       | Expected Status |
    |-----------|-------------|-----------|-----------------|
    | Register  | POST        | /register | 201 Created     |

    Request Body:
    {
    "email": "azabraza061005@gmail.com",
    "password": "aza061005",
    "first_name": "Baiken",
    "last_name": "Ashimov",
    "address": "Astana",
    "phone": "+77072050305"
    }


## 2.2) Login

    | Operation | HTTP Method | URL    | Expected Status |
    |-----------|-------------|--------|-----------------|
    | Login     | POST        | /login | 200 OK          |

    Request Body:
    {
    "email": "azabraza061005@gmail.com",
    "password": "aza061005"
    }



# 3) Create Subscription

    | Operation | HTTP Method | URL                 | Expected Status |
    |-----------|-------------|---------------------|-----------------|
    | Create    | POST        | /subscriptions      | 201 Created     |
    | Delete    | DELETE      | /subscriptions/{id} | 204 No Content  |

    Request Body:
    {
    "user_id": 1,
    "interval_days": 30,
    "type": "premium",
    "status": "active"
    }


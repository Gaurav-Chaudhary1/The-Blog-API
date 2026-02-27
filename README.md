# Advanced Blog API (MERN Stack Backend)

A robust, production-ready RESTful API built with Node.js, Express, and MongoDB. This backend powers a complete blogging platform, featuring secure JWT authentication, advanced search and filtering, dynamic pagination, and a deeply nested commenting system.

## 🚀 Key Features

* **Advanced Data Validation:** All incoming client requests are strictly sanitized and validated using **Zod** middleware before hitting the database, preventing bad data and malicious payloads.
* **Complex MongoDB Querying:** Implements "Google-style" multi-word search (`$regex`), faceted filtering (`$in`, `$or`, `$and`), and dynamic sorting.
* **Optimized Pagination:** Offset pagination (`skip` and `limit`) calculates total pages and documents dynamically for smooth frontend integration.
* **Relational Database Modeling:** Uses Mongoose ObjectIds and Two-Way Binding to efficiently link Users, Posts, and Comments.
* **Nested Threaded Comments:** Includes a customized subdocument architecture allowing users to reply directly to specific comments (`$push`).
* **Bulletproof Authentication:** Secure registration and login using **Bcrypt** for password hashing and **JWT** (JSON Web Tokens) for stateless authentication.

## 🛠️ Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB & Mongoose
* **Validation:** Zod
* **Authentication:** JWT & Bcrypt
* **Security/Middleware:** CORS, custom error-handling and token-verification middleware.

## ⚙️ Installation & Setup

1. **Clone the repository:**
   git clone https://github.com/Gaurav-Chaudhary1/The-Blog-API.git
   cd your-repo-name
   
2. **Install dependencies:**
   npm install
   
3. **Environment Variables:**
   Create a .env file in the root directory and add the following:
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key 
4. **Start the server:**
  # For standard node execution
    node server.js

  # Or if you use nodemon for development
  npm run dev  


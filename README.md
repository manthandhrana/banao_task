# USER AUTHENTICATION API

This project provides a **User Authentication System** using `Node.js`, `Express`, and `MongoDB`. APIs include **Registration**, **Login**, and **Password Reset**.

---

## BUILT WITH
- Node.js: JavaScript runtime
- Express: Web framework
- MongoDB: Database
- bcryptjs: Password hashing
- jsonwebtoken: JWT authentication
- nodemailer: Email service
---

## INSTALLATION

1. **Clone the Repository**
   ```bash
   git clone https://github.com/manthandhrana/banao_task.git
   cd banao_task
   ```
2. **npm install**
   ```bash
   npm install
   ```
2. **Set Environment Variables Create a .env file with:**
   ```bash
   secretKey=YOUR_SECRET_KEY\
   newSecretKey=YOUR_NEW_SECRET_KEY
   MONGO_URI=YOUR_MONGODB_URI
   ```
2. **Run the Server**
   ```bash
   node app.js
   ```

# API ENDPOINTS

### 1. REGISTER USER
**POST** `/api/register`  
Registers a new user with username, email, and password.

**Request Body:**
```bash
{
  "username": "your_username",
  "email": "your_email@example.com",
  "password": "your_password"
}
```

**Response Body:**
```bash
{
  "msg": "User registered successfully"
}
```


### 2. LOGIN USER
**POST** `/api/login`  
Logs in a user with username and password.

**Request Body:**
```bash
{
  "username": "your_username",
  "password": "your_password"
}
```

**Response Body:**
```bash
{
  "msg": "User Login successfully"
}
```


### 3. FORGET PASSWORD
**POST** `/api/forget-password`  
Sends a password reset link to the user's email.

**Request Body:**
```bash
{
  "email": "your_email@example.com"
}
```

**Response Body:**
```bash
{
  "msg": "Password reset link sent"
}
```

### 4. RESET PASSWORD
**POST** `/api/reset-password/:token`  
Resets the user's password using a token.

**Request Body:**
```bash
{
  "password": "new_password"
}
```

**Reponse Body:**
```bash
{
  "msg": "Password reset successful"
}
```



# RUN IN DEVELOPMENT MODE
Use nodemon for live reload during development:

**How To Run Globally:**
```bash
npm install -g nodemon
nodemon index.js
```




🔒 Web Application Vulnerability Analysis

📌 Project Overview

This project involves analyzing the security vulnerabilities of a simple web application developed in Node.js. The application simulates a task management system and includes user authentication, session management, and task handling. The goal is to identify and address security issues to improve the application's robustness.

🎯 Objectives

🕵️‍♂️ Identify Security Vulnerabilities:

Analyze the code to detect authentication flaws, XSS (Cross-Site Scripting), SQL injections, and session management issues.

🔧 Enhance Application Reliability: Identify unhandled errors and propose solutions.

🚀 Suggest Improvements: Recommend security measures to enhance stability.

🎨 Develop Modern Static Files:

Create user-friendly HTML, CSS, and JavaScript pages.

📋 Document Vulnerabilities & Errors: 

Explain security flaws and propose mitigation strategies.

📊 Implement a Functional Dashboard: Provide an intuitive UI for task management using Vanilla JavaScript.

🏗️ Application Structure

📂 Routes

Public Routes

POST /register ➜ User registration.

POST /login ➜ User authentication.

GET /public/login.html & GET /public/register.html ➜ Access login & signup pages.

Protected Routes (Requires authentication)

GET /dashboard ➜ Access user dashboard.

POST /add ➜ Add a new task.

GET /tasks ➜ Retrieve user tasks.

DELETE /tasks/:id ➜ Delete a task.

GET /logout ➜ Logout user.

⚠️ Security Vulnerabilities Identified

🔑 Authentication & Password Management

❌ Issue: Passwords stored in plain text.

✅ Solution: Use bcrypt to hash passwords before storage.

const bcrypt = require('bcrypt');
const hashedPassword = await bcrypt.hash(password, 10);
data.users.push({ username, password: hashedPassword });

🚪 Session Management


❌ Issue: Weak session handling can lead to unauthorized access.

✅ Solution: Implement secure cookies and enforce session expiration.

✍️ Input Validation & Sanitization


❌ Issue: Lack of user input validation.

✅ Solution: Use input sanitization libraries like express-validator to prevent XSS & SQL injections.

const { body, validationResult } = require('express-validator');
app.post('/register', [
    body('username').trim().isLength({ min: 3 }),
    body('password').isStrongPassword()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json(errors.array());
    // Proceed with registration...
});

📦 Dependencies & Installation

🚀 Technologies Used

Backend: Node.js, Express.js

Frontend: HTML, CSS, JavaScript

Security Enhancements: bcrypt, express-validator

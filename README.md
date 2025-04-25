# Learning Management System API

A comprehensive RESTful API for an e-learning platform enabling course management, student enrollment, exam systems, and certification.

## Features

### 🔐 Authentication & Security
- JWT-based authentication
- Role-based access control (Student, Instructor)
- Password reset flow with email verification
- Protected routes with middleware

### 📚 Course Management
- Course creation with media uploads
- Student enrollment system
- Progress tracking
- Certificate generation
- Course search and filtering

### 🎓 Instructor Features
- Create/update/delete courses
- Exam creation and management
- Student progress monitoring
- Media-rich content support

### 📝 Student Features
- Course enrollment
- Review and rate courses
- Progress tracking
- Exam submission
- Certificate requests
- Profile management

## API Endpoints

### Authentication Routes
| Method | Endpoint                | Description                      | Access       |
|--------|-------------------------|----------------------------------|--------------|
| POST   | `/auth/login`           | User login                       | Public       |
| POST   | `/auth/signup`          | New user registration            | Public       |
| POST   | `/auth/forgot-password` | Initiate password reset          | Public       |
| PUT    | `/auth/reset-password`  | Complete password reset          | Public       |
| PUT    | `/auth/update-password` | Update password                  | Authenticated|

### Course Routes
| Method | Endpoint                                 | Description                      | Access              |
|--------|------------------------------------------|----------------------------------|---------------------|
| GET    | `/course/get-my-courses`                 | Get instructor's courses         | Instructor          |
| GET    | `/course/get-course/:course_id`          | Get course details               | Authenticated       |
| GET    | `/course/get-enrolled-courses`           | Get student's enrolled courses   | Student             |
| GET    | `/course/request-certificate/:course_id` | Request course certificate       | Student             |
| POST   | `/course/create-course`                  | Create new course                | Instructor          |
| POST   | `/course/enroll/:course_id`              | Enroll in course                 | Student             |
| POST   | `/course/update-progress/:course_id`     | Update course progress           | Student             |
| PATCH  | `/course/update-course/:course_id`       | Update course details            | Instructor          |

### Review Routes
| Method | Endpoint                           | Description                | Access          |
|--------|------------------------------------|----------------------------|-----------------|
| POST   | `/review/review-course/:course_id` | Create new review          | Student         |
| PUT    | `/review/update-review/:course_id` | Update review              | Student         |
| DELETE | `/review/delete-review/:course_id` | Delete review              | Student         |

### Exam Routes
| Method | Endpoint                     | Description                | Access              |
|--------|------------------------------|----------------------------|---------------------|
| GET    | `/exam/get-exam/:course_id`  | Get course exams           | Authenticated       |
| POST   | `/exam/create-exam`          | Create new exam            | Instructor          |
| PUT    | `/exam/update-exam/:exam_id` | Update exam                | Instructor          |
| DELETE | `/exam/delete-exam/:exam_id` | Delete exam                | Instructor          |
| POST   | `/exam/submit-exam/:exam_id` | Submit exam answers        | Student             |

### User Routes
| Method | Endpoint                      | Description                | Access            |
|--------|-------------------------------|----------------------------|-------------------|
| GET    | `/user/get-user`              | Get current user           | Optional Auth     |
| GET    | `/user/get-profile/:username` | Get user profile           | Public            |
| PUT    | `/user/update-user`           | Update user profile        | Authenticated     |
| PUT    | `/user/delete-user`           | Delete user account        | Authenticated     |

## Authentication

Protected routes use JWT authentication with role-based access:

- `protectRoute`: Middleware for authenticated routes
- `isAuthenticated`: Middleware for optional authentication
- `handleMediaUpload`: Middleware for handling media uploads
- `restrictTo`: Middleware for handling role based authentication

## Media Support

The API supports media uploads for:

- Profile pictures
- Course video upload
- Handled through the `handleMediaUpload` middleware

## Security Features

- Email verification for new accounts
- Multi-factor authentication support
- Secure password reset flow
- Protected routes with authentication middleware
- Media upload validation and processing

## Error Handling

The API implements comprehensive error handling for:

- Authentication errors
- Resource not found
- Invalid requests
- Server errors
- Media upload failures

## Getting Started

1. Clone the repository
2. Install dependencies
3. Configure environment variables
4. Run the development server

## License

**MIT License**

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

## Contact

For support or contributions, please contact:

📧 Email: [adetunjimarvellous09@gmail.com](mailto:adetunjimarvellous09@gmail.com)  
📝 GitHub Issues: [https://github.com/dLuxKid/E-Learning-API/issues](https://github.com/dLuxKid/E-Learning-API/issues)  
💼 LinkedIn: [Adetunji Marvellous](https://linkedin.com/in/marvellousadetunji)

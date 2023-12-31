# Unleashed API - Node.js, Express, and Prisma

🙌Welcome to the Unleashed API project. This API allows you to create, read, update, and delete blog articles through a simple and reliable API.

## Description

This project is built using the following technologies:

- **Node.js**: A powerful JavaScript runtime environment.
- **Express**: A lightweight Node.js framework for building web applications and APIs.
- **Prisma**: An Object-Relational Mapping (ORM) that simplifies database interactions.
- **Database**: This project is designed to work with various databases supported by Prisma (e.g., PostgreSQL, MySQL).

## Features

- Create, read, update, and delete blog articles.
- Manage article categories.
- User authentication and role-based authorization.
- Clean and easy-to-use JSON format for the API.
- User management, including registration and login.
- Strong data validation and error handling.

## Getting Started

To get started with the Unleashed API project, follow these steps:

1. Clone the repository to your local machine
2. Install the required dependencies using 
    > `npm install`
3. Configure environment variables according to your database settings and other preferences. Copy the .env.example file to .env and customize its contents.
4. Run the project 
    > `npm start`

## Usage
This project provides various API endpoints for managing blog articles and users. Please refer to the **[API Documentation](https://documenter.getpostman.com/view/24497915/2s9YJXZ575)** for more information on usage and available endpoints.

## Authentication
This project uses authentication with JSON Web Tokens (JWT). Make sure to obtain a token after logging in and include the token in the header every time you access endpoints that require authentication.

## Testing
The project includes unit tests to ensure reliability and security. You can run the tests using the following command 
> `npm test`

## Deployment
This API can be deployed on various platforms, including cloud services like AWS, Heroku, or your own server infrastructure. Ensure you configure environment variables and settings correctly for production deployment.

<br>

### Enjoy managing your blog through the Unleashed API!👋
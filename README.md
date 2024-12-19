# Digital Onboarding System Implementation Guide

This guide outlines how to set up and run the system locally on your machine using Node.js, NPM (Node Package Manager), and Nodemon to facilitate development.

## Prerequisites
Before you begin, ensure you have the following installed:

- Node.js - A JavaScript runtime environment. 
- NPM - Node Package Manager, comes bundled with Node.js. 
- A code editor (like VSCode, Sublime Text, etc.) for development.

To verify if Node.js is installed, run:
node -v

To verify NPM:
npm -v

## Step-by-Step Installation

### 1. Clone the Repository
Start by cloning the repository from GitHub:
git clone https://github.com/Alpha0705/Guest-OnBoarding-System cd digital-onboarding-system

### 2. Install Dependencies
Navigate to the project directory and install the required dependencies:
npm install


### 3. Create a .env File
Create an environment file (`.env`) to store sensitive information such as database connection strings, secret keys, etc. Use a sample configuration:
DATABASE_URL=your-database-url 
SECRET_KEY=your-secret-key


### 4. Set Up Your Database
Ensure your database is configured to handle user data, form submissions, and other required data. Update your connection settings in the `.env` file as needed.

## Run the Server

### 1. Start the Server with Nodemon
Run your application using Nodemon to automatically restart the server on code changes:
npm run dev


### 2. Access the Application
The server will start on `http://localhost:3000`. You can access the system through this URL to begin development, testing, and configuring your Digital Onboarding System.

## Project Structure Overview
Here's a quick overview of the project structure:

├── node_modules/                    # Installed dependencies 
├── public/                          # Public assets and files 
│ └── uploads/                       # Uploaded files 
    └── css/                         # CSS stylesheets 
    └── styles.css 
├── views/                           # EJS view templates 
    ├── admin-guest.ejs 
    ├── edit-guest.ejs 
    ├── guest-form.ejs
    ├── guest-landing.ejs 
    ├── guests.ejs 
    ├── hotels.ejs 
    ├── login.ejs 
    ├── thankyou.ejs 
    └── view-guest.ejs 
├── .env                            # Environment file
├── package-lock.json               # Lock file for dependencies 
├── package.json                    # Project dependencies and scripts
└── server.js                       # Main server entry point

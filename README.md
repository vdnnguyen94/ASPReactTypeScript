# Trading Web Application

Welcome to my Trading Web Application! Below is an overview of the application's architecture, technologies used, and instructions for setting up and deploying the application.
https://tradingwebasp.azurewebsites.net/
## Overview

My Trading Web Application is built using ASP.NET on the server-side with AzureSQL for database management. On the client-side, I have utilized Node React with TypeScript. The application allows users to perform stock trading activities and manage their transactions efficiently.
## Technologies Used

- ASP.NET Core
- Entity Framework Core
- Azure SQL Database
- TypeScript
- React TSX
- Node TS

### APIs

I utilize third-party APIs for fetching live stock prices and other indicators for trading. Due to cost considerations, I have opted for the Yahoo Finance API, which provides live stock prices using stock symbols, and the Google API for retrieving stock names.

## Server

### Technologies Used
- ASP.NET for developing APIs using controllers with Entity Framework for CRUD operations and data management
- AzureSQL for database storage

### Features
- Provides RESTful APIs for user management, stock trading, and transaction records
- Easy data migration with Entity Framework for updating data schema

## Client

### Technologies Used
- Node React with TypeScript for front-end development
- React for state management and user interface development

### Features
- Challenges with type checking due to TypeScript
- Responsive user interface to handle user responses and errors effectively
- Utilizes React for state management, including user input validation before sending data to the server
- Implements cookie-based authentication to reduce the need for repeated sign-ins

#### BuyPage Component
The BuyPage component allows users to search for stock quotes, view their current portfolio, and purchase stocks. 
It provides real-time stock data, calculates total costs, and ensures users have sufficient funds before completing transactions.

#### PageTransaction Component
The PageTransaction component displays a user's transaction history, including details such as transaction type, stock symbol, shares, 
unit price, and total values. It also shows the user's current balance with an option to toggle its visibility.
#### Login Component
The Login component provides a simple user authentication interface, allowing users to enter their username and password to log in. 
It displays success or error messages based on the login attempt and redirects the user to the main page upon successful authentication.

# <span style="color:red">START APPLICATION</span>

### For Client

1. Install Node Modules: npm install
2. If Using Visual Studio:
- Simply click start or use `dotnet run`

### For Deployment

1. After installing node modules, build the app: yarn build
2. Configure the startup file to point to the `dist` index HTML for deployment.

**Note**: Configuration files or startup instructions might be highlighted in red for better visibility.

---

Feel free to reach out if you have any questions or need further assistance!

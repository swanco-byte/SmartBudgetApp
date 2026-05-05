# SmartBudgetApp

## Project Overview
SmartBudgetApp is a personal budgeting application designed to help users manage their finances effectively. It offers features that allow users to track income, expenses, and savings, providing valuable insights into their spending habits and financial health.

## Features
- User account creation and authentication
- Dashboard for an overview of finances
- Track income and expenses
- Categorization of expenses
- Budget planning and monitoring
- Graphs and charts for visual representation of financial data
- Multi-currency support

## Tech Stack
- **Front-end:** React, Redux
- **Back-end:** Node.js, Express
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)

## Installation Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/swanco-byte/SmartBudgetApp.git
   cd SmartBudgetApp
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in a `.env` file.
4. Start the application:
   ```bash
   npm start
   ```

## Project Structure
```
SmartBudgetApp/
├── client/            # Front-end code
├── server/            # Back-end code
└── README.md          # Documentation
```  

## API Documentation Links
- [User Authentication API](https://api.smartbudgetapp.com/docs/auth)
- [Expense Tracking API](https://api.smartbudgetapp.com/docs/expenses)
- [Budget Management API](https://api.smartbudgetapp.com/docs/budgets)

## Development Setup
- Ensure you have Node.js and MongoDB installed.
- Run the back-end server and front-end client simultaneously for development using separate terminals:
  ```bash
  cd server
  npm start
  ```
  ```bash
  cd client
  npm start
  ```

## Testing
- To run tests, use the command:
  ```bash
  npm test
  ```

## Deployment Information
- The application is hosted on Heroku.
- To deploy changes, push to the `main` branch and Heroku will automatically build and deploy the app.

## Contribution Guidelines
1. Fork the repository.
2. Create a new branch for your feature/bug fix:
   ```bash
   git checkout -b feature-name
   ```
3. Make your changes and commit them:
   ```bash
   git commit -m 'Add some feature'
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

---  
For any further information or issues, feel free to contact the repository maintainers.
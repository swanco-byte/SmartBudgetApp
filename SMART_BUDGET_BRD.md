# Business Requirement Document (BRD) for SMART Budget Application

## Executive Summary
The SMART Budget Application is designed to help salaried employees manage their personal finances effectively. The application focuses on creating a user-friendly environment where users can track their income, expenses, and savings goals. Through various financial insights, the app aims to promote better financial habits among its users.

## Functional Requirements
1. **User Registration and Authentication:**  
   - Users can register using email and password.  
   - Users can log in and log out securely.

2. **Dashboard:**  
   - A personalized dashboard displaying financial status, including income, expenses, and savings.

3. **Expense Tracking:**  
   - Users can input expenses and categorize them (e.g., food, utilities, entertainment).

4. **Income Tracking:**  
   - Users can track various sources of income, like salary, bonuses, and other earnings.

5. **Budget Planning:**  
   - Users can set monthly budgets for different expense categories.

6. **Reports and Analytics:**  
   - Generation of reports detailing spending patterns and savings over time.

## Technical Architecture
- **Frontend:** React.js  
- **Backend:** Java Spring Boot  
- **Database:** PostgreSQL  
- **Hosting:** AWS (Amazon Web Services)

## Database Schema
- **Users Table:**  
  - `user_id`: INT, Primary Key  
  - `email`: VARCHAR  
  - `password`: VARCHAR  
  - `created_at`: TIMESTAMP  

- **Expenses Table:**  
  - `expense_id`: INT, Primary Key  
  - `user_id`: INT, Foreign Key  
  - `amount`: DECIMAL  
  - `category`: VARCHAR  
  - `date`: TIMESTAMP  

- **Income Table:**  
  - `income_id`: INT, Primary Key  
  - `user_id`: INT, Foreign Key  
  - `amount`: DECIMAL  
  - `source`: VARCHAR  
  - `date`: TIMESTAMP  

## API Specifications
- **User API:**  
  - POST /api/users/register  
  - POST /api/users/login  

- **Expenses API:**  
  - GET /api/expenses  
  - POST /api/expenses  
  - DELETE /api/expenses/{id}  

- **Income API:**  
  - GET /api/income  
  - POST /api/income  
  - DELETE /api/income/{id}  

## Scalability Strategy
- **Horizontal Scaling:** Add more instances of service as the user base grows.
- **Load Balancing:** Implement load balancers to distribute traffic effectively.

## Security Requirements
- **Data Encryption:** Use TLS for data in transit, and encrypt sensitive data at rest.
- **Authentication:** Use JWT (JSON Web Tokens) for secure user sessions.
- **Data Validation:** Ensure proper validation on all inputs to prevent SQL injection and XSS attacks.

## Testing Strategy
- **Unit Testing:** Test individual components of the application using JUnit and Mockito.
- **Integration Testing:** Ensure that different modules work together seamlessly.
- **User Acceptance Testing:** Gather feedback from actual users before full-scale deployment.

## Implementation Roadmap
1. **Phase 1:** Requirement Gathering and Analysis  
2. **Phase 2:** Design and Development  
3. **Phase 3:** Testing and Quality Assurance  
4. **Phase 4:** Deployment and User Training

## Key Performance Indicators (KPIs)
- User Engagement: Daily active users over total registered users.
- Budget Adherence: Percentage of users staying within their budget.
- Monthly Growth Rate: New user registrations per month.
- Retention Rate: Percentage of users returning to the app after 30 days.

--- 
Document Date: 2026-05-05 09:30:04

# Bash Coffee Shop Frontend ☕️
![Build Status](https://github.com/rsrfay/Bash-Frontend/actions/workflows/webpack.yml/badge.svg) 
[![Coverage](https://img.shields.io/badge/Coverage-97%25-brightgreen.svg)](https://github.com/rsrfay/Bash-Frontend/blob/f5cdda.../README.md)

This project is the frontend application for the **Bash Coffee Shop**, designed to provide a dynamic, user-friendly web-based interface for customers to browse the menu, search for items, sort by preferences, and customize orders before adding them to the cart.

This project was developed by using Next.js, performed unit tests using Jest, and implemented automated UI tests using Robot Framework.

## Features

### Menu Features (ECHO Group Contribution)
- **Search:** Customers can search for menu items by name.
- **Filter:** Customers can filter menu items by category and hot/cold option.
- **Sort:** Customers can sort menu items by:
  - Price (Low to High)
  - Price (High to Low)
- **Add-Ons:** Customers can customize their drinks with optional add-ons.
- **Cart Integration:** Users can add items to the cart with selected customizations.

### Menu Features (Noppo Group Contribution)
- **Update Items In Cart**: Customer can add update and delete for each menu items in cart
- **Payment**:

### User Experience
- Fully responsive design for both mobile and desktop users.
- "No results found" feedback for invalid search queries.
- Real-time updates to cart items and pricing.

---

## Tech Stack
- **Framework:** [Next.js](https://nextjs.org/) for server-side rendering and efficient page routing.
- **State Management:** React Context API for handling cart and menu state.
- **Testing Framework:** [Jest](https://jestjs.io/) for unit testing.
- **Automation:** Robot Framework for E2E testing.
- **Styling:** CSS Modules for component-level styling.

---

## Prerequisites

Before you begin, ensure you have met the following requirements:
- **Node.js:** v18.x or higher
- **npm/yarn:** Installed for package management
- **GitHub CLI (Optional):** For cloning the repository and managing branches

---

## Installation and Setup

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/rsrfay/bash-frontend.git
   cd bash-frontend
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

4. **Run Unit Tests:**
   ```bash
   npm test
   ```

5. **Run End-to-End Tests:**
   (Requires Robot Framework and Selenium)
   ```bash
   robot tests/
   ```

---

## Folder Structure

```
bash-frontend/
├── public/               # Static files (images, fonts)
├── src/
│   ├── app/              # Next.js app directory
│   ├── components/       # Reusable components
│   ├── context/          # Context providers for state management
│   ├── lib/              # Helper functions and utilities
│   └── styles/           # CSS modules
├── __tests__/            # Unit tests directory
├── automated_test_cases/ # Automated UI test cases
├── coverage/             # Jest coverage reports
└── README.md             # Project documentation
```

---

## Testing
**Promotion Handling Test Suite**  
**Partitioning the Characteristics**  
| Characteristic    | b1       | b2       | b3       |  
|--------------------|----------|----------|----------|  
| C1 = Promotion ID | Valid    | Expired  | Invalid  |  
| C2 = Cart Items   | None     | Single   | Multiple |  

**Testable Functions**  
**Method**: `fetchPromotions()`  
- **Parameters**: None  
- **Return Type**: `Array` of promotion objects  
- **Return Value**: Successfully retrieves and returns promotion data.  
- **Exceptional Behavior**: Handles API errors or invalid responses gracefully.  

**Interface-Based Characteristics**  
**Combining Partitions to Define Test Requirements (ACOC):**  
| Test Case | Promotion ID | Cart Items | Expected Outcome                                   |  
|-----------|--------------|------------|---------------------------------------------------|  
| T1        | Valid        | None       | Promotions are fetched but no discount applied.   |  
| T2        | Valid        | Single     | Promotion is successfully applied.                |  
| T3        | Valid        | Multiple   | Promotion is successfully applied to multiple items. |  
| T4        | Expired      | None       | Promotions are fetched but no discount applied.   |  
| T5        | Expired      | Single     | Promotion is not applied due to expiration.       |  
| T6        | Expired      | Multiple   | Promotion is not applied due to expiration.       |  
| T7        | Invalid      | None       | Promotions are fetched but invalid promotion is ignored. |  
| T8        | Invalid      | Single     | Promotion is ignored as it is invalid.            |  
| T9        | Invalid      | Multiple   | Promotion is ignored as it is invalid.            |  


## CartPage Test Suite
**Interface-Based Characteristics**

| **Test Case** | **Cart Items Present** | **Select Mode** | **Quantity Change Trigger** | **Expected Outcome**                                                                 |
|---------------|-------------------------|-----------------|-----------------------------|-------------------------------------------------------------------------------------|
| **T1**        | Empty                  | `false`         | None                        | Total is `0`. No items to display. Quantity buttons are disabled.                  |
| **T2**        | Non-empty              | `false`         | Increase                    | Item quantity is incremented. Total updates accordingly. Select mode UI is inactive. |
| **T3**        | Non-empty              | `true`          | Increase                    | Item quantity is incremented. Select mode UI is active. Total updates accordingly.  |
| **T4**        | Non-empty              | `false`         | Decrease                    | Item quantity is decreased (if greater than 1). Total updates. Select mode UI is inactive. |
| **T5**        | Large cart             | `false`         | Decrease                    | Item quantity is decreased (if greater than 1). Total 


**Combining the Partitions (PWC)**
**By combining these partitions, we create test cases to validate the component's behavior.**

| Test Case | Cart Items Present | Select Mode | Quantity Change Trigger | Expected Outcome |
|-----------|--------------------|-------------|-------------------------|------------------|
| **T1**    | Empty              | `false`     | None                    | Total is `0`. No items to display. Quantity buttons are disabled. |
| **T2**    | Non-empty          | `false`     | Increase                | Item quantity is incremented. Total updates accordingly. Select mode UI is inactive. |
| **T3**    | Non-empty          | `true`      | Increase                | Item quantity is incremented. Select mode UI is active. Total updates accordingly. |
| **T4**    | Non-empty          | `false`     | Decrease                | Item quantity is decreased (if greater than 1). Total updates. Select mode UI is inactive. |
| **T5**    | Large cart         | `false`     | Decrease                | Item quantity is decreased (if greater than 1). Total updates for a large cart. Select mode UI is inactive. |




### Unit Tests
Unit tests are written in Jest and can be run with:
```bash
npm test
```
Coverage reports will be generated under the `coverage/` directory.

### End-to-End Tests
End-to-end tests are written in the Robot Framework. To execute the tests:
1. Install [Robot Framework](https://robotframework.org/) by following this guideline [How To Install Robot Framework](https://docs.robotframework.org/docs/getting_started/testing)
2. Run:
   ```bash
   robot tests/
   ```

---

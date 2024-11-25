# Bash Coffee Shop Frontend ☕️

The project is a web-based frontend application built using Next.js for Bash Coffee Shop, offering a dynamic user interface for customers to browse, search, and customize orders before adding them to the cart. It also focuses on payment processes, including order summary, promotion, discount, membership points, and total price. 

This project was developed by using Next.js, performed unit tests using Jest, and implemented automated UI tests using Robot Framework.

## Features

### Menu Features (Noppo Group Contribution) 
- **Order Summary:** Customers can view a summary of their order, including items, quantities, and pricing. 
- **Update Items In Cart:** Customers can edit the details of their order, such as adjusting quantities or removing items, and have those changes reflected in real time. 
- **Promotions and Discounts:** Customers can apply relevant promotions to their orders, which will automatically update the total price. 
- **Membership Point Tracking:** Customers can collect membership points based on their purchases, which can be used for future discounts or rewards. 
- **Total Price Calculation:** The application will accurately calculate the total price of the customer's order, factoring in any discounts or promotions. 

### User Experience
- Real-time order summary updates as customers make changes 
- Clear display of original price, discounts, and final discounted price from using promotion or discount 
- Prominent display of the customer's membership point balance 
- Real-time total price calculation and updates as customers apply discounts 

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
# **TestSuite 1: Promotion Handling Test Suite**

## **Partitioning the Characteristics**

| **Characteristic** | **b1**    | **b2**     | **b3**     |
|---------------------|-----------|------------|------------|
| C1 = Promotion ID  | Valid     | Expired    | Invalid    |
| C2 = Cart Items    | None      | Single     | Multiple   |

## **Testable Functions**

**Method**: `isPromotionValid()`  
- **Parameters**: `promotion, memberInfo.Points, memberInfo`  
- **Return Type**: `boolean`  
- **Return Value**: Returns `true` if the promotion is valid under the given conditions, `false` if the promotion is invalid.  
- **Exceptional Behavior**: Handles invalid inputs gracefully. For invalid date formats or invalid promotion IDs, it returns `false` and may log a warning.

---

## **Interface-Based Characteristics**

### **Combining Partitions to Define Test Requirements (ACOC):**
**Number of Test Cases = 3 x 3 = 9**

| **Test Case** | **Promotion ID** | **Cart Items** | **Expected Outcome**                                                   |
|---------------|------------------|----------------|-------------------------------------------------------------------------|
| T1            | Valid            | None           | Promotions are applied, but no discount is applied (empty cart).        |
| T2            | Valid            | Single         | Promotion is valid and can be applied to the single item.               |
| T3            | Valid            | Multiple       | Promotion is valid and can be applied to multiple items.                |
| T4            | Expired          | None           | Promotion is invalid due to expiration; no discount applied.            |
| T5            | Expired          | Single         | Promotion is invalid due to expiration; no discount applied.            |
| T6            | Expired          | Multiple       | Promotion is invalid due to expiration; no discount applied.            |
| T7            | Invalid          | None           | Promotion is invalid (unknown ID); no discount applied.                 |
| T8            | Invalid          | Single         | Promotion is invalid (unknown ID); no discount applied.                 |
| T9            | Invalid          | Multiple       | Promotion is invalid (unknown ID); no discount applied.                 |

---

# **TestSuite 2: Discount Calculation Test Suite**

## **Partitioning the Characteristics**

| **Characteristic**          | **b1**    | **b2**    | **b3**     |
|------------------------------|-----------|-----------|------------|
| **C1 = Promotion Rule**      | Rule 1    | Rule 2    | Rule 3     |
| **C2 = Cart Items**          | None      | Single    | Multiple   |

## **Testable Functions**

**Method**: `calculateDiscount()`  
- **Parameters**: `selectedPromotion, cartItems, membershipPoints, pointsRedeemed, memberInfo`  
- **Return Type**: `Number`  
- **Return Value**: Returns the correct discount amount based on the selected promotion and cart items.

### **Combining Partitions for ECC**
**Number of Test Cases = Maximum value from largest characteristic = 3**

| **Test Case** | **Promotion Rule** | **Cart Items** | **Expected Outcome**                                          |
|---------------|--------------------|----------------|---------------------------------------------------------------|
| T1            | Rule 1            | None           | No discount applied because cart is empty.                    |
| T2            | Rule 2            | Single         | Discount is calculated for the single item based on Rule 2.   |
| T3            | Rule 3            | Multiple       | Discount is applied as per Rule 3 for multiple items.          |

---

# **TestSuite 3: Membership Check Test Suite**

## **Functionality-Based Characteristics**

| **Characteristic** | **b1**               | **b2**                | **b3**                      |
|---------------------|----------------------|-----------------------|-----------------------------|
| C1 = Membership     | Valid Membership    | Invalid Membership    | Not Applicable (No Number) |

## **Testable Functions**

**Method**: `handleMembershipCheck()`  
- **Parameters**: `unformattedTel, setMemberInfo, setMembershipPoints, setTelChecked, setTel, baseURL`  
- **Return Type**: `boolean`  
- **Return Value**: Returns `true` if the membership is valid, `false` otherwise.

### **Combining Partitions using ACOC**
**Number of Test Cases = 3**

| **Test Case** | **Membership Validity (C1)** | **Expected Outcome**                        |
|---------------|-----------------------------|--------------------------------------------|
| T1            | Valid Membership (b1)      | MembershipCheckResult.Valid                |
| T2            | Invalid Membership (b2)    | MembershipCheckResult.Invalid              |
| T3            | No Telephone Number (b3)   | MembershipCheckResult.Empty                |




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

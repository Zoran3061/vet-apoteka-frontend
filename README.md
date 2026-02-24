#  Vet Apoteka – Frontend

Frontend application for the "Veterinary Pharmacy" system built using the Angular framework.

This application provides:
- User registration and login
- Product browsing
- Product search
- Add to cart functionality
- Order creation
- Admin panel for managing products and users
- Warehouse panel for managing orders

---

##  Technologies

- Angular
- TypeScript
- SCSS
- RxJS
- JWT Authentication
- REST API communication with Spring Boot backend

---

##  System Roles

###  Customer
- Browse products
- Search products
- Add products to cart
- Place orders

###  Admin
- Add new products
- Edit products
- Delete products
- Manage users

###  Warehouse
- View orders
- Change order status (NEW, PROCESSING, READY, SHIPPED, CANCELED)

---

##  Currency

All prices are displayed in RSD (Serbian Dinar).

---

#  Screenshots

##  Login Page
<img width="1101" height="833" alt="Screenshot 2026-02-13 091011" src="https://github.com/user-attachments/assets/79aec309-c3ef-4bdd-bef3-5136aeac1c09" />


##  Customer – Homepage
<img width="1897" height="914" alt="Screenshot 2026-02-24 155907" src="https://github.com/user-attachments/assets/3a658afe-47f8-40d0-863b-d62403a57b63" />


##  Admin – Product Panel
<img width="1895" height="912" alt="Screenshot 2026-02-24 160005" src="https://github.com/user-attachments/assets/d08da421-fad9-42c4-b6fa-e02a4bc39709" />


##  Admin – User Panel
<img width="1895" height="915" alt="Screenshot 2026-02-24 160016" src="https://github.com/user-attachments/assets/3c927e83-0b8c-4e0d-8f27-052a30d37be0" />


##  Warehouse – Orders Panel
<img width="1895" height="913" alt="Screenshot 2026-02-24 155940" src="https://github.com/user-attachments/assets/374339a8-c6bb-404d-9f78-92a7f4452946" />

---

##  Running the Application

1. Install dependencies:
  - npm install
2. Start the application:
  -ng serve
3. The application will be available at:
  - http://localhost:4200

---

##  Backend

This frontend connects to a Spring Boot backend available in a separate repository:

Vet-Apoteka-Backend

The backend must be running at:
  - http://localhost:8080

---

##  Author

Zoran Višić  
Metropolitan University  
Final Thesis Project – Veterinary Pharmacy System

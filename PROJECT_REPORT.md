# 📋 E-Commerce MERN Stack — Project Report

## System Design Documentation

---

## 3.2 System Design

### 3.2.1 Architectural Design

Architectural Design is a process for identifying the sub-systems making up a system and the framework for sub-system control and communication. The E-Commerce MERN application follows a **three-tier architecture** pattern separating the Presentation, Business, and Data tiers.

#### MVC Architecture

The system follows the **Model-View-Controller (MVC)** architectural pattern, which separates the application into three interconnected components:

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│    ┌──────────┐          ┌───────────────────┐                      │
│    │          │ Request  │    Controller      │         ┌─────────┐ │
│    │  Client  │────────▶ │  (Express Routes   │────────▶│         │ │
│    │ (Browser)│          │   & Controllers)   │         │ MongoDB │ │
│    │          │◀──────── │                    │◀────────│         │ │
│    └──────────┘ Response └───────────────────┘         └─────────┘ │
│         │                    ▲         │                            │
│         │                    │         │                            │
│         │                    │         ▼                            │
│         │              ┌───────┐  ┌──────────┐                     │
│         └─────────────▶│ View  │  │  Model   │                     │
│                        │(React │  │(Mongoose │                     │
│                        │  JSX) │  │ Schemas) │                     │
│                        └───────┘  └──────────┘                     │
│                                                                     │
│                          Container                                  │
└─────────────────────────────────────────────────────────────────────┘
```

| Component      | Technology        | Description                                                                 |
|----------------|-------------------|-----------------------------------------------------------------------------|
| **Model**      | Mongoose Schemas  | Defines data structure — `userModel`, `productModel`, `orderModel`, `subscriberModel` |
| **View**       | React.js (JSX)    | Frontend UI — `Home`, `Collection`, `Product`, `Cart`, `Login`, `PlaceOrder`, `Orders` |
| **Controller** | Express.js Routes | Handles business logic — `userController`, `productController`, `orderController`, `cartController` |

---

#### Three-Tier Architectural Design

```
 ┌──────────────────────────────────────────────┐
 │            Presentation Tier                  │──────────┐
 │                                               │          │
 │   • HTML / CSS / Tailwind CSS                 │        Client
 │   • React.js (Frontend + Admin Panel)         │    (User Browser)
 │   • React Router DOM                          │          │
 │   • Axios (HTTP Client)                       │──────────┘
 └──────────────────────┬───────────────────────┘
                        │
                        │  HTTP Requests (REST API)
                        │
                        ▼
 ┌──────────────────────────────────────────────┐
 │              Business Tier                    │──────────┐
 │                                               │          │
 │   • Node.js (Runtime)                         │        Server
 │   • Express.js (Web Framework)                │   (Backend API)
 │   • JWT Authentication                        │          │
 │   • Bcrypt.js (Password Hashing)              │          │
 │   • Multer (File Upload)                      │          │
 │   • Cloudinary (Image Storage)                │──────────┘
 └──────────────────────┬───────────────────────┘
                        │
                        │  Mongoose ODM
                        │
                        ▼
 ┌──────────────────────────────────────────────┐
 │                Data Tier                      │──────────┐
 │                                               │          │
 │   • MongoDB (NoSQL Database)                  │       Database
 │   • Mongoose (Database Connection & ODM)      │        Server
 │   • Cloudinary (Image CDN)                    │          │
 │                                               │──────────┘
 └──────────────────────────────────────────────┘
                        │
                        ▼
                ┌──────────────┐
                │              │
                │   Database   │
                │  (MongoDB    │
                │   Atlas)     │
                │              │
                └──────────────┘
```

---

### 3.2.2 Database Schema Design

A database named **e-commerce** is created in MongoDB and it contains four collections, each for **User**, **Product**, **Order**, and **Subscriber**. The User collection contains various fields with `_id` being its unique identifier generated by MongoDB. The Product collection stores product details with images hosted on Cloudinary. The Order collection stores order information with `userId` as a reference to the User collection. The Subscriber collection stores newsletter subscriptions.

```
┌─────────────────────────────────┐
│             User                │
├─────────────────────────────────┤
│  _id (PK)        ObjectId      │
│  name             String       │
│  email            String       │
│  password         String       │
│  cartData         Object       │
│  createdAt        Timestamp    │
│  updatedAt        Timestamp    │
└────────┬────────────────────────┘
         │
         │ 1 : N (One User → Many Orders)
         │
         ▼
┌─────────────────────────────────┐
│             Order               │
├─────────────────────────────────┤
│  _id (PK)        ObjectId      │
│  userId (FK)     String        │
│  items            Array        │
│  amount           Number       │
│  address          Object       │
│  status           String       │
│  paymentMethod    String       │
│  payment          Boolean      │
│  createdAt        Timestamp    │
│  updatedAt        Timestamp    │
└─────────────────────────────────┘


┌─────────────────────────────────┐
│            Product              │
├─────────────────────────────────┤
│  _id (PK)        ObjectId      │
│  name             String       │
│  description      String       │
│  price            Number       │
│  image            Array        │
│  category         String       │
│  subCategory      String       │
│  sizes            Array        │
│  bestseller       Boolean      │
│  createdAt        Timestamp    │
│  updatedAt        Timestamp    │
└─────────────────────────────────┘


┌─────────────────────────────────┐
│          Subscriber             │
├─────────────────────────────────┤
│  _id (PK)        ObjectId      │
│  email            String       │
│  createdAt        Timestamp    │
│  updatedAt        Timestamp    │
└─────────────────────────────────┘
```

#### Relationships

| Relationship          | Type  | Description                                           |
|-----------------------|-------|-------------------------------------------------------|
| User → Order          | 1 : N | One user can place multiple orders                   |
| User → Cart (embedded)| 1 : 1 | Cart data is embedded inside the User document       |
| Order → Product (ref) | N : M | Each order contains an array of product items        |
| User → Subscriber     | 1 : 1 | A user may optionally subscribe to the newsletter    |

---

### 3.2.3 Entity-Relationship (E-R) Diagram

The ER Diagram represents the entities in the E-Commerce system and illustrates the relationships between them. It acts as a blueprint for database design, providing a clear picture of the data model's structure and organization.

```
                        ┌──────────┐
                        │   name   │
                        └────┬─────┘
                             │
  ┌──────────┐         ┌────┴─────┐         ┌──────────┐
  │  email   │─────────│   User   │─────────│ password │
  └──────────┘         └────┬─────┘         └──────────┘
                            │
                  ┌─────────┼─────────┐
                  │                   │
              ◇ Places           ◇ Has
                  │                   │
                  ▼                   ▼
           ┌──────────┐        ┌──────────┐
           │  Order   │        │ cartData │
           └──┬───────┘        └──────────┘
              │
     ┌────────┼──────────┬──────────┬───────────┐
     │        │          │          │           │
 ┌───┴──┐ ┌──┴───┐ ┌────┴───┐ ┌───┴────┐ ┌───┴──────┐
 │amount│ │items │ │address │ │status  │ │payment   │
 │      │ │      │ │        │ │        │ │Method    │
 └──────┘ └──┬───┘ └────────┘ └────────┘ └──────────┘
              │
          ◇ Contains 
              │
              ▼
        ┌──────────┐
        │ Product  │
        └──┬───────┘
           │
  ┌────────┼──────────┬───────────┬───────────┐
  │        │          │           │           │
┌─┴──┐ ┌──┴───┐ ┌────┴───┐ ┌────┴───┐ ┌────┴────┐
│name│ │price │ │category│ │ image  │ │  sizes  │
└────┘ └──────┘ └────────┘ └────────┘ └─────────┘


        ┌────────────┐
        │ Subscriber │
        └──┬─────────┘
           │
       ┌───┴───┐
       │ email │
       └───────┘
```

---

### 3.2.4 Process Modeling (DFD)

A Data Flow Diagram (DFD) is a visual representation of how data flows through a system. It is made up of processes, data stores, and data flows. Processes indicate actions or transformations that take place within the system, data stores are data repositories, and data flows show the movement of data between processes.

#### Context or Zero Level DFD

The Context Diagram (Level 0 DFD) shows the entire E-Commerce system as a single process node interacting with external entities. The system has three external entities: **Customer**, **Admin**, and **Payment Gateway**.

```
                                    ┌──────────────┐
                                    │    Admin      │
                                    │   (Panel)     │
                                    └──────┬───────┘
                                           │
                              Manage Products│ View Orders
                              Manage Orders  │ View Users
                                           │
                                           ▼
┌──────────────┐    Register/Login    ┌──────────────────┐    Store/Retrieve     ┌──────────────┐
│              │    Browse Products   │                  │    Data               │              │
│   Customer   │─────────────────────▶│   E-Commerce     │◀────────────────────▶ │   MongoDB    │
│   (User)     │◀─────────────────────│   System         │                      │   Database   │
│              │    View Orders       │                  │    Store Images       │              │
└──────────────┘    Place Orders      │                  │────────────────────▶  └──────────────┘
                    Cart Operations   │                  │                       ┌──────────────┐
                                      │                  │◀────────────────────▶ │  Cloudinary  │
                                      └──────────────────┘    Image CDN         │    (CDN)     │
                                                                                └──────────────┘
```

---

#### Level 1 DFD

The Level 1 DFD breaks down the main system into sub-processes. The major processes identified are: **User Authentication**, **Product Management**, **Cart Management**, **Order Management**, and **Subscriber Management**.

```
                                          ┌─────────────────┐
                                          │      Admin      │
                                          └────────┬────────┘
                                                   │
                              ┌────────────────────┼────────────────────┐
                              │                    │                    │
                              ▼                    ▼                    ▼
┌──────────┐          ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│          │  Login   │     1.0      │    │     2.0      │    │     5.0      │
│          │─────────▶│    User      │    │   Product    │    │  Subscriber  │
│          │◀─────────│Authentication│    │  Management  │    │  Management  │
│          │ Response │              │    │              │    │              │
│          │          └──────┬───────┘    └──────┬───────┘    └──────┬───────┘
│          │                 │                   │                   │
│          │          Check  │            CRUD   │           Store   │
│ Customer │          ───────┼──────      ───────┼──────     ───────┼──────
│  (User)  │                ▼                    ▼                  ▼
│          │       ┌──────────────┐    ┌──────────────┐   ┌──────────────┐
│          │       │  User Table  │    │Product Table │   │Subscriber    │
│          │       └──────────────┘    └──────────────┘   │   Table      │
│          │                                              └──────────────┘
│          │
│          │  Add/Update/Get  ┌──────────────┐
│          │─────────────────▶│     3.0      │
│          │◀─────────────────│    Cart      │
│          │     Response     │  Management  │
│          │                  └──────┬───────┘
│          │                         │
│          │                  Update  │
│          │                  ───────┼──────
│          │                         ▼
│          │                ┌──────────────┐
│          │                │  User Table  │
│          │                │  (cartData)  │
│          │                └──────────────┘
│          │
│          │  Place Order    ┌──────────────┐
│          │────────────────▶│     4.0      │
│          │◀────────────────│    Order     │
│          │    Response     │  Management  │
│          │                 └──────┬───────┘
│          │                        │
└──────────┘                 Request │
                             ───────┼──────
                                    ▼
                            ┌──────────────┐
                            │ Order Table  │
                            └──────────────┘
```

---

### 3.2.5 Physical DFD of E-Commerce System

The Physical DFD shows how the system will be implemented, including hardware, software, files, and people involved. It describes the actual flow of data in the system with specific technologies.

```
                                    Register
                            ┌───────────────────────┐
                            │                       ▼
                      ┌──────────┐           ┌─────────────┐          ┌────────────────┐
                      │  User    │           │   Signup    │─────────▶│  users         │
                      │  Device  │           │  (POST API) │  Write   │  collection    │
                      │ (Browser)│           └─────────────┘          │  (MongoDB)     │
                      └────┬─────┘                                    └───────┬────────┘
                           │                                                  │
                           │ Login                                    Respond │
                           ▼                                                  │
                      ┌─────────────┐                                         │
                      │   Login     │◀────────────────────────────────────────┘
                      │  (POST API) │
                      └──────┬──────┘
                             │
                             │  JWT Token
                             ▼
                      ┌─────────────┐         ┌────────────────┐
                      │   Users     │  View   │   products     │
                      │  Dashboard  │────────▶│   collection   │
                      │  (React UI) │         │   (MongoDB)    │
                      └──────┬──────┘         └────────────────┘
                             │
                             ▼
                      ┌─────────────┐         ┌────────────────┐
                      │   View      │  View   │   products     │
                      │  Products   │────────▶│   collection   │
                      │(Collection) │         │   (MongoDB)    │
                      └──────┬──────┘         └────────────────┘
                             │
                             ▼
                      ┌─────────────┐         ┌────────────────┐
                      │  Manage     │  Write  │   users        │
                      │   Cart      │────────▶│   collection   │
                      │  (Cart API) │         │  (cartData)    │
                      └──────┬──────┘         └────────────────┘
                             │
                             ▼
                      ┌─────────────┐         ┌────────────────┐
                      │   Place     │  Write  │   orders       │
                      │   Order     │────────▶│   collection   │
                      │(Order API)  │         │   (MongoDB)    │
                      └──────┬──────┘         └────────────────┘
                             │
                             ▼
                      ┌─────────────┐
                      │   View      │
                      │   Orders    │
                      │ (Orders UI) │
                      └─────────────┘


                      ┌──────────────────── ADMIN PANEL ───────────────────────┐
                      │                                                        │
                      │  ┌─────────────┐          ┌────────────────┐           │
                      │  │   Admin     │  Login   │   Admin Auth   │           │
                      │  │   Login     │─────────▶│  (JWT Verify)  │           │
                      │  └─────────────┘          └───────┬────────┘           │
                      │                                   │                    │
                      │                                   ▼                    │
                      │                           ┌─────────────┐              │
                      │                           │   Admin     │              │
                      │                           │  Dashboard  │              │
                      │                           └──────┬──────┘              │
                      │                                  │                     │
                      │          ┌───────────┬───────────┼──────────┐          │
                      │          ▼           ▼           ▼          ▼          │
                      │  ┌────────────┐ ┌─────────┐ ┌────────┐ ┌────────┐    │
                      │  │  Manage    │ │  View   │ │  View  │ │  View  │    │
                      │  │ Products   │ │ Orders  │ │ Users  │ │Subscri-│    │
                      │  │(CRUD API)  │ │(List API│ │(List)  │ │ bers   │    │
                      │  └─────┬──────┘ └────┬────┘ └───┬────┘ └───┬────┘    │
                      │        │Write/       │Read      │Read      │Read     │
                      │        │Read         │          │          │          │
                      │        ▼             ▼          ▼          ▼          │
                      │  ┌──────────┐ ┌──────────┐ ┌────────┐ ┌─────────┐   │
                      │  │products  │ │ orders   │ │ users  │ │subscri- │   │
                      │  │collection│ │collection│ │collect.│ │bers coll│   │
                      │  └──────────┘ └──────────┘ └────────┘ └─────────┘   │
                      │                                                      │
                      └──────────────────────────────────────────────────────┘
```

---

## 3.3 API Endpoints Design

### 3.3.1 User API (`/api/user`)

| Method | Endpoint               | Auth   | Description                       |
|--------|------------------------|--------|-----------------------------------|
| POST   | `/api/user/register`   | None   | Register a new user               |
| POST   | `/api/user/login`      | None   | Login user & get JWT token        |
| POST   | `/api/user/admin`      | None   | Admin login & get JWT token       |
| POST   | `/api/user/subscriber` | None   | Subscribe to newsletter           |
| GET    | `/api/user/subscriber-list` | None | List all subscribers          |
| GET    | `/api/user/all`        | None   | List all users                    |

### 3.3.2 Product API (`/api/product`)

| Method | Endpoint                  | Auth      | Description                        |
|--------|---------------------------|-----------|------------------------------------|
| POST   | `/api/product/add`        | Admin JWT | Add a new product (with images)    |
| POST   | `/api/product/list`       | None      | List all products                  |
| DELETE | `/api/product/remove/:id` | Admin JWT | Remove a product by ID             |
| POST   | `/api/product/single/:id` | Admin JWT | Get single product details         |
| PUT    | `/api/product/update/:id` | Admin JWT | Update product details & images    |

### 3.3.3 Cart API (`/api/cart`)

| Method | Endpoint           | Auth     | Description                    |
|--------|--------------------|----------|--------------------------------|
| POST   | `/api/cart/get`    | User JWT | Get user's cart data           |
| POST   | `/api/cart/add`    | User JWT | Add item to cart               |
| POST   | `/api/cart/update` | User JWT | Update cart item quantity       |

### 3.3.4 Order API (`/api/order`)

| Method | Endpoint              | Auth      | Description                        |
|--------|-----------------------|-----------|------------------------------------|
| POST   | `/api/order/place`    | User JWT  | Place a new order (COD)            |
| POST   | `/api/order/list`     | Admin JWT | Get all orders (Admin)             |
| POST   | `/api/order/status`   | Admin JWT | Update order status (Admin)        |
| POST   | `/api/order/userorders` | User JWT | Get orders for logged-in user    |

---

## 3.4 Project Directory Structure

```
E-Commerce-MERN/
│
├── frontend/                    ◀── Customer-Facing React App (VIEW)
│   ├── src/
│   │   ├── App.jsx              # Main app with routing
│   │   ├── main.jsx             # Entry point
│   │   ├── index.css            # Global styles (Tailwind)
│   │   ├── assets/              # Static assets
│   │   ├── components/          # Reusable UI components
│   │   │   ├── Navbar.jsx       # Navigation bar
│   │   │   ├── Footer.jsx       # Footer section
│   │   │   ├── Hero.jsx         # Hero banner
│   │   │   ├── BestSeller.jsx   # Bestseller products
│   │   │   ├── LatestCollection.jsx
│   │   │   ├── ProductItem.jsx  # Single product card
│   │   │   ├── CartTotal.jsx    # Cart total display
│   │   │   ├── SearchBox.jsx    # Product search
│   │   │   ├── NewsLetterBox.jsx# Newsletter subscription
│   │   │   ├── OurPolicy.jsx    # Store policies
│   │   │   ├── RelatedProducts.jsx
│   │   │   ├── Title.jsx        # Section title
│   │   │   └── Loader.jsx       # Loading spinner
│   │   ├── context/
│   │   │   └── ShopContext.jsx  # Global state management
│   │   └── pages/               # Route pages
│   │       ├── Home.jsx         # Landing page
│   │       ├── Collection.jsx   # Product listing
│   │       ├── Product.jsx      # Product detail
│   │       ├── Cart.jsx         # Shopping cart
│   │       ├── PlaceOrder.jsx   # Checkout
│   │       ├── Orders.jsx       # User orders
│   │       ├── Login.jsx        # Auth page
│   │       ├── About.jsx        # About page
│   │       └── Contact.jsx      # Contact page
│   └── package.json
│
├── admin/                       ◀── Admin Panel React App (VIEW)
│   ├── src/
│   │   ├── App.jsx              # Admin app with routing
│   │   ├── components/
│   │   │   ├── Navbar.jsx       # Admin navbar
│   │   │   ├── Sidebar.jsx      # Admin sidebar navigation
│   │   │   ├── Login.jsx        # Admin login
│   │   │   ├── ImageInput.jsx   # Image upload component
│   │   │   └── Loader.jsx       # Loading spinner
│   │   └── pages/
│   │       ├── Add.jsx          # Add new product
│   │       ├── Edit.jsx         # Edit existing product
│   │       ├── List.jsx         # Product list management
│   │       ├── Orders.jsx       # Order management
│   │       ├── Users.jsx        # User management
│   │       └── Subscriber.jsx   # Subscriber list
│   └── package.json
│
├── backend/                     ◀── Node.js + Express API (CONTROLLER + MODEL)
│   ├── server.js                # Entry point, Express app setup
│   ├── config/
│   │   ├── mongodb.js           # MongoDB connection
│   │   └── cloudinary.js        # Cloudinary CDN config
│   ├── models/                  ◀── MODEL Layer
│   │   ├── userModel.js         # User schema
│   │   ├── productModel.js      # Product schema
│   │   ├── orderModel.js        # Order schema
│   │   └── subcriberModel.js    # Subscriber schema
│   ├── controllers/             ◀── CONTROLLER Layer
│   │   ├── userController.js    # User auth & management logic
│   │   ├── productController.js # Product CRUD logic
│   │   ├── orderController.js   # Order processing logic
│   │   └── cartController.js    # Cart operations logic
│   ├── routes/                  ◀── ROUTING Layer
│   │   ├── userRoute.js         # /api/user endpoints
│   │   ├── productRoute.js      # /api/product endpoints
│   │   ├── orderRoute.js        # /api/order endpoints
│   │   └── cartRoute.js         # /api/cart endpoints
│   └── middleware/              ◀── MIDDLEWARE Layer
│       ├── auth.js              # User JWT authentication
│       ├── adminAuth.js         # Admin JWT authentication
│       └── multer.js            # File upload handling
└── package.json
```

---

## 3.5 Data Flow Summary

### Customer Flow

```
┌─────────┐    Register     ┌──────────┐   Save User    ┌──────────┐
│ Customer │───────────────▶ │ Backend  │ ──────────────▶ │ MongoDB  │
│ (React)  │◀─────────────── │ (Express)│ ◀────────────── │ Database │
│          │   JWT Token     │          │   Confirm       │          │
└────┬─────┘                 └──────────┘                 └──────────┘
     │
     │  Browse Products
     ▼
┌─────────┐   GET Products   ┌──────────┐   Query        ┌──────────┐
│ Product  │───────────────▶ │ Product  │ ──────────────▶ │ products │
│ Listing  │◀─────────────── │Controller│ ◀────────────── │collection│
│ (React)  │  Product List   │          │   Results       │          │
└────┬─────┘                 └──────────┘                 └──────────┘
     │
     │  Add to Cart
     ▼
┌─────────┐   POST Cart      ┌──────────┐   Update       ┌──────────┐
│  Cart   │───────────────▶ │  Cart    │ ──────────────▶ │  users   │
│ (React) │◀─────────────── │Controller│ ◀────────────── │cartData  │
│         │   Confirmation   │          │   Saved         │          │
└────┬────┘                  └──────────┘                 └──────────┘
     │
     │  Place Order
     ▼
┌─────────┐   POST Order     ┌──────────┐   Save Order   ┌──────────┐
│  Place  │───────────────▶ │  Order   │ ──────────────▶ │ orders   │
│  Order  │◀─────────────── │Controller│ ◀────────────── │collection│
│ (React) │   Confirmation   │          │   Confirm       │          │
└─────────┘                  └──────────┘                 └──────────┘
```

### Admin Flow

```
┌─────────┐    Admin Login    ┌──────────┐   Verify      ┌──────────┐
│  Admin  │───────────────▶  │  User    │ ──────────────▶│ ENV Vars │
│ (React) │◀──────────────── │Controller│ ◀──────────────│(Secrets) │
│         │   JWT Token      │          │   Match         │          │
└────┬────┘                  └──────────┘                 └──────────┘
     │
     ├── Add/Edit/Delete Products ──▶ productController ──▶ products collection
     │                               ──▶ Cloudinary (images)
     │
     ├── View/Update Orders ────────▶ orderController ────▶ orders collection
     │
     ├── View Users ────────────────▶ userController ─────▶ users collection
     │
     └── View Subscribers ──────────▶ userController ─────▶ subscribers collection
```

---

## 3.6 Technology Stack

| Layer            | Technology                                      |
|------------------|-------------------------------------------------|
| **Frontend**     | React.js, React Router DOM, Tailwind CSS, Axios |
| **Admin Panel**  | React.js, React Router DOM, Tailwind CSS, Axios |
| **Backend**      | Node.js, Express.js                             |
| **Database**     | MongoDB (Mongoose ODM)                          |
| **Auth**         | JSON Web Token (JWT), Bcrypt.js                 |
| **File Upload**  | Multer (server), Cloudinary (CDN storage)       |
| **Build Tool**   | Vite                                            |
| **Notifications**| React Hot Toast                                 |
| **Validation**   | Validator.js                                    |

---

## 3.7 Security Features

| Feature                   | Implementation                                        |
|---------------------------|-------------------------------------------------------|
| Password Hashing          | Bcrypt.js with salt rounds (10)                       |
| User Authentication       | JWT token-based auth via `auth.js` middleware          |
| Admin Authentication      | Separate JWT verification via `adminAuth.js` middleware|
| Input Validation          | Email & password validation using `validator` package  |
| Protected Routes          | Middleware guards on admin & user-specific endpoints   |
| CORS                      | Configured via `cors` middleware in Express            |

---

> **Note:** This document serves as the system design chapter for the E-Commerce MERN Stack project report. All diagrams are based on the actual codebase implementation.

# E-Commerce MERN - Entity Relationship Diagram (ER Diagram)

## DBDiagram.io Schema Code

Copy the code below and paste it into [dbdiagram.io](https://dbdiagram.io) to visualize your database schema:

```
Project EcommerceMERN {
  database_type: 'MongoDB'
  Note: '''
    E-Commerce MERN Application Database Schema
    with Khalti Payment Integration
  '''
}

// USERS TABLE
Table users as U {
  _id ObjectId [pk]
  name String [not null]
  email String [not null, unique]
  password String [not null]
  cartData Object [not null, default: '{}']
  createdAt DateTime [not null]
  updatedAt DateTime [not null]

  Note: 'Stores user account information. cartData contains {productId: quantity} pairs.'
}

// PRODUCTS TABLE
Table products as P {
  _id ObjectId [pk]
  name String [not null]
  description String [not null]
  price Number [not null]
  image Array [not null]
  category String [not null]
  subCategory String [not null]
  sizes Array [not null]
  bestseller Boolean [not null, default: false]
  createdAt DateTime [not null]
  updatedAt DateTime [not null]

  Note: 'Stores product information. image: Array of Cloudinary URLs. sizes: ["S", "M", "L", "XL"]'
}

// ORDERS TABLE
Table orders as O {
  _id ObjectId [pk]
  userId String [not null, ref: '> users._id']
  items Array [not null]
  amount Number [not null]
  address Object [not null]
  status String [not null, default: 'Order Placed']
  paymentMethod String [not null]
  payment Boolean [not null, default: false]
  pidx String [default: null]
  transactionId String [default: null]
  khaltiSignature String [default: null]
  paymentStatus String [not null, default: 'N/A']
  paymentDetails Object [default: null]
  createdAt DateTime [not null]
  updatedAt DateTime [not null]

  Note: 'Stores order information. Supports Stripe, Khalti, and COD payment methods. items contains [{productId, name, price, quantity, size}, ...]'
}

// SUBSCRIBERS TABLE
Table subscribers as S {
  _id ObjectId [pk]
  email String [not null, unique]
  createdAt DateTime [not null]
  updatedAt DateTime [not null]

  Note: 'Stores newsletter subscriber emails.'
}

// RELATIONSHIPS
Ref: orders.userId > users._id : "places"
```

---

## ER Diagram Description

### Entity Overview

#### 1. **Users Entity**
- **Primary Key**: `_id` (ObjectId)
- **Attributes**: name, email, password, cartData, createdAt, updatedAt
- **Purpose**: Stores user account and authentication information
- **Cardinality**: 1 User can have Many Orders

#### 2. **Products Entity**
- **Primary Key**: `_id` (ObjectId)
- **Attributes**: name, description, price, image, category, subCategory, sizes, bestseller, createdAt, updatedAt
- **Purpose**: Stores product catalog information
- **Cardinality**: 1 Product can be in Many Order Items

#### 3. **Orders Entity**
- **Primary Key**: `_id` (ObjectId)
- **Foreign Key**: `userId` → references `users._id`
- **Attributes**: userId, items, amount, address, status, paymentMethod, payment, pidx, transactionId, khaltiSignature, paymentStatus, paymentDetails, createdAt, updatedAt
- **Purpose**: Stores order transactions and payment information
- **Cardinality**: Many Orders belong to 1 User

#### 4. **Subscribers Entity**
- **Primary Key**: `_id` (ObjectId)
- **Attributes**: email, createdAt, updatedAt
- **Purpose**: Stores newsletter subscriber information
- **Cardinality**: Independent entity (No relationships)

---

## Relationships

| Relationship | Type | Description |
|--------------|------|-------------|
| Users → Orders | **1:N** (One-to-Many) | 1 User can place Multiple Orders |
| Products → Orders | Implicit | Products referenced in Order items array |
| Users → Subscribers | None | Independent entities |

---

## Key Field Details

### Status Enumeration
- **Order Status**: "Order Placed", "Packing", "Shipped", "Delivered", "Cancelled"
- **Payment Status**: "Pending", "Completed", "Failed", "User canceled", "N/A"
- **Payment Method**: "Stripe", "Khalti", "COD"

### Special Fields
- **cartData (Users)**: Stores shopping cart as `{productId: quantity}`
- **items (Orders)**: Stores array of ordered products with details `[{productId, name, price, quantity, size}, ...]`
- **address (Orders)**: Stores shipping address as object `{street, city, country, zipcode, ...}`
- **image (Products)**: Array of image URLs from Cloudinary
- **sizes (Products)**: Array of available sizes `["S", "M", "L", "XL"]`

---

## Normalization Notes

- **Database Type**: MongoDB (NoSQL/Document-based)
- **Timestamps**: All entities use `timestamps: true` (createdAt, updatedAt)
- **Unique Constraints**: 
  - Users: email (unique)
  - Subscribers: email (unique)
- **Denormalization**: Order items store product details (non-normalized for performance)
- **Weak Relationships**: Users have no hard cascade delete with Orders (orphan orders possible)
  userId String [not null, note: 'Foreign key to users']
  items Array [not null, note: 'Denormalized product data at order time']
  amount Number [not null, note: 'Total order amount']
  address Object [not null, note: '{street, city, state, country, zipcode}']
  status String [not null, default: '"Order Placed"', note: 'Order status']
  paymentMethod String [not null, note: 'Stripe, Khalti, or COD']
  payment Boolean [not null, default: false, note: 'Payment completion flag']
  pidx String [default: 'null', note: 'Khalti payment ID']
  transactionId String [default: 'null', note: 'Khalti transaction ID']
  khaltiSignature String [default: 'null', note: 'Khalti verification']
  paymentStatus String [default: '"N/A"', note: 'Payment gateway status']
  paymentDetails Object [default: 'null', note: 'Gateway metadata']
  createdAt DateTime [not null]
  updatedAt DateTime [not null]
}

Table subscribers as S {
  _id ObjectId [pk, increment]
  email String [not null, unique, note: 'Newsletter email']
  createdAt DateTime [not null]
  updatedAt DateTime [not null]
}

// One-to-Many Relationship: User -> Orders
Ref: O.userId > U._id [note: "A user can have multiple orders"]

// Many-to-Many Relationship: User <-> Product (via cartData)
// Note: Implicit relationship via cartData Object in users table

// Many-to-Many Relationship: Product <-> Order (via items)
// Note: Implicit relationship via items Array in orders table
```

## Instructions for DBDiagram.io

1. Go to [dbdiagram.io](https://dbdiagram.io)
2. Click on "Create New Diagram"
3. Paste one of the codes above into the editor (left side)
4. The diagram will auto-generate on the right side
5. Use the visualization options to customize the diagram

## Key Features in the Schema

✅ **Primary Keys**: All tables have `_id` as MongoDB ObjectId
✅ **Foreign Keys**: `orders.userId` references `users._id`
✅ **Unique Constraints**: `email` fields are unique in users and subscribers
✅ **Default Values**: Properly defined for all applicable fields
✅ **Timestamps**: All tables include `createdAt` and `updatedAt`
✅ **Data Types**: Correct MongoDB types including Array and Object
✅ **Khalti Integration**: All payment-related fields included
✅ **Notes**: Detailed descriptions for complex fields

## Relationships Summary

| From | To | Type | Reference |
|------|-----|------|-----------|
| orders | users | Many-to-One | `userId` |
| users | products | Many-to-Many (via cartData) | Implicit |
| orders | products | Many-to-Many (via items) | Denormalized |
| subscribers | N/A | Independent | None |

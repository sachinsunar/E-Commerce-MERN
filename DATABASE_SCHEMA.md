# E-Commerce MERN - Database Schema Design

## Overview
This document outlines the MongoDB database schema for the E-Commerce MERN application. The application uses Mongoose for ODM (Object Data Modeling).

---

## Collections

### 1. User Collection

**Purpose:** Stores user account information and shopping cart data.

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `name` | String | Yes | - | User's full name |
| `email` | String | Yes | - | User's email (unique) |
| `password` | String | Yes | - | Hashed password |
| `cartData` | Object | No | `{}` | Stores product IDs and quantities: `{ productId: quantity, ... }` |
| `createdAt` | Date | Auto | Current timestamp | Document creation time |
| `updatedAt` | Date | Auto | Current timestamp | Document last update time |

**Indexes:**
- `email` (unique)

**Schema Options:**
- `timestamps: true` - Automatically manage `createdAt` and `updatedAt`
- `minimize: false` - Keep empty objects in the document

---

### 2. Product Collection

**Purpose:** Stores product information and inventory details.

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `name` | String | Yes | - | Product name |
| `description` | String | Yes | - | Detailed product description |
| `price` | Number | Yes | - | Product price in currency units |
| `image` | Array | Yes | - | Array of image URLs from Cloudinary |
| `category` | String | Yes | - | Product category (e.g., Men, Women, Kids) |
| `subCategory` | String | Yes | - | Product subcategory (e.g., Topwear, Bottomwear) |
| `sizes` | Array | Yes | - | Available sizes (e.g., ['S', 'M', 'L', 'XL']) |
| `bestseller` | Boolean | No | `false` | Flag indicating if product is a bestseller |
| `createdAt` | Date | Auto | Current timestamp | Document creation time |
| `updatedAt` | Date | Auto | Current timestamp | Document last update time |

**Example:**
```javascript
{
  name: "Classic T-Shirt",
  description: "Premium cotton t-shirt...",
  price: 29.99,
  image: ["url1", "url2", "url3"],
  category: "Men",
  subCategory: "Topwear",
  sizes: ["S", "M", "L", "XL"],
  bestseller: true
}
```

---

### 3. Order Collection

**Purpose:** Stores order information including payment details and Khalti integration.

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `userId` | String | Yes | - | Reference to User ID |
| `items` | Array | Yes | - | Array of ordered items with product details |
| `amount` | Number | Yes | - | Total order amount |
| `address` | Object | Yes | - | Shipping address object |
| `status` | String | Yes | "Order Placed" | Order status: "Order Placed", "Packing", "Shipped", "Delivered", "Cancelled" |
| `paymentMethod` | String | Yes | - | Payment method: "Stripe", "Khalti", "COD" (Cash on Delivery) |
| `payment` | Boolean | Yes | `false` | Payment completion flag |
| `pidx` | String | No | `null` | Khalti payment ID (Khalti transactions only) |
| `transactionId` | String | No | `null` | Khalti transaction ID |
| `khaltiSignature` | String | No | `null` | Khalti payment signature for verification |
| `paymentStatus` | String | No | "N/A" | Khalti payment status: "Pending", "Completed", "Failed", "User canceled", "N/A" |
| `paymentDetails` | Object | No | `null` | Additional payment metadata |
| `createdAt` | Date | Auto | Current timestamp | Order creation time |
| `updatedAt` | Date | Auto | Current timestamp | Order last update time |

**Payment Methods Supported:**
- **Stripe**: Traditional credit/debit card payment
- **Khalti**: Local payment gateway (Nepal)
- **COD**: Cash on Delivery (payment on delivery)

**Example:**
```javascript
{
  userId: "64f3a2b1c9e8d2f5a1b2c3d4",
  items: [
    { productId: "...", name: "T-Shirt", price: 29.99, quantity: 2, size: "M" }
  ],
  amount: 59.98,
  address: { street: "...", city: "...", country: "...", zipcode: "..." },
  status: "Shipped",
  paymentMethod: "Khalti",
  payment: true,
  pidx: "khalti_pidx_12345",
  transactionId: "txn_123456",
  paymentStatus: "Completed"
}
```

---

### 4. Subscriber Collection

**Purpose:** Stores email addresses of newsletter subscribers.

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `email` | String | Yes | - | Subscriber's email address (unique) |
| `createdAt` | Date | Auto | Current timestamp | Subscription date |
| `updatedAt` | Date | Auto | Current timestamp | Last update time |

**Indexes:**
- `email` (unique)

**Use Case:** Newsletter and promotional email campaigns.

---

## Data Relationships

### Entity-Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          E-COMMERCE MERN DATABASE                           │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────┐
│       USER               │
├──────────────────────────┤
│ _id (PK)                 │
│ name                     │
│ email (UNIQUE)           │
│ password                 │
│ cartData (Object)        │◄─────────────────────┐
│ createdAt                │                       │
│ updatedAt                │                       │
└──────────────────────────┘                       │
         │                                         │
         │ userId (FK)                    References Products
         │                                         │
         ▼                                         │
┌──────────────────────────┐     ┌──────────────────────────────────────┐
│       ORDER              │     │       PRODUCT                        │
├──────────────────────────┤     ├──────────────────────────────────────┤
│ _id (PK)                 │────►│ _id (PK)                             │
│ userId (FK)──┐           │     │ name                                 │
│ items (Array)│           │     │ description                          │
│ amount       │           │     │ price                                │
│ address      │           │     │ image (Array - URLs)                │
│ status       │           │     │ category                             │
│ paymentMethod│           │     │ subCategory                          │
│ payment      │           │     │ sizes (Array)                        │
│ pidx         │           │     │ bestseller                           │
│ transactionId│           │     │ createdAt                            │
│ khaltiSig... │           │     │ updatedAt                            │
│ paymentStatus│           │     └──────────────────────────────────────┘
│ paymentDetails           │
│ createdAt                │
│ updatedAt                │
└──────────────────────────┘

┌──────────────────────────┐
│     SUBSCRIBER           │
├──────────────────────────┤
│ _id (PK)                 │
│ email (UNIQUE)           │
│ createdAt                │
│ updatedAt                │
└──────────────────────────┘
         │
         │ (Independent - Newsletter management)
         │
         ▼
    (Email Campaign)

Legend:
  PK = Primary Key
  FK = Foreign Key
  ◄─── References relationship
  ───► Links to
```

### Relationship Descriptions

#### 1. **User ↔ Order** (One-to-Many)
- **Relationship Type:** One User can have Many Orders
- **Connection:** `Order.userId` → `User._id`
- **Example:**
  ```
  User (id: 64f3a2b1c9e8d2f5a1b2c3d4)
    ├─ Order 1 (id: 64f3a2b1c9e8d2f5a1b2c3e5)
    ├─ Order 2 (id: 64f3a2b1c9e8d2f5a1b2c3e6)
    └─ Order 3 (id: 64f3a2b1c9e8d2f5a1b2c3e7)
  ```

#### 2. **Product ↔ Order** (Many-to-Many via Denormalization)
- **Relationship Type:** Many Products can appear in Many Orders
- **Connection:** `Order.items` (Array) contains product references
- **Storage Strategy:** Product details are copied at order time (denormalized)
- **Benefit:** Preserves historical pricing and product info
- **Example:**
  ```
  Product (id: 64f3a2b1c9e8d2f5a1b2c3d8)
    ├─ Order 1.items[0]
    ├─ Order 2.items[1]
    └─ Order 5.items[0]
  ```

#### 3. **User ↔ Product** (Many-to-Many via Cart)
- **Relationship Type:** Users can have Many Products in their cart
- **Connection:** `User.cartData` Object
- **Structure:** `{ productId: quantity, ... }`
- **Example:**
  ```
  User cartData: {
    "64f3a2b1c9e8d2f5a1b2c3d8": 2,    // 2 units of this product
    "64f3a2b1c9e8d2f5a1b2c3d9": 1,    // 1 unit of this product
    "64f3a2b1c9e8d2f5a1b2c3da": 3     // 3 units of this product
  }
  ```

#### 4. **Subscriber** (Independent)
- **Relationship Type:** No direct foreign keys
- **Purpose:** Newsletter and marketing campaigns
- **Independence:** Can exist without User account

### Relationship Flow Diagram

```
SHOPPING FLOW:
┌──────────────┐
│ Browse Page  │
└──────┬───────┘
       │ User clicks product
       ▼
┌──────────────────────────┐
│ Product Details Page     │
└──────┬───────────────────┘
       │ User adds to cart
       ▼
┌──────────────────────────────────────┐
│ Update User.cartData (Many-to-Many)  │
│ { productId: quantity }              │
└──────┬───────────────────────────────┘
       │
       │ User clicks checkout
       ▼
┌──────────────────────────────────────┐
│ Create Order from User.cartData      │
│ (One-to-Many: User → Order)          │
└──────┬───────────────────────────────┘
       │
       │ Copy Product details to Order.items
       │ (Many-to-Many denormalized)
       ▼
┌──────────────────────────────────────┐
│ Order Created with:                  │
│ - userId reference                   │
│ - items array (product snapshots)    │
│ - amount, address, paymentMethod     │
└──────────────────────────────────────┘
       │
       │ Process Payment (Khalti/Stripe)
       ▼
┌──────────────────────────────────────┐
│ Update Order Status & Payment Info   │
│ - payment: true                      │
│ - paymentStatus: "Completed"         │
│ - transactionId: stored              │
└──────────────────────────────────────┘
```

### Data Flow Examples

#### Example 1: User Places Order with Multiple Products

```javascript
// Step 1: User adds items to cart (User.cartData updated)
User: {
  _id: "user123",
  cartData: {
    "prod001": 2,    // 2x T-Shirt
    "prod002": 1,    // 1x Jeans
    "prod003": 3     // 3x Socks
  }
}

// Step 2: User places order (New Order created)
Order: {
  _id: "order789",
  userId: "user123",           // Links to User
  items: [
    {
      productId: "prod001",
      name: "T-Shirt",
      price: 29.99,
      quantity: 2,
      size: "M"
    },
    {
      productId: "prod002",
      name: "Jeans",
      price: 79.99,
      quantity: 1,
      size: "32"
    },
    {
      productId: "prod003",
      name: "Socks",
      price: 9.99,
      quantity: 3,
      size: "One Size"
    }
  ],
  amount: 179.94,
  paymentMethod: "Khalti",
  status: "Order Placed"
}

// Step 3: User.cartData cleared after order
User: {
  _id: "user123",
  cartData: {}     // Cleared
}
```

#### Example 2: Order with Khalti Payment

```javascript
Order: {
  _id: "order789",
  userId: "user123",
  items: [...],
  amount: 179.94,
  paymentMethod: "Khalti",
  payment: true,
  pidx: "FxHkiMLlxY4UfEd59nSw92",
  transactionId: "0011QCSf60EhSR6G1645954960",
  khaltiSignature: "signature_value_here",
  paymentStatus: "Completed",
  paymentDetails: {
    source: "WALLET",
    timestamp: "2026-03-21T10:30:00Z"
  },
  status: "Packing"
}
```

#### Example 3: Multiple Users, Same Product

```
Product (prod001 - Popular T-Shirt):
  ├─ User 1.cartData.prod001 = 2
  ├─ User 2.cartData.prod001 = 1
  ├─ Order (order001).items[0] = { productId: prod001, quantity: 2 }
  ├─ Order (order002).items[1] = { productId: prod001, quantity: 1 }
  └─ Order (order003).items[0] = { productId: prod001, quantity: 3 }
```

---

## Key Design Decisions

### 1. **Cart Storage in User Document**
- Cart data is stored directly in the User document as an Object
- Structure: `{ productId: quantity, ... }`
- **Advantage:** Quick access without separate queries
- **Disadvantage:** Denormalization; updates require full document rewrite

### 2. **Order Items Denormalization**
- Product details are stored in the Order at the time of purchase
- Prevents price/product changes from affecting historical orders
- **Advantage:** Historical accuracy and data integrity

### 3. **Khalti Payment Integration**
- Dedicated fields for Khalti payment tracking
- `pidx` and `transactionId` for transaction verification
- `paymentStatus` enum ensures valid statuses

### 4. **Timestamps**
- All collections include `createdAt` and `updatedAt`
- Useful for sorting, filtering, and audit trails

---

## Mongoose Model Instantiation

All models use the Mongoose singleton pattern to prevent model recompilation:

```javascript
const Model = mongoose.models.Model || mongoose.model("Model", schema);
```

This ensures only one model instance exists even if the file is imported multiple times.

---

## Future Enhancements

- [ ] Add product inventory tracking (stock quantity per size)
- [ ] Implement return/refund tracking in Order schema
- [ ] Add wishlist collection for saved items
- [ ] Implement order rating and review system
- [ ] Add coupon/discount code tracking
- [ ] Implement notification preferences in User schema
- [ ] Add order history pagination support

---

## Database Indexing Strategy

**Recommended Indexes:**

```javascript
// User Collection
db.users.createIndex({ "email": 1 }, { unique: true })

// Product Collection
db.products.createIndex({ "category": 1 })
db.products.createIndex({ "bestseller": 1 })
db.products.createIndex({ "name": "text" }) // Text search

// Order Collection
db.orders.createIndex({ "userId": 1 })
db.orders.createIndex({ "createdAt": -1 })
db.orders.createIndex({ "paymentStatus": 1 })

// Subscriber Collection
db.subscribers.createIndex({ "email": 1 }, { unique: true })
```

---

## Notes

- All password fields should be hashed before storage (using bcrypt)
- Implement proper validation on the backend for all fields
- Consider implementing soft deletes for orders and users
- Implement proper authorization checks before data access

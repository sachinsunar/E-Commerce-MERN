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

```
User
 ├─ cartData (stores product references)
 └─ linked to Orders via userId

Product
 └─ referenced in Order.items

Order
 ├─ userId (references User)
 └─ items (references Products)

Subscriber
 └─ independent collection for newsletter management
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

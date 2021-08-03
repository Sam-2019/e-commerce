const { buildSchema } = require("graphql");

module.exports = buildSchema(
  `
  scalar Markdown
  scalar EmailAddress
  scalar DigitalAddress

  enum Status {
    PENDING
    PROCESSED
    SHIPPED
    FULFILLED
    CANCELLED
  }

  enum PaymentMethod {
    Cash
    MobileMoney
  }

  enum ErrorCode {
    OK
    CREATED
    FOUND
    UNAUTHORIZED
    NOTFOUND
  }

  interface User {
    username : String
    firstName: String
    lastName: String
    email: EmailAddress
    photoURL: String
    phoneNumber:  Int
    verified:  Boolean
  }

  type UserDetail implements User {
    id: ID
    username : String
    firstName: String
    lastName: String
    email: EmailAddress
    photoURL: String
    phoneNumber:  Int
    verified:  Boolean
    cart:  [CartItem]
    order:  [OrderItem]
    wishlist:  [WishListItem]
    review:  [ReviewItem]
  }

  input Signup {
    username : String
    firstName: String
    lastName: String
    email: EmailAddress
    password: String
    phoneNumber:  Int
  }

  type SignupPayload {
    error: ErrorType
    user: UserDetail
  }
    
  interface Product {
    name : String
    slug: String
    price: Float
    imageURL: String
    description: Markdown
  }

  type ProductDetail implements Product {
    id: ID
    name : String
    slug: String
    price: Float
    imageURL: String
    description: Markdown
    quantity:  Int
    author: String
    rating:  Float
    review: [ReviewItem]
  }

  input AddProduct {
    name : String
    slug: String
    price: Float
    imageURL: String
    description: Markdown
    quantity: Int
    author: String
  }

  type AddProductPayload {
    error: ErrorType
    product: ProductDetail
  }

  type Cart {
    id: ID
    userID : ID
    productID: ID
    quantity: Int
  }

  type CartItem {
    id: ID
    quantity: Int
    product: Product
  }

  input AddCart {
    userID : ID
    productID: ID
    quantity: Int
  }

  type AddCartPayload {
    error: ErrorType
    cart: Cart
    }

  type WishList {
    id: ID
    userID : ID
    productID: ID
  }

  type WishListItem implements Product {
    id: ID
    name : String
    slug: String
    price: Float
    imageURL: String
    description: Markdown
  }

  input AddWishList {
    userID : ID
    productID : ID
  }

  type AddWishListPayload {
    error: ErrorType
    wishlist: WishList
    }

  type Order {
    id: ID
    userID : ID
    productID: [ID]
    paymentID: ID
    deliveryID: ID
    orderNumber: Int
    orderValue: Float
    status: Status
  }

  type OrderItem implements Product {
    id: ID
    name : String
    slug: String
    price: Float
    imageURL: String
    quantity: Int
    status: Status
    description: Markdown
  }

  input AddOrder {
    userID: ID
    productID: [ID]
    paymentID: ID
    deliveryID: ID
    orderNumber: Int
    orderValue: Float
  }

  type AddOrderPayload {
    error: ErrorType
    order: Order
    }

  type Review {
    id: ID
    userID: ID
    review: Markdown
    rating: Float
    created_at: String
  }

  type ReviewItem {
    id: ID
    user: User
    productID: ID
    review: Markdown
    rating: Float
    created_at: String
  }

  input AddReview {
    userID: ID
    productID: ID
    rating: Float
    review: Markdown
  }

  type AddReviewPayload {
    error: ErrorType
    review: Review
    }

  type AuthenticationData {
    userID: ID
    token: String
    tokenExpiration: Int
  }

  input Login {
    email: EmailAddress
    password: String
  }

  type LoginPayload {
    error: ErrorType
    user: AuthenticationData
    }

  interface Location {
    name: String
    fee: Float
  }
  
  type LocationDetail implements Location {
    id: ID
    disabled: Boolean
    name: String
    fee: Float
  }

  input AddLocation {
    name: String
    fee: Float
  }

  type AddLocationPayload {
    error: ErrorType
    location: LocationDetail
  }

  interface Payment {
    method: PaymentMethod
    status: Status
    phoneNumber: Int
  }

  type PaymentDetail implements Payment {
    id: ID
    method: PaymentMethod
    status: Status
    phoneNumber: Int
  }

  input AddPayment {
    method: PaymentMethod
    status: Status
    phoneNumber: Int
  }

  type AddPaymentPayload {
    error: ErrorType
    payment: PaymentDetail
  }

  type Cash {
    amount: Float
  }
    
  type MobileMoney {
    momoName: String
    momoNumber: Int
    momoTransactionID: String
  }

  interface Delivery {
    address: DigitalAddress
    landmark: String
  }  

  type DeliveryDetail implements Delivery {
    id: ID
    address: DigitalAddress
    landmark: String
  }

  input AddDelivery {
    address: DigitalAddress
    landmark: String
  }

  type AddDeliveryPayload {
    error: ErrorType
    delivery: DeliveryDetail
  }

  type Pagination {
    count: Int
    products: [ProductDetail]
  }

  type ErrorType {
    message: String
  }

  type Query {

  searchProductByName(name: String): [Product]
  searchProductByAuthor(author: String): [Product]

  getProducts: [ProductDetail]
  getProduct(slug: String): ProductDetail

  getUsers: [UserDetail]
  getUser(id:ID): UserDetail

  getCarts: [Cart]
  getUserCart(id:ID): [CartItem]

  getWishLists: [WishList]
  getUserWishList(id:ID): [WishListItem]

  getOrders: [Order]
  getUserOrders(id:ID): [OrderItem]

  getLocations: [Location]
  getDeliveryLocations: [Delivery]

  getProductReview(id: ID): [ReviewItem]

  login(input: Login): AuthenticationData
  }

  type Mutation {
    signup(input: Signup): SignupPayload
    addProduct(input: AddProduct): AddProductPayload
    addProductToCart(input: AddCart): AddCartPayload
    addProductToWishList(input: AddWishList): AddWishListPayload
    addOrder(input: AddOrder): AddOrderPayload
    addReview(input: AddReview): AddReviewPayload
    addLocation(input: AddLocation): AddLocationPayload
    addPayment(input: AddPayment): AddPaymentPayload
    addDelivery(input: AddDelivery): AddDeliveryPayload
  }
  
  schema {
    query: Query
    mutation: Mutation
  }
    `
);

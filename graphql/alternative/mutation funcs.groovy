mutation Signup($signup: Signup) {
  signup(input: $signup) {
    error {
      message
    }
    user {
      username
      firstName
      lastName
      email
      photoURL
      phoneNumber
      verified
    }
  }
}

{
  "signup": {
    "username": "dameROC",
    "firstName": "",
    "lastName": "Dash",
    "email": "dame@dash.com",
    "password": "123456789",
    "phoneNumber": 12345
  }
}

mutation AddProduct($addProduct: AddProduct) {
  addProduct(input: $addProduct) {
    error {
      message
    }
    product {
      id
      name
      slug
      price
      imageURL
      description
      quantity
      author
      rating
    }
  }
}
{
  "addProduct": {
    "name": "",
    "slug": "",
    "price": 10.5,
    "imageURL": "",
    "description": "",
    "quantity": 1,
    "author": ""
  }
}

  mutation AddProductToCart($addCart: AddCart) {
  addProductToCart(input: $addCart) {
    error {
      message
    }
    cart {
      id
      userID
      productID
      quantity
    }
  }
}


  {
  "addCart": {
    "userID": "60f1a4735085970970154231",
    "productID": "60f1a4735085970970154231",
    "quantity": 2
  }
}



mutation AddProductToWishList($addWishList: AddWishList) {
  addProductToWishList(input: $addWishList) {
    error {
      message
    }
    wishlist {
      id
      userID
      productID
    }
  }
}

{
  "addWishList": {
    "userID": "60f1a4735085970970154231",
    "productID": "60f1a4735085970970154231"
  }
}

mutation AddOrder($addOrder: AddOrder) {
  addOrder(input: $addOrder) {
    error {
      message
    }
    order {
      id
      userID
      productID
      paymentID
      deliveryID
      orderNumber
      orderValue
      status
    }
  }
}

{
  "addOrder": {
    "userID": "60f1a4735085970970154231",
    "productID": [
      "60f1a4735085970970154231",
      "60f1a4735085970970154231"
    ],
    "paymentID": "60f1a4735085970970154231",
    "deliveryID": "60f1a4735085970970154231",
    "orderNumber": 2020,
    "orderValue": 20.5
  }
}

mutation AddReview($addReview: AddReview) {
  addReview(input: $addReview) {
    error {
      message
    }
    review {
      id
      userID
      review
      rating
      created_at
    }
  }
}

{
  "addReview": {
    "userID": "60f1cdf88d744927ac8be39f",
    "productID": "60f1cdf88d744927ac8be39f",
    "rating": 5,
    "review": "ofpgkpogk"
  }
}

mutation AddLocation($addLocation: AddLocation) {
  addLocation(input: $addLocation) {
    error {
      message
    }
    location {
      id
      disabled
      name
      fee
    }
  }
}

  {
    "addLocation": {
      "name": "Tema",
      "fee": 10
    }
  }

mutation AddPayment($addPayment: AddPayment) {
  addPayment(input: $addPayment) {
    error {
      message
    }
    payment {
      id
      method
      status
      phoneNumber
    }
  }
}

{
  "addPayment": {
    "method": "Cash",
    "status": "PENDING",
    "phoneNumber": 123456789
  }
}

mutation AddDelivery($addDelivery: AddDelivery) {
  addDelivery(input: $addDelivery) {
    error {
      message
    }
    delivery {
      id
      address
      landmark
    }
  }
}

{
  "addDelivery": {
    "address": "",
    "landmark": ""
  }
}
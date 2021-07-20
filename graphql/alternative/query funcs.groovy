{
    searchProductByName(name: "") {
      name
      slug
      price
      imageURL
    }
  }
  
  {
  searchProductByAuthor(author: "") {
    name
    slug
    price
    imageURL
  }
}

{
  getProduct(slug: "") {
    productID
  }
}

{
  getCarts {
    cartID
    userID
    productID {
      name
      slug
      price
      imageURL
    }
    price
    quantity
  }
}

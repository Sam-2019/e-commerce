const graphql = require("graphql");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLID,
  GraphQLBoolean,
} = graphql;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const ProductSchema = require("../db/schema/product");
const UserSchema = require("../db/schema/user");
const CartSchema = require("../db/schema/cart");
const OrderSchema = require("../db/schema/order");
const WishListSchema = require("../db/schema/wishlist");
const ReviewSchema = require("../db/schema/review");
const OrderItemSchema = require("../db/schema/orderItem");
const LocationSchema = require("../db/schema/location");

const ProductType = new GraphQLObjectType({
  name: "ProductType",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    sku: { type: GraphQLString },
    author: { type: GraphQLString },
    price: { type: GraphQLString },
    imageURL: { type: GraphQLString },
    quantity: { type: GraphQLInt },
    detail: { type: GraphQLString },
    review: { type: GraphQLList(ReviewType) },
  }),
});

const UserType = new GraphQLObjectType({
  name: "UserType",
  fields: () => ({
    id: { type: GraphQLID },
    username: { type: GraphQLString },
    password: { type: GraphQLString },
    new_password: { type: GraphQLString },
    first_name: { type: GraphQLString },
    last_name: { type: GraphQLString },
    email: { type: GraphQLString },
    new_email: { type: GraphQLString },
    photoURL: { type: GraphQLString },
    phone_number: { type: GraphQLString },
    verified: { type: GraphQLBoolean },
    cart: { type: GraphQLList(CartType) },
    order: { type: GraphQLList(OrderType) },
    wishlist: { type: GraphQLList(WishListType) },
    review: { type: GraphQLList(ReviewType) },
  }),
});

const CartType = new GraphQLObjectType({
  name: "CartType",
  fields: () => ({
    id: { type: GraphQLID },
    user: { type: GraphQLID },
    product: { type: ProductType },
    price: { type: GraphQLString },
    quantity: { type: GraphQLString },
  }),
});

const CartProductType = new GraphQLObjectType({
  name: "CartProductType",
  fields: () => ({
    cartID: { type: GraphQLID },
    productID: { type: GraphQLID },
    name: { type: GraphQLString },
    sku: { type: GraphQLString },
    author: { type: GraphQLString },
    price: { type: GraphQLString },
    imageURL: { type: GraphQLString },
    quantity: { type: GraphQLString },
  }),
});

const WishListProductType = new GraphQLObjectType({
  name: "WishListProductType",
  fields: () => ({
    wishID: { type: GraphQLID },
    productID: { type: GraphQLID },
    name: { type: GraphQLString },
    sku: { type: GraphQLString },
    price: { type: GraphQLString },
    imageURL: { type: GraphQLString },
  }),
});

const OrderType = new GraphQLObjectType({
  name: "OrderType",
  fields: () => ({
    id: { type: GraphQLID },
    user: { type: GraphQLID },
    products: { type: GraphQLList(ProductType) },
    orderNumber: { type: GraphQLString },
    orderValue: { type: GraphQLString },
    status: { type: GraphQLString },
    quantity: { type: GraphQLString },
  }),
});

const OrderItemType = new GraphQLObjectType({
  name: "OrderItemType",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    sku: { type: GraphQLString },
    author: { type: GraphQLString },
    price: { type: GraphQLString },
    imageURL: { type: GraphQLString },
    quantity: { type: GraphQLString },
    status: { type: GraphQLString },
  }),
});

const WishListType = new GraphQLObjectType({
  name: "WishListType",
  fields: () => ({
    id: { type: GraphQLID },
    user: { type: GraphQLID },
    product: { type: GraphQLID },
  }),
});

const ReviewType = new GraphQLObjectType({
  name: "ReviewType",
  fields: () => ({
    id: { type: GraphQLID },
    user: { type: GraphQLID },
    product: { type: GraphQLID },
    rating: { type: GraphQLInt },
    text: { type: GraphQLString },
  }),
});

const LoginType = new GraphQLObjectType({
  name: "LoginType",
  fields: () => ({
    user: { type: GraphQLID },
    token: { type: GraphQLString },
    tokenexpiration: { type: GraphQLInt },
  }),
});

const LocationType = new GraphQLObjectType({
  name: "LocationType",
  fields: () => ({
    id: { type: GraphQLID },
    location: { type: GraphQLString },
    fee: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: () => ({
    products: {
      type: new GraphQLList(ProductType),
      resolve(parentValue, args) {
        return ProductSchema.find();
      },
    },

    product: {
      type: ProductType,
      args: {
        sku: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve(parentValue, { sku }) {
        return ProductSchema.findOne({ sku: sku });
      },
    },

    search: {
      type: new GraphQLList(ProductType),
      args: {
        text: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve(parentValue, { text }) {
        async function search() {
          try {
            const searchItem = await ProductSchema.find({
              name: { $regex: text, $options: "i" },
            });

            return searchItem;
          } catch (err) {
            console.log(err);
          }
        }

        return search();
      },
    },

    users: {
      type: new GraphQLList(UserType),
      resolve(parentValue, args) {
        return UserSchema.find();
      },
    },

    user: {
      type: UserType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve(parentValue, { id }) {
        return UserSchema.findById(id).populate([
          "cart",
          "order",
          "wishlist",
          "review",
        ]);
      },
    },

    login: {
      type: LoginType,
      args: {
        email: {
          type: new GraphQLNonNull(GraphQLString),
        },
        password: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve(parentValue, { email, password }) {
        const loginUser = async () => {
          try {
            const user = await UserSchema.findOne({ email });

            const isEqual = await bcrypt.compare(password, user.password);

            const check = () => {
              if (!user) {
                return new Error("User does not exist");
              }

              if (!isEqual) {
                return new Error("Password is incoreect");
              }

              const token = jwt.sign(
                { userId: user._id, email: user.email },
                "somesupersecretkey",
                {
                  expiresIn: "1h",
                }
              );

              return {
                user: user.id,
                token: token,
                tokenexpiration: 1,
              };
            };

            return check();
          } catch (err) {
            console.log(err);
          }
        };

        return loginUser();
      },
    },

    carts: {
      type: new GraphQLList(CartProductType),
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve(parentValue, { id }) {
        return CartSchema.find({ user: id })
          .populate("product")
          .then((results) => {
            return results.map((result) => {
              return {
                ...result._doc,
                cartID: result.id,
                productID: result.product.id,
                name: result.product.name,
                author: result.product.author,
                sku: result.product.sku,
                price: result.product.price,
                imageURL: result.product.imageURL,
                quantity: result.quantity,
              };
            });
          });
      },
    },

    cart: {
      type: CartType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve(parentValue, { id }) {
        return CartSchema.findById(id);
      },
    },

    orders: {
      type: new GraphQLList(OrderType),
      resolve(parentValue, args) {
        return OrderSchema.find();
      },
    },

    userOrder: {
      type: new GraphQLList(OrderItemType),
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve(parentValue, { id }) {
        async function userOrder() {
          try {
            const findUser = await OrderItemSchema.find({
              user: id,
            }).populate(["product", "orderID"]);

            let productStatus;
            for (let x of findUser) {
              productStatus = x.orderID.status;
            }

            return findUser.map((result) => {
              return {
                ...result._doc,
                id: result.id,
                name: result.product.name,
                author: result.product.author,
                sku: result.product.sku,
                price: result.product.price,
                imageURL: result.product.imageURL,
                quantity: result.quantity,
                status: productStatus,
              };
            });
          } catch (err) {
            console.log(err);
          }
        }

        return userOrder();
      },
    },

    wishlists: {
      type: new GraphQLList(WishListType),
      resolve(parentValue, args) {
        return WishListSchema.find();
      },
    },

    wishlist: {
      type: new GraphQLList(WishListProductType),
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve(parentValue, { id }) {
        return WishListSchema.find({ user: id })
          .populate("product")
          .then((results) => {
            return results.map((result) => {
              return {
                ...result._doc,
                wishID: result.id,
                productID: result.product.id,
                name: result.product.name,
                sku: result.product.sku,
                author: result.product.author,
                price: result.product.price,
                imageURL: result.product.imageURL,
                quantity: result.product.quantity,
              };
            });
          });
      },
    },

    reviews: {
      type: new GraphQLList(ReviewType),
      resolve(parentValue, args) {
        return ReviewSchema.find();
      },
    },

    review: {
      type: ReviewType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve(parentValue, { id }) {
        return ReviewSchema.findById(id);
      },
    },

    location: {
      type: new GraphQLList(LocationType),
      resolve(parentValue, args) {
        return LocationSchema.find();
      },
    },
  }),
});

const RootMutation = new GraphQLObjectType({
  name: "RootMutationType",
  fields: {
    addProduct: {
      type: ProductType,
      args: {
        name: {
          type: new GraphQLNonNull(GraphQLString),
        },
        sku: {
          type: new GraphQLNonNull(GraphQLString),
        },
        author: {
          type: new GraphQLNonNull(GraphQLString),
        },
        price: {
          type: new GraphQLNonNull(GraphQLString),
        },
        imageURL: {
          type: new GraphQLNonNull(GraphQLString),
        },
        quantity: {
          type: new GraphQLNonNull(GraphQLInt),
        },
        detail: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve(
        parentValue,
        { name, author, sku, price, imageURL, quantity, detail }
      ) {
        const product = new ProductSchema({
          name,
          author,
          sku,
          price,
          imageURL,
          quantity,
          detail,
        });

        async function addProduct() {
          try {
            const saveItem = product.save();
            return saveItem;
          } catch (err) {
            console.log(err);
          }
        }

        return addProduct();
      },
    },

    updateProduct: {
      type: ProductType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
        name: {
          type: GraphQLString,
        },
        author: {
          type: GraphQLString,
        },
        sku: {
          type: GraphQLString,
        },
        price: {
          type: GraphQLString,
        },
        imageURL: {
          type: GraphQLString,
        },
        quantity: {
          type: GraphQLInt,
        },
        detail: {
          type: GraphQLString,
        },
      },
      resolve(
        parentValue,
        { id, name, author, sku, price, imageURL, quantity, detail }
      ) {
        async function updateProduct() {
          try {
            const find = ProductSchema.findOneAndUpdate(
              { _id: id },
              {
                $set: { name, author, sku, price, imageURL, quantity, detail },
              },
              { omitUndefined: false }
            );
            return find;
          } catch (err) {
            console.log(err);
          }
        }
        return updateProduct();
      },
    },

    deleteProduct: {
      type: ProductType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve(parentValue, { id }) {
        async function deleteProduct() {
          try {
            const deleteItem = await ProductSchema.findByIdAndDelete(id);
            return deleteItem;
          } catch (err) {
            console.log(err);
          }
        }
        return deleteProduct();
      },
    },

    signup: {
      type: UserType,
      args: {
        username: {
          type: GraphQLString,
        },
        password: {
          type: GraphQLString,
        },
        first_name: {
          type: GraphQLString,
        },
        last_name: {
          type: GraphQLString,
        },
        email: {
          type: GraphQLString,
        },
        phone_number: {
          type: GraphQLInt,
        },
      },
      resolve(
        parentValue,
        { username, password, first_name, last_name, email, phone_number }
      ) {
        async function signup() {
          const hashedPassword = await bcrypt.hash(password, 12);
          const genericImage =
            "https://www.beautifulpeople.com/cdn/beautifulpeople/images/default_profile/signup_male.png";

          const user = new UserSchema({
            username: username,
            password: hashedPassword,
            first_name: first_name,
            last_name: last_name,
            email: email,
            phone_number: phone_number,
            verified: false,
            photoURL: genericImage,
          });

          try {
            const findUser = await UserSchema.findOne({
              email: String(user.email),
            });

            const findUsername = await UserSchema.findOne({
              username: String(user.username),
            });

            if (findUser) {
              return new Error("Email already exist");
            }

            if (findUsername) {
              return new Error("Username already exist");
            }

            const userSignup = await user.save();
            return userSignup;
          } catch (err) {
            console.log(err);
          }
        }

        return signup();
      },
    },

    photoUser: {
      type: UserType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
        photoURL: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve(parentValue, { id, photoURL }) {
        async function photoUser() {
          try {
            const photo = await UserSchema.updateOne(
              { _id: id },
              {
                $set: {
                  photoURL,
                },
              },
              { omitUndefined: false }
            );

            photo;

            return {
              id: id,
              photoURL: photoURL,
            };
          } catch (err) {
            console.log(err);
          }
        }

        return photoUser();
      },
    },

    updateUserName: {
      type: UserType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
        first_name: {
          type: GraphQLString,
        },
        last_name: {
          type: GraphQLString,
        },
      },
      resolve(parentValue, { id, first_name, last_name }) {
        async function updateUserName() {
          try {
            const updateUserName = await UserSchema.updateOne(
              { _id: id },
              {
                $set: {
                  first_name: first_name,
                  last_name: last_name,
                },
              },
              { omitUndefined: true }
            );

            updateUserName;
            return {
              id,
              first_name,
              last_name,
            };
          } catch (err) {
            console.log(err);
          }
        }

        return updateUserName();
      },
    },

    updateUserEmail: {
      type: UserType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
        email: {
          type: GraphQLString,
        },
        new_email: {
          type: GraphQLString,
        },
      },
      resolve(parentValue, { id, email, new_email }) {
        async function updateUserEmail() {
          try {
            const findEmail = await UserSchema.findOne({ email: email });

            if (findEmail.email !== email) {
              return new Error("Email is incorrect");
            }

            const updateUserEmail = await UserSchema.updateOne(
              { _id: id },
              {
                $set: {
                  email: new_email,
                },
              },
              { omitUndefined: true }
            );

            updateUserEmail;
            return {
              id,
              email: new_email,
            };
          } catch (err) {
            console.log(err);
          }
        }

        return updateUserEmail();
      },
    },

    updateUserPassword: {
      type: UserType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
        password: {
          type: GraphQLString,
        },
        new_password: {
          type: GraphQLString,
        },
      },
      resolve(parentValue, { id, password, new_password }) {
        async function updateUserPassword() {
          try {
            const findUser = await UserSchema.findOne({ _id: id });
            const isEqual = await bcrypt.compare(password, findUser.password);

            if (!isEqual) {
              return new Error("Password is incorrect");
            }

            const hashedPassword = await bcrypt.hash(new_password, 12);

            const updateUserPassword = await UserSchema.updateOne(
              { _id: id },
              {
                $set: {
                  password: hashedPassword,
                },
              },
              { omitUndefined: true }
            );
            updateUserPassword;
            return {
              id,
            };
          } catch (err) {
            console.log(err);
          }
        }

        return updateUserPassword();
      },
    },

    updateUserDetail: {
      type: UserType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
        username: {
          type: GraphQLString,
        },
        phone_number: {
          type: GraphQLString,
        },
        photoURL: {
          type: GraphQLString,
        },
        verified: {
          type: GraphQLBoolean,
        },
      },
      resolve(parentValue, { id, username, phone_number, photoURL, verified }) {
        async function updateUserDetails() {
          try {
            const findUser = await UserSchema.findOne({ _id: id });

            if (!findUser) {
              return new Error("User doesn't exist");
            }

            const updateUserDetails = await UserSchema.updateOne(
              { _id: id },
              {
                $set: {
                  username,
                  phone_number,
                  photoURL,
                  verified,
                },
              },
              { omitUndefined: true }
            );

            updateUserDetails;
            return {
              id,
              username,
              phone_number,
              photoURL,
              verified,
            };
          } catch (err) {
            console.log(err);
          }
        }

        return updateUserDetails();
      },
    },

    deleteUser: {
      type: UserType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve(parentValue, { id }) {
        return UserSchema.findByIdAndDelete(id);
      },
    },

    addCart: {
      type: CartType,
      args: {
        user: {
          type: new GraphQLNonNull(GraphQLID),
        },
        product: {
          type: new GraphQLNonNull(GraphQLID),
        },
        price: {
          type: new GraphQLNonNull(GraphQLString),
        },
        quantity: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve(parentValue, { user, product, price, quantity }) {
        async function addCart() {
          const cart = new CartSchema({
            user,
            product,
            price,
            quantity,
          });

          try {
            const findProduct = await CartSchema.findOne({
              product: cart.product,
            });

            const cartUser = String(cart.user);
            const cartProduct = String(cart.product);

            if (!findProduct) {
              const saveItem = async () => {
                await cart.save();
                const findUser = await UserSchema.findById(cartUser);

                await findUser.cart.push(cart);

                return findUser.save();
              };

              return saveItem();
            }

            if (findProduct) {
              const productUser = String(findProduct.user);
              const productID = String(findProduct.id);

              if (cartProduct === productID) {
                //console.log("another match");
                // const updateQuantity = await CartSchema.findOneAndUpdate(
                //   { _id: productID },
                //   { $set: { quantity } },
                //   { omitUndefined: false }
                // );

                // return updateQuantity;
                return new Error("Item already exist");
              }
            }
          } catch (err) {
            console.log(err);
          }
        }

        return addCart();
      },
    },

    deleteCart: {
      type: CartType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
        user: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve(parentValue, { id, user }) {
        async function deleteCart() {
          try {
            const cart = await CartSchema.findByIdAndDelete(id);

            const findUser = await UserSchema.findById(user);
            await findUser.cart.remove(id);
            await findUser.save();
            return cart;
          } catch (err) {
            console.log(err);
          }
        }

        deleteCart();
      },
    },

    addOrder: {
      type: OrderType,
      args: {
        user: {
          type: new GraphQLNonNull(GraphQLID),
        },
        products: {
          type: GraphQLList(GraphQLID),
        },
        orderNumber: {
          type: GraphQLString,
        },
        orderValue: {
          type: GraphQLString,
        },
      },
      resolve(
        parentValue,
        { user, products, orderNumber, orderValue, status = "Pending" }
      ) {
        async function createOrder() {
          try {
            let items = [];

            for (productID of products) {
              const findProduct = await CartSchema.findOne({ _id: productID });
              items.push(findProduct.product);
            }

            const order = new OrderSchema({
              user,
              products: items,
              orderNumber,
              orderValue,
              status,
            });

            const saveItem = await order.save();

            const findUser = await UserSchema.findById(user);

            await findUser.order.push(order);

            await findUser.save();

            async function saveOrderItem() {
              for (x of products) {
                const findQty = await CartSchema.findOne({ _id: x });

                const saveOrderItem = await new OrderItemSchema({
                  user: saveItem.user,
                  orderID: saveItem.id,
                  product: findQty.product,
                  quantity: findQty.quantity,
                });

                await saveOrderItem.save();
              }
            }

            await saveOrderItem();

            return order;
          } catch (err) {
            console.log(err);
          }
        }

        return createOrder();
      },
    },

    deleteOrder: {
      type: CartType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve(parentValue, { id }) {
        async function deleteOrder() {
          try {
            const order = await OrderSchema.findByIdAndDelete(id);
            const findUser = await UserSchema.findById(order.user);
            await findUser.order.remove(id);
            return findUser.save();
          } catch (err) {
            console.log(err);
          }
        }

        return deleteOrder();
      },
    },

    addWishlist: {
      type: WishListType,
      args: {
        user: {
          type: new GraphQLNonNull(GraphQLID),
        },
        product: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve(parentValue, { user, product }) {
        const wishlist = new WishListSchema({
          user,
          product,
        });

        async function addWishlist() {
          try {
            const findProduct = await WishListSchema.findOne({
              product,
            });

            const wishlistUser = String(user);
            const wishlistProduct = String(product);

            if (!findProduct) {
              const saveItem = await wishlist.save();

              const findUser = await UserSchema.findById(saveItem.user);

              await findUser.wishlist.push(wishlist);
              await findUser.save();
              return wishlist;
            }

            if (findProduct) {
              const productUser = String(findProduct.user);
              const productID = await String(findProduct.product);

              if (wishlistProduct === productID) {
                return new Error("");
              }
            }
          } catch (err) {
            console.log(err);
          }
        }

        return addWishlist();
      },
    },

    deleteWishlist: {
      type: WishListType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve(parentValue, { id }) {
        async function deleteWishlist() {
          try {
            const wishlist = await WishListSchema.findByIdAndDelete(id);
            const findUser = await UserSchema.findById(wishlist.user);
            await findUser.wishlist.remove(id);
            await findUser.save();

            return wishlist;
          } catch (err) {
            console.log(err);
          }
        }
        return deleteWishlist();
      },
    },

    addReview: {
      type: ReviewType,
      args: {
        user: {
          type: new GraphQLNonNull(GraphQLID),
        },
        product: {
          type: new GraphQLNonNull(GraphQLID),
        },
        rating: {
          type: new GraphQLNonNull(GraphQLInt),
        },
        text: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve(parentValue, { user, product, rating, text }) {
        const review = new ReviewSchema({
          user,
          product,
          rating,
          text,
        });

        async function createReview() {
          try {
            const saveItem = await review.save();

            const findProduct = await ProductSchema.findById(saveItem.product);
            const findUser = await UserSchema.findById(saveItem.user);

            const multipleSave = async () => {
              await findProduct.review.push(review);
              await findUser.review.push(review);

              return findProduct.save(), findUser.save();
            };

            await multipleSave();

            return saveItem;
          } catch (err) {
            console.log(err);
          }
        }

        return createReview();
      },
    },

    deleteReview: {
      type: ReviewType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve(parentValue, { id }) {
        async function deleteReview() {
          try {
            const removeReview = await ReviewSchema.findByIdAndDelete(id);

            const findProduct = await ProductSchema.findById(
              removeReview.product
            );

            const findUser = await UserSchema.findById(removeReview.user);

            const multipleDelete = async () => {
              await findProduct.review.remove(id);
              await findUser.review.remove(id);

              return findProduct.save(), findUser.save();
            };

            await multipleDelete();

            return removeReview;
          } catch (err) {
            console.log(err);
          }
        }

        return deleteReview();
      },
    },

    addLocation: {
      type: LocationType,
      args: {
        location: {
          type: new GraphQLNonNull(GraphQLString),
        },
        fee: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve(parentValue, { location, fee }) {
        const userLocation = new LocationSchema({
          location,
          fee,
        });
        async function addLocation() {
          try {
            await userLocation.save();

            return userLocation;
          } catch (err) {
            console.log(err);
          }
        }

        return addLocation();
      },
    },

    updateLocation: {
      type: LocationType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
        location: {
          type: GraphQLString,
        },
        fee: {
          type: GraphQLString,
        },
      },
      resolve(parentValue, { id, location, fee }) {
        async function updateLocation() {
          try {
            const update = await LocationSchema.updateOne(
              { _id: id },
              {
                $set: {
                  location,
                  fee,
                },
              },
              { omitUndefined: false }
            );

            update;

            return {
              id,
              location,
              fee,
            };
          } catch (err) {
            console.log(err);
          }
        }

        return updateLocation();
      },
    },

    deleteLocation: {
      type: LocationType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve(parentValue, { id }) {
        async function deleteLocation() {
          try {
            const deleteItem = await LocationSchema.findByIdAndDelete(id);
            return deleteItem;
          } catch (err) {
            console.log(err);
          }
        }

        return deleteLocation();
      },
    },
  },
});

const DataSchema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});

module.exports = DataSchema;

// 0242 315960
// Auntie Christie

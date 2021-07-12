const graphql = require("graphql");
const {
  GraphQLObjectType,
  GraphQLInterfaceType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLID,
  GraphQLBoolean,
  GraphQLFloat,
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
const PaymentSchema = require("../db/schema/payment");
const DeliverySchema = require("../db/schema/delivey");
const models = require("../db/index");

const DeliveryType = new GraphQLObjectType({
  name: "DeliveryType",
  fields: () => ({
    location: { type: GraphQLString },
    address: { type: GraphQLString },
    phoneNumber: { type: GraphQLString },
  }),
});

const AdjustQuantityType = new GraphQLObjectType({
  name: "AdjustQuantityType",
  fields: () => ({
    product: { type: GraphQLID },
    quantity: { type: GraphQLString },
  }),
});

const PaginationType = new GraphQLObjectType({
  name: "PaginationType",
  fields: () => ({
    count: { type: GraphQLInt },
    data: { type: GraphQLList(ProductType) },
  }),
});

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
    rating: { type: GraphQLFloat },
    review: { type: GraphQLList(ReviewType) },
  }),
});

const UserType = new GraphQLObjectType({
  name: "UserType",
  fields: () => ({
    id: { type: GraphQLID },
    userName: { type: GraphQLString },
    password: { type: GraphQLString },
    newPassword: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    newEmail: { type: GraphQLString },
    photoURL: { type: GraphQLString },
    phoneNumber: { type: GraphQLString },
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

const WishListType = new GraphQLObjectType({
  name: "WishListType",
  fields: () => ({
    id: { type: GraphQLID },
    user: { type: GraphQLID },
    product: { type: GraphQLID },
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
    payment: { type: GraphQLID },
    delivery: { type: GraphQLID },
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

const ReviewType = new GraphQLObjectType({
  name: "ReviewType",
  fields: () => ({
    id: { type: GraphQLID },
    user: { type: UserType },
    product: { type: GraphQLID },
    rating: { type: GraphQLInt },
    text: { type: GraphQLString },
    createdAt: { type: GraphQLString },
  }),
});

const AddReviewType = new GraphQLObjectType({
  name: "AddReviewType",
  fields: () => ({
    id: { type: GraphQLID },
    user: { type: GraphQLID },
    product: { type: GraphQLID },
    rating: { type: GraphQLInt },
    text: { type: GraphQLString },
    createdAt: { type: GraphQLString },
  }),
});

const LoginType = new GraphQLObjectType({
  name: "LoginType",
  fields: () => ({
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    verified: { type: GraphQLBoolean },
    password: { type: GraphQLString },
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
    disable: { type: GraphQLBoolean },
  }),
});

const PaymentType = new GraphQLObjectType({
  name: "PaymentType",
  fields: () => ({
    id: { type: GraphQLID },
    orderNumber: { type: GraphQLString },
    method: { type: GraphQLString },
    status: { type: GraphQLString },
    momoName: { type: GraphQLString },
    momoNumber: { type: GraphQLString },
    momoTransactionID: { type: GraphQLString },
    location: { type: GraphQLString },
    address: { type: GraphQLString },
    phoneNumber: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: () => ({
    products: {
      type: PaginationType,
      args: {
        offset: {
          type: GraphQLInt,
        },
        limit: {
          type: GraphQLInt,
        },
      },
      resolve(parentValue, { offset, limit }) {
        async function findProducts() {
          const productsCount = await ProductSchema.estimatedDocumentCount();

          const data = await ProductSchema.find()
            .skip(limit * offset - limit)
            .limit(limit);

          return {
            count: productsCount,
            data: data,
          };
        }

        return findProducts();
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
        async function findProduct() {
          let ratingArray = [];
          let productRating;
          const data = await ProductSchema.findOne({ sku: sku }).populate([
            "review",
          ]);

          const reviews = await ReviewSchema.find({
            product: data._id,
          }).populate("user");

          for (review of reviews) {
            const productRatings = review.rating;
            ratingArray.push(productRatings);
          }

          if (ratingArray.length === 0) {
            productRating = 0;
          } else {
            const sum = await ratingArray.reduce((a, b) => a + b);
            productRating = sum / ratingArray.length;
          }

          const reviewData = reviews.map((result) => {
            return {
              ...result._doc,
              id: result.id,
              user: {
                firstName: result.user.firstName,
                lastName: result.user.lastName,
                photoURL: result.user.photoURL,
              },
              rating: result.rating,
              text: result.text,
              createdAt: result.created_at,
            };
          });

          return {
            ...data._doc,
            id: data.id,
            name: data.name,
            sku: data.sku,
            author: data.author,
            price: data.price,
            imageURL: data.imageURL,
            quantity: data.quantity,
            detail: data.detail,
            rating: productRating,
            review: reviewData,
          };
        }

        return findProduct();
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
      resolve(parentValue) {
        return UserSchema.find();
      },
    },

    user: {
      type: UserType,
      args: {},
      resolve(parentValue, {}, req) {
        const userDetails = async () => {
          if (!req.isAuth) {
            return new Error("Unauthenticated");
          }

          try {
            const data = await UserSchema.findById(req.userID).populate([
              "cart",
              "order",
              "wishlist",
              "review",
            ]);

            //  const data = await UserSchema.findById(req.userID);

            return data;
          } catch (err) {
            return new Error("Error");
          }
        };

        return userDetails();
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

            if (!user) {
              return new Error("Not registered");
            }

            const compareCurrentPassword = await bcrypt.compare(
              password,
              user.password
            );

            if (!compareCurrentPassword) {
              return new Error("Password is incorrect");
            }

            const token = await jwt.sign(
              { userID: user._id },
              "somesupersecretkey",
              {
                expiresIn: "5h",
              }
            );

            return {
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              verified: user.verified,
              token: token,
              tokenexpiration: 1,
            };
          } catch (err) {
            return new Error("User does not exist");
          }
        };

        return loginUser();
      },
    },

    carts: {
      type: new GraphQLList(CartProductType),
      resolve(parentValue, { id }, req) {
        const getCartItem = async () => {
          if (!req.isAuth) {
            return new Error("Unauthenticated");
          }
          try {
            const userCartItems = await CartSchema.find({
              user: req.userID,
            }).populate("product");

            const mapUserCartItems = userCartItems.map((result) => {
              return {
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

            return mapUserCartItems;
          } catch (err) {
            console.log(err);
          }
        };

        return getCartItem();
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
      resolve(parentValue) {
        return OrderSchema.find();
      },
    },

    userOrder: {
      type: new GraphQLList(OrderItemType),
      resolve(parentValue, {}, req) {
        async function userOrder() {
          if (!req.isAuth) {
            return new Error("Unauthenticated");
          }

          try {
            const userOrderItems = await OrderItemSchema.find({
              user: req.userID,
            }).populate(["product", "orderID"]);

            let productStatus;
            for (let x of userOrderItems) {
              productStatus = x.orderID.status;
            }

            const mapUserOrderItems = await userOrderItems.map((result) => {
              return {
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

            return mapUserOrderItems;

            // return findUser.map((result) => {
            //   return {
            //     ...result._doc,
            //     id: result.id,
            //     name: result.product.name,
            //     author: result.product.author,
            //     sku: result.product.sku,
            //     price: result.product.price,
            //     imageURL: result.product.imageURL,
            //     quantity: result.quantity,
            //     status: productStatus,
            //   };
            // });
          } catch (err) {
            console.log(err);
          }
        }

        return userOrder();
      },
    },

    getOrderAmount: {
      type: OrderType,
      args: {
        orderNumber: {
          type: GraphQLString,
        },
      },
      resolve(parentValue, { orderNumber }, req) {
        async function getAmount() {
          if (!req.isAuth) {
            return new Error("Unauthenticated");
          }

          try {
            const getOrderValue = await OrderSchema.findOne({
              orderNumber: orderNumber,
            });
            return getOrderValue;
          } catch (err) {
            console.log(err);
          }
        }

        return getAmount();
      },
    },

    wishlists: {
      type: new GraphQLList(WishListType),
      resolve(parentValue) {
        return WishListSchema.find();
      },
    },

    wishlist: {
      type: new GraphQLList(WishListProductType),
      resolve(parentValue, { id }, req) {
        if (!req.isAuth) {
          return new Error("Unauthenticated");
        }

        return WishListSchema.find({ user: req.userID })
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
      args: {
        sku: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve(parentValue, { sku }) {
        async function review() {
          try {
            const findProduct = await ProductSchema.findOne({ sku: sku });

            const reviews = await ReviewSchema.find({
              product: findProduct._id,
            }).populate("user");

            return reviews.map((result) => {
              return {
                ...result._doc,
                id: result.id,
                user: {
                  firstName: result.user.firstName,
                  lastName: result.user.lastName,
                  photoURL: result.user.photoURL,
                },
                rating: result.rating,
                text: result.text,
                createdAt: result.created_at,
              };
            });
          } catch (err) {
            console.log(err);
          }
        }
        return review();
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
      resolve(parentValue) {
        return LocationSchema.find();
      },
    },

    verification: {
      type: UserType,
      resolve(parentValue, { id }, req) {
        async function verificationStatus() {
          if (!req.isAuth) {
            return new Error("Unauthenticated");
          }

          try {
            const getStatus = await UserSchema.findById(req.userID);

            return getStatus;
          } catch (err) {
            console.log(err);
          }
        }

        return verificationStatus();
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
        { id, name, author, sku, price, imageURL, quantity, detail },
        req
      ) {
        async function updateProduct() {
          if (!req.isAuth) {
            return new Error("Unauthenticated");
          }

          try {
            const find = ProductSchema.findOneAndUpdate(
              { _id: req.userID },
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
      resolve(parentValue, { id }, req) {
        async function deleteProduct() {
          if (!req.isAuth) {
            return new Error("Unauthenticated");
          }
          try {
            await ProductSchema.findByIdAndDelete(id);
            return true;
          } catch (err) {
            return false;
          }
        }
        return deleteProduct();
      },
    },

    signup: {
      type: UserType,
      args: {
        userName: {
          type: GraphQLString,
        },
        password: {
          type: GraphQLString,
        },
        firstName: {
          type: GraphQLString,
        },
        lastName: {
          type: GraphQLString,
        },
        email: {
          type: GraphQLString,
        },
        phoneNumber: {
          type: GraphQLString,
        },
      },
      resolve(
        parentValue,
        { userName, firstName, lastName, email, password, phoneNumber }
      ) {
        async function signup() {
          const saltRounds = 12;
          const hashedPassword = await bcrypt.hash(password, saltRounds);

          const genericImage =
            "https://www.beautifulpeople.com/cdn/beautifulpeople/images/default_profile/signup_male.png";

          const user = new UserSchema({
            userName: userName,
            password: hashedPassword,
            firstName: firstName,
            lastName: lastName,
            email: email,
            phoneNumber: phoneNumber,
            verified: false,
            photoURL: genericImage,
          });

          try {
            const findEmail = await UserSchema.findOne({
              email: String(user.email),
            });

            const findUserName = await UserSchema.findOne({
              email: String(user.userName),
            });

            if (findEmail) {
              return new Error("Email already exist");
            }

            if (findUserName) {
              return new Error("Username already exist");
            }

            const userSignup = await user.save();

            // jwt.sign(
            //   { userID: user._id, email: user.email },
            //   "somesupersecretkey"            );

            return jwt.sign({ userID: userSignup._id }, "somesupersecretkey");
          } catch (err) {
            return new Error("Error creating account");
          }
        }

        return signup();
      },
    },

    photoUser: {
      type: UserType,
      args: {
        photoURL: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve(parentValue, { id, photoURL }, req) {
        async function photoUser() {
          if (!req.isAuth) {
            return new Error("Unauthenticated");
          }

          try {
            const photo = await UserSchema.updateOne(
              { _id: req.userID },
              {
                $set: {
                  photoURL,
                },
              },
              { omitUndefined: false }
            );

            photo;

            return {
              id: req.userID,
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
        firstName: {
          type: GraphQLString,
        },
        lastName: {
          type: GraphQLString,
        },
      },
      resolve(parentValue, { firstName, lastName }, req) {
        async function updateUserName() {
          if (!req.isAuth) {
            return new Error("Unauthenticated");
          }

          try {
            const updateUserName = await UserSchema.updateOne(
              { _id: req.userID },
              {
                $set: {
                  firstName: firstName,
                  lastName: lastName,
                },
              },
              { omitUndefined: true }
            );

            updateUserName;
            return {
              id: req.userID,
              firstName,
              lastName,
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
        email: {
          type: GraphQLString,
        },
        newEmail: {
          type: GraphQLString,
        },
      },
      resolve(parentValue, { id, email, newEmail }, req) {
        async function updateUserEmail() {
          if (!req.isAuth) {
            return new Error("Unauthenticated");
          }

          try {
            const findEmail = await UserSchema.findOne({ email: email });

            if (findEmail.email !== email) {
              return new Error("Email is incorrect");
            }

            const updateUserEmail = await UserSchema.updateOne(
              { _id: req.userID },
              {
                $set: {
                  email: newEmail,
                },
              },
              { omitUndefined: true }
            );

            updateUserEmail;
            return {
              id: req.userID,
              email: newEmail,
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
        password: {
          type: GraphQLString,
        },
        newPassword: {
          type: GraphQLString,
        },
      },
      resolve(parentValue, { id, password, newPassword }, req) {
        async function updateUserPassword() {
          if (!req.isAuth) {
            return new Error("Unauthenticated");
          }

          try {
            const findUser = await UserSchema.findOne({ _id: req.userID });

            const compareCurrentPassword = await bcrypt.compare(
              password,
              findUser.password
            );

            const compareOldPasswordToNewPassword = await bcrypt.compare(
              findUser.password,
              newPassword
            );

            if (!compareCurrentPassword) {
              return new Error("Current Password is incorrect");
            }

            if (compareOldPasswordToNewPassword) {
              return new Error(
                "You have previously used this password. Please enter a new and unique password."
              );
            }

            const saltRounds = 12;
            const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

            const updateUserPassword = await UserSchema.updateOne(
              { _id: req.userID },
              {
                $set: {
                  password: hashedPassword,
                },
              },
              { omitUndefined: true }
            );
            updateUserPassword;
            return {
              id: req.userID,
            };
          } catch (err) {
            return new Error("Password update failed");
          }
        }

        return updateUserPassword();
      },
    },

    updateUserDetail: {
      type: UserType,
      args: {
        userName: {
          type: GraphQLString,
        },
        phoneNumber: {
          type: GraphQLString,
        },
        photoURL: {
          type: GraphQLString,
        },
        verified: {
          type: GraphQLBoolean,
        },
      },
      resolve(
        parentValue,
        { id, userName, phoneNumber, photoURL, verified },
        req
      ) {
        async function updateUserDetails() {
          if (!req.isAuth) {
            return new Error("Unauthenticated");
          }

          try {
            const findUser = await UserSchema.findOne({ _id: req.userID });

            if (!findUser) {
              return new Error("User doesn't exist");
            }

            const updateUserDetails = await UserSchema.updateOne(
              { _id: req.userID },
              {
                $set: {
                  userName,
                  phoneNumber,
                  photoURL,
                  verified,
                },
              },
              { omitUndefined: true }
            );

            updateUserDetails;
            return {
              id: req.userID,
              userName,
              phoneNumber,
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
      resolve(parentValue, { id }, req) {
        async function deleteUser() {
          if (!req.isAuth) {
            return new Error("Unauthenticated");
          }

          try {
            await UserSchema.findByIdAndDelete(req.userID);
            return true;
          } catch (err) {
            return false;
          }
        }
        return deleteUser();
      },
    },

    addCart: {
      type: CartType,
      args: {
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
      resolve(parentValue, { user, product, price, quantity }, req) {
        async function addCart() {
          if (!req.isAuth) {
            return new Error("Unauthenticated");
          }

          const cart = new CartSchema({
            user: req.userID,
            product,
            price,
            quantity,
          });

          try {
            const checkAvailability = await CartSchema.findOne({
              product: cart.product,
              user: cart.user,
            });

            if (checkAvailability === null) {
              const saveItem = async () => {
                await cart.save();

                const findUser = await UserSchema.findById(cart.user);

                await findUser.cart.push(cart);

                await findUser.save();

                return cart;
              };

              return saveItem();
            }

            const convert2Number = Number(checkAvailability.quantity) + 1;
            const quantity = String(convert2Number);

            const updateQuantity = await CartSchema.findOneAndUpdate(
              { _id: checkAvailability.id },
              { $set: { quantity } },
              { omitUndefined: false }
            );

            return updateQuantity;
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
      },
      resolve(parentValue, { id }, req) {
        async function deleteCart() {
          if (!req.isAuth) {
            return new Error("Unauthenticated");
          }

          try {
            const cart = await CartSchema.findByIdAndDelete(id);

            const findUser = await UserSchema.findById(cart.user);
            await findUser.cart.remove(id);
            await findUser.save();
            return cart;
          } catch (err) {
            console.log(err);
          }
        }

        return deleteCart();
      },
    },

    incrementCartItem: {
      type: AdjustQuantityType,
      args: {
        product: {
          type: new GraphQLNonNull(GraphQLID),
        },
        quantity: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve(parentValue, { product, quantity }, req) {
        async function incrementQty() {
          if (!req.isAuth) {
            return new Error("Unauthenticated");
          }

          try {
            const checkAvailability = await CartSchema.findById(product);

            if (!checkAvailability) {
              return;
            }

            const convert2Number = Number(checkAvailability.quantity) + 1;
            const quantity = String(convert2Number);

            await CartSchema.findOneAndUpdate(
              { _id: checkAvailability.id },
              { $set: { quantity } },
              { omitUndefined: false }
            );
          } catch (err) {
            console.log(err);
          }
        }

        return incrementQty();
      },
    },

    decrementCartItem: {
      type: AdjustQuantityType,
      args: {
        product: {
          type: new GraphQLNonNull(GraphQLID),
        },
        quantity: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve(parentValue, { product, quantity }, req) {
        async function incrementQty() {
          if (!req.isAuth) {
            return new Error("Unauthenticated");
          }

          try {
            const checkAvailability = await CartSchema.findById(product);

            if (!checkAvailability) {
              return;
            }

            const convert2Number = Number(checkAvailability.quantity) - 1;
            const quantity = String(convert2Number);

            await CartSchema.findOneAndUpdate(
              { _id: checkAvailability.id },
              { $set: { quantity } },
              { omitUndefined: false }
            );
          } catch (err) {
            console.log(err);
          }
        }

        return incrementQty();
      },
    },

    addOrder: {
      type: OrderType,
      args: {
        user: {
          type: GraphQLID,
        },
        products: {
          type: GraphQLList(GraphQLID),
        },
        payment: {
          type: GraphQLID,
        },
        delivery: {
          type: GraphQLID,
        },
        orderNumber: {
          type: GraphQLString,
        },
        orderValue: {
          type: GraphQLString,
        },
      },
      resolve(parentValue, { products, orderNumber }, req) {
        async function createOrder() {
          if (!req.isAuth) {
            return new Error("Unauthenticated");
          }

          try {
            let items = [];

            // products.forEach((product) => {
            //   const findProduct = await CartSchema.findOne({ _id: product });
            //   items.push(findProduct.product);
            //   //    items[items.length] = product;
            // });

            for (productID of products) {
              const findProduct = await CartSchema.findOne({ _id: productID });
              items.push(findProduct.product);
            }

            const order = new OrderSchema({
              user: req.userID,
              products: items,
              orderNumber,
              orderValue: String(0),
              status: "pending",
            });

            //save order in ORDER collection
            const saveItem = await order.save();

            //find user in saved USER collection
            const findUser = await UserSchema.findById(order.user);

            //push saved order ID to user doc in USER collection
            await findUser.order.push(order);
            await findUser.save();

            //loop user ORDER products list
            //in the list grab each product's ID
            //check if grabbed ID is in user's CART collection
            //find each product's quantity
            //create ORDERITEM collection
            //save product doc in ORDERITEM collection
            async function saveOrderItem() {
              let collect = [];

              for (productID of products) {
                const findQty = await CartSchema.findOne({ _id: productID });

                //get a product's price and quantity
                //multiply result
                const getAmountPayablePerProduct =
                  Number(findQty.price) * Number(findQty.quantity);
                //push getAmountPayablePerProduct to collect array
                collect.push(getAmountPayablePerProduct);

                const saveOrderItem = await new OrderItemSchema({
                  user: saveItem.user,
                  orderID: saveItem.id,
                  product: findQty.product,
                  quantity: findQty.quantity,
                });

                await saveOrderItem.save();
              }

              //function to sum array contents
              function sumPrice(total, value) {
                return total + value;
              }

              //sum array items
              let sum = collect.reduce(sumPrice);

              //find order doc in ORDER collection
              //update orderValue with value from sum fumc
              await OrderSchema.findOneAndUpdate(
                { _id: saveItem._id },
                {
                  $set: { orderValue: String(sum.toFixed(2)) },
                },
                { omitUndefined: false }
              );
            }

            async function deleteItemFromCart() {
              //     console.log(products);
              for (productID of products) {
                await CartSchema.findOneAndDelete({
                  _id: productID,
                });

                //remove order in User collection
                await findUser.cart.remove(productID);
                await findUser.save();
              }
            }

            await saveOrderItem();

            await deleteItemFromCart();

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
      resolve(parentValue, { id }, req) {
        async function deleteOrder() {
          if (!req.isAuth) {
            return new Error("Unauthenticated");
          }

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

    deleteOrderItem: {
      type: CartType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve(parentValue, { id }, req) {
        async function deleteOrderItem() {
          if (!req.isAuth) {
            return new Error("Unauthenticated");
          }

          try {
            const findItem = await OrderItemSchema.findById(id);
            const getProductIDFromOrderItem = await findItem.product;
            const getQuantityFromOrderItem = await findItem.quantity;
            const getProductPrice = await ProductSchema.findById(
              getProductIDFromOrderItem
            );

            //    console.log(getProductIDFromOrderItem);
            //      console.log(getQuantityFromOrderItem);
            //        console.log(getProductPrice.price);

            const getAmountPayablePerProduct =
              Number(getQuantityFromOrderItem) * Number(getProductPrice.price);

            const findOrder = await OrderSchema.findById(findItem.orderID);

            const getOrderValue = await findOrder.orderValue;
            const deductDeleteItemAmount =
              Number(getOrderValue) - Number(getAmountPayablePerProduct);

            if (findOrder.products.length > 1) {
              //         console.log("array length > 1");
              await OrderItemSchema.findByIdAndDelete(id);
              await findOrder.products.remove(getProductIDFromOrderItem);
              await findOrder.save();

              await OrderSchema.findOneAndUpdate(
                { _id: findOrder._id },
                {
                  $set: {
                    orderValue: String(deductDeleteItemAmount.toFixed(2)),
                  },
                },
                { omitUndefined: false }
              );

              return findItem;
            }

            if (findOrder.products.length === 1) {
              //    console.log("array length = 1");

              await OrderItemSchema.findByIdAndDelete(id);
              await OrderSchema.findByIdAndDelete(findOrder._id);
              await DeliverySchema.findByIdAndDelete(findOrder.delivery);
              await PaymentSchema.findByIdAndDelete(findOrder.payment);
              //find order in USER collection
              const findUser = await UserSchema.findById(findOrder.user);
              //remove order in User collection
              await findUser.order.remove(findOrder._id);
              await findUser.save();

              return findItem;
            }
          } catch (err) {
            console.log(err);
          }
        }

        return deleteOrderItem();
      },
    },

    addWishlist: {
      type: WishListType,
      args: {
        product: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve(parentValue, { user, product }, req) {
        const wishlist = new WishListSchema({
          user: req.userID,
          product,
        });

        async function addWishlist() {
          try {
            const checkAvailability = await WishListSchema.findOne({
              product: wishlist.product,
              user: wishlist.user,
            });

            if (checkAvailability === null) {
              const saveItem = async () => {
                await wishlist.save();

                const findUser = await UserSchema.findById(wishlist.user);

                await findUser.wishlist.push(wishlist);
                await findUser.save();
                return wishlist;
              };

              return saveItem();
            }

            return wishlist;
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
      resolve(parentValue, { id }, req) {
        async function deleteWishlist() {
          if (!req.isAuth) {
            return new Error("Unauthenticated");
          }
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
      type: AddReviewType,
      args: {
        product: {
          type: GraphQLID,
        },
        rating: {
          type: GraphQLInt,
        },
        text: {
          type: GraphQLString,
        },
      },
      resolve(parentValue, { product, rating, text }, req) {
        async function createReview() {
          if (!req.isAuth) {
            return new Error("Unauthenticated");
          }

          try {
            const review = new ReviewSchema({
              user: req.userID,
              product,
              rating,
              text,
            });

            const saveItem = await review.save();

            const findProduct = await ProductSchema.findById(saveItem.product);
            const findUser = await UserSchema.findById(saveItem.user);

            const multipleSave = async () => {
              await findProduct.review.push(review);
              await findUser.review.push(review);

              return findProduct.save(), findUser.save();
            };

            await multipleSave();

            return review;
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
      resolve(parentValue, { id }, req) {
        async function deleteReview() {
          if (!req.isAuth) {
            return new Error("Unauthenticated");
          }
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
      resolve(parentValue, { id }, req) {
        async function deleteLocation() {
          if (!req.isAuth) {
            return new Error("Unauthenticated");
          }
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

    addPayment: {
      type: PaymentType,
      args: {
        method: {
          type: new GraphQLNonNull(GraphQLString),
        },
        status: {
          type: GraphQLString,
        },
        momoName: {
          type: GraphQLString,
        },
        momoNumber: {
          type: GraphQLString,
        },
        momoTransactionID: {
          type: GraphQLString,
        },
        orderNumber: {
          type: GraphQLString,
        },
        location: {
          type: GraphQLString,
        },
        address: {
          type: GraphQLString,
        },
        phoneNumber: {
          type: GraphQLString,
        },
      },
      resolve(
        parentValue,
        {
          method,
          momoName,
          momoNumber,
          momoTransactionID,
          orderNumber,
          location,
          address,
          phoneNumber,
        },
        req
      ) {
        async function addPayment() {
          if (!req.isAuth) {
            return new Error("Unauthenticated");
          }

          try {
            const payment = new PaymentSchema({
              method,
              status: "pending",
              momoName,
              momoNumber,
              momoTransactionID,
            });

            const delivery = new DeliverySchema({
              location,
              address,
              phoneNumber,
            });

            const savePayment = await payment.save();
            const saveDelivery = await delivery.save();

            const Update = await OrderSchema.updateOne(
              { orderNumber: orderNumber },
              {
                $set: {
                  payment: savePayment.id,
                  delivery: saveDelivery.id,
                },
              },
              { omitUndefined: false }
            );

            Update;

            return payment;
          } catch (err) {
            console.log(err);
          }
        }

        return addPayment();
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

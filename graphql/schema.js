const graphql = require("graphql");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLID,
} = graphql;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const ProductSchema = require("../db/schema/product");
const UserSchema = require("../db/schema/user");
const CartSchema = require("../db/schema/cart");
const OrderSchema = require("../db/schema/order");

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
  }),
});

const UserType = new GraphQLObjectType({
  name: "UserType",
  fields: () => ({
    id: { type: GraphQLID },
    username: { type: GraphQLString },
    password: { type: GraphQLString },
    first_name: { type: GraphQLString },
    last_name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone_number: { type: GraphQLString },
    cart: { type: GraphQLList(CartType) },
  }),
});

const CartType = new GraphQLObjectType({
  name: "CartType",
  fields: () => ({
    id: { type: GraphQLID },
    user: { type: GraphQLID },
    product: { type: GraphQLID },
    price: { type: GraphQLString },
    quantity: { type: GraphQLString },
  }),
});

const OrderType = new GraphQLObjectType({
  name: "OrderType",
  fields: () => ({
    id: { type: GraphQLID },
    user: { type: UserType },
    products: { type: ProductType },
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
        return UserSchema.findById(id);
      },
    },

    carts: {
      type: new GraphQLList(CartType),
      resolve(parentValue, args) {
        return CartSchema.find();
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

    order: {
      type: OrderType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve(parentValue, { id }) {
        return OrderSchema.findById(id);
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

        product.save();
        return product;
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
        const find = ProductSchema.findOneAndUpdate(
          { _id: id },
          { $set: { name, author, sku, price, imageURL, quantity, detail } },
          { omitUndefined: false }
        );
        return find;
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
        return ProductSchema.findByIdAndDelete(id);
      },
    },

    addUser: {
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
        const update = async () => {
          const hashedPassword = await bcrypt.hash(password, 12);

          const user = new UserSchema({
            username: username,
            password: hashedPassword,
            first_name: first_name,
            last_name: last_name,
            email: email,
            phone_number: phone_number,
          });

          user.save();
          return user;
        };

        return update();
      },
    },

    updateUser: {
      type: UserType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
        password: {
          type: GraphQLString,
        },
        username: {
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
          type: GraphQLString,
        },
      },
      resolve(
        parentValue,
        { id, username, password, first_name, last_name, email, phone_number }
      ) {
        const find = UserSchema.updateOne(
          { _id: id },
          {
            $set: {
              username,
              password,
              first_name,
              last_name,
              email,
              phone_number,
            },
          },
          { omitUndefined: false }
        );
        return find;
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
      resolve(parentValue, { user, products }) {
        console.log(user, products);
        const cart = new CartSchema({
          user,
          product,
          price,
          quantity
        });

        cart.save();
        return cart;
      },
    },

    addOrder: {
      type: OrderType,
      args: {
        user: {
          type: new GraphQLNonNull(GraphQLString),
        },
        product: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve(parentValue, { user, product }) {
        const order = new OrderSchema({
          user,
          product,
        });

        order.save();
        return order;
      },
    },
  },
});

const DataSchema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});

module.exports = DataSchema;

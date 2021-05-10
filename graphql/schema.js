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
    price: { type: GraphQLString },
    imageURL: { type: GraphQLString },
    quantity: { type: GraphQLInt },
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
  }),
});

const CartType = new GraphQLObjectType({
  name: "CartType",
  fields: () => ({
    id: { type: GraphQLID },
    user: { type: UserType },
    products: { type: ProductType },
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
      resolve(parentValue, { user }) {
        return ProductSchema.findOne({ sku });
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
        price: {
          type: new GraphQLNonNull(GraphQLString),
        },
        imageURL: {
          type: new GraphQLNonNull(GraphQLString),
        },
        quantity: {
          type: new GraphQLNonNull(GraphQLInt),
        },
      },
      resolve(parentValue, { name, sku, price, imageURL, quantity }) {
        var product = new ProductSchema({
          name,
          sku,
          price,
          imageURL,
          quantity,
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
      },
      resolve(parentValue, { id, name, sku, price, imageURL, quantity }) {
        return ProductType.updateOne(
          { _id: id },
          { $set: { name } },
          { $set: { sku } },
          { $set: { price } },
          { $set: { imageURL } },
          { $set: { quantity } }
        );
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
          type: new GraphQLNonNull(GraphQLString),
        },
        password: {
          type: new GraphQLNonNull(GraphQLString),
        },
        first_name: {
          type: new GraphQLNonNull(GraphQLString),
        },
        last_name: {
          type: new GraphQLNonNull(GraphQLString),
        },
        email: {
          type: new GraphQLNonNull(GraphQLString),
        },
        phone_number: {
          type: new GraphQLNonNull(GraphQLInt),
        },
      },
      resolve(
        parentValue,
        { username, password, first_name, last_name, email, phone_number }
      ) {
        var user = new UserSchema({
          username,
          password,
          first_name,
          last_name,
          email,
          phone_number,
        });

        user.save();
        return user;
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
        return UserType.updateOne(
          { _id: id },
          { $set: { username } },
          { $set: { password } },
          { $set: { first_name } },
          { $set: { last_name } },
          { $set: { email } },
          { $set: { phone_number } }
        );
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
          type: new GraphQLNonNull(GraphQLString),
        },
        product: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve(parentValue, { user, product }) {
        var cart = new CartSchema({
          user,
          product,
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
        var order = new OrderSchema({
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

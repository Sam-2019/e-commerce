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

const ProductType = new GraphQLObjectType({
  name: "UserType",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    sku: { type: GraphQLString },
    price: { type: GraphQLString },
    image: { type: GraphQLString },
    quantity: { type: GraphQLInt },
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
  }),
});

const RootMutation = new GraphQLObjectType({
  name: "RootMutationType",
  fields: {
    signup: {
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
        image: {
          type: new GraphQLNonNull(GraphQLString),
        },
        quantity: {
          type: new GraphQLNonNull(GraphQLInt),
        },
      },
      resolve(parentValue, { name, sku, price, image, quantity }) {
        var product = new ProductSchema({
          name,
          sku,
          price,
          image,
          quantity,
        });

        product.save();
        return user;
      },
    },
  },
});

const DataSchema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});

module.exports = DataSchema;

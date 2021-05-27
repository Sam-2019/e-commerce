const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const DataSchema = require("./graphql/schema");

require("./db/db");

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.get("/", function (req, res) {
  res.end("Server up and running");
});


app.use(
  "/graphql",
  graphqlHTTP({
    schema: DataSchema,
    graphiql: true,
    pretty: true,
  })
);

app.listen(process.env.PORT || 5000);
console.log("GraphQL server up!");

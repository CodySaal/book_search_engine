const express = require('express');
const path = require('path');
const { ApolloServer } = require("apollo-server-express")
const { authMiddleware } = require("./utils/auth")
const { typeDefs, resolvers } = require("./schemas")
const db = require('./config/connection');
// Won't be needed once refactored
// const routes = require('./routes');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
})

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "..", "client", "build", "index.html" ))
// })

// Won't be needed once refactored
// app.use(routes);

const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  server.applyMiddleware({app})
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`🌍 Now listening on ${PORT}`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`)
    });
  })
}
  


startApolloServer(typeDefs, resolvers)

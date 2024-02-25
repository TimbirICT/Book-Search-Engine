const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
const { typeDefs, resolvers } = require('./Schemas'); // Adjust the import path based on your file structure
const db = require('./config/connection');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set up Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // You can add context data here if needed
    return { /* context data */ };
  },
});

// Apply the Apollo Server middleware to Express
server.applyMiddleware({ app });

// If we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });
}

// Use existing routes
app.use(routes);

// Connect to the MongoDB database
db.once('open', () => {
  // Start the Apollo Server and Express server
  app.listen(PORT, () => {
    console.log(`🌍 Now listening on http://localhost:${PORT}${server.graphqlPath}`);
  });
});

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uvq0yvv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uvq0yvv.mongodb.net/?retryWrites=true&w=majorityappName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    // All Databases
    const database = client.db("Brew-Haven");
    const coffeeCollection = database.collection("coffee");
    const coffeeBeanCollection = database.collection("coffee-bean");
    const cartCollection = database.collection("cart");
    const favouriteCollection = database.collection("favourite");
    const ordersCollection = database.collection("orders");

    // Get All Coffee
    app.get("/api/all-coffee", async (req, res) => {
      const cursor = await coffeeCollection.find({}).toArray();
      res.send(cursor);
    });
    // Get All Coffee-Beans
    app.get("/api/all-coffee-bean", async (req, res) => {
      const cursor = await coffeeBeanCollection.find({}).toArray();
      res.send(cursor);
    });
    // Get a single data from all coffee
    app.get("/api/all-coffee/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.findOne(query);
      res.send(result);
    });
    // Get a single data from all coffee bean
    app.get("/api/all-coffee-bean/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeBeanCollection.findOne(query);
      res.send(result);
    });
    // Add a single product to cart with email
    app.post("/api/cart", async (req, res) => {
      try {
        const data = req.body;
        const result = await cartCollection.insertOne(data);
        res.send(result); // Send the result back to the client
      } catch (error) {
        console.error("Error inserting data:", error); // Log the error for debugging
        res
          .status(500)
          .send({ message: "An error occurred while inserting data" }); // Send a failure response to the client
      }
    });

    // Find cart items from the database
    app.get("/api/cart/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await cartCollection.find(query).toArray();
      res.send(result);
    });

    // Update favourite status of coffee
    app.patch("/api/all-coffee/:id", async (req, res) => {
      const id = req.params.id;
      const updateData = req.body;
      const query = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: updateData,
      };
      const result = await coffeeCollection.updateOne(query, updateDoc);
      res.send(result);
      console.log(updateData);
    });

    // Update favourite status of coffee beans
    app.patch("/api/all-coffee-bean/:id", async (req, res) => {
      const id = req.params.id;
      const updateData = req.body;
      const query = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: updateData,
      };
      const result = await coffeeBeanCollection.updateOne(query, updateDoc);
      res.send(result);
      console.log(updateData);
    });

    // Insert data in favourite list
    app.post("/api/favourite", async (req, res) => {
      const data = req.body;
      const result = await favouriteCollection.insertOne(data);
      res.send(result);
    });

    // Get data from favourite
    app.get("/api/favourite/:email", async (req, res) => {
      const email = req.params.email;
      console.log(email);
      const query = { email: email };
      const cursor = await favouriteCollection.find(query).toArray();
      console.log(cursor);
      res.send(cursor);
    });

    // Delete data from favourite
    app.delete("/api/favourite/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id)
      const query = { id: id };
      const data = await favouriteCollection.find(query).toArray();
      console.log(data);
      if (data.length > 0) {
        const result = await favouriteCollection.deleteOne(query);
        res.send(result);
      }
    });

    // Post orders data
    app.post("/api/orders", async (req, res) => {
      const data = req.body;
      const options = { ordered: true };
      const result = await ordersCollection.insertMany(data, options);
      res.send(result);
    });

    // Get all orders data
    app.get("/api/orders/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const cursor = await ordersCollection.find(query).toArray();
      res.send(cursor);
      console.log(email);
    });

    // Delete cart data
    app.delete("/api/cart/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await cartCollection.deleteMany(query);
      res.send(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// module.exports = app;

// Home route
app.get("/api", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

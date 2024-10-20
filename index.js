const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// Middleware
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uvq0yvv.mongodb.net/?retryWrites=true&w=majorityappName=Cluster0`;

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

    // Get All Coffee
    app.get("/all-coffee", async (req, res) => {
      const cursor = await coffeeCollection.find({}).toArray();
      res.send(cursor);
    });
    // Get All Coffee-Beans
    app.get("/all-coffee-bean", async (req, res) => {
      const cursor = await coffeeBeanCollection.find({}).toArray();
      res.send(cursor);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mjrrjle.mongodb.net/?retryWrites=true&w=majority`;

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
    // Connect the client to the server    (optional starting in v4.7)
    // client.connect();
    const recipeCollection = client.db("recipeNext").collection("recipes");
    app.post("/recipes", async (req, res) => {
      const recipes = req.body;
      console.log(recipes);
      const result = await recipeCollection.insertOne(recipes);
      res.send(result);
    });

    app.get("/all-recipe", async (req, res) => {
      const result = await recipeCollection.find().toArray();
      res.send(result);
    });

    app.get("/recipe/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await recipeCollection.findOne(query);
      res.send(result);
    });

    app.delete("/recipe/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await recipeCollection.deleteOne(query);
      res.send(result);
    });

    app.put("/recipe/:id", async (req, res) => {
      const id = req.params.id;
      const recipe = req.body;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateRecipe = {
        $set: {
          ...recipe,
        },
      };
      const result = await recipeCollection.updateOne(
        query,
        updateRecipe,
        options
      );
      res.send(result);
    });
   app.get("/search/:key", async(req, res) =>{
    const key = req.params.key 
    const data = await recipeCollection.find({
      $or: [{ title: { $regex: key, $options: "i" } }],
    }).toArray()
    res.send(data)
   })
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

// const uri =
//   "mongodb+srv://recipe-next:OLUbbPMKOPQszVXh@cluster0.je2pvxf.mongodb.net/?retryWrites=true&w=majority";
// const recipeCollection = client.db("recipeNext").collection("recipes");
// app.post("/recipes", async (req, res) => {
//   const recipes = req.body;
//   console.log(recipes);
//   const result = await recipeCollection.insertOne(recipes);
//   res.send(result);
// });

// app.get("/allRecipe", async (req, res) => {
//   const result = await recipeCollection.find().toArray();
//   res.send(result);
// });

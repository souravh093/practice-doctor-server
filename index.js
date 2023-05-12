const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6bquvki.mongodb.net/?retryWrites=true&w=majority`;

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

    const doctorCollection = client.db("HealhiveDB").collection("doctors");

    app.get("/doctors", async (req, res) => {
      const query = doctorCollection.find();
      const result = await query.toArray();
      res.send(result);
    });

    app.get("/doctors/:id", async(req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await doctorCollection.findOne(query);
        res.send(result)
    })

    app.post("/doctors", async (req, res) => {
      const doctorData = req.body;
      const result = await doctorCollection.insertOne(doctorData);
      res.send(result);
    });

    app.put("/doctors/:id", async (req, res) => {
      const id = req.params.id;
      const doctorData = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };

      const doctorUpdate = {
        $set: {
          name: doctorData.service_name,
          service_img: doctorData.service_img,
          short_description: doctorData.short_description,
          price: doctorData.price,
          duration: doctorData.duration,
        },
      };
      const result = await doctorCollection.updateOne(
        filter,
        doctorUpdate,
        options
      );
      res.send(result);
    });

    app.delete("/doctors/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await doctorCollection.deleteOne(query);
      res.send(result);
    });

    


    // Send a ping to confirm a successful connection
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//

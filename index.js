const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.cihuk.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
client.connect((err) => {
  const collection = client.db("users").collection("user");
  const postCollection = client.db("users").collection("post");

  app.put("/users/:email", (req, res) => {
    const email = req.params.email;
    const user = req.body;
    const filter = { email: email };
    const update = { $set: user };
    const options = { upsert: true };
    collection.updateOne(filter, update, options, (err, result) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(result);
      }
    });
  });

  // post by user
  app.post("/posts", (req, res) => {
    const post = req.body;
    postCollection.insertOne(post, (err, result) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send({ message: "post added", status: "success" });
      }
    });
  });

  // get all posts
  app.get("/posts", (req, res) => {
    postCollection.find({}).toArray((err, result) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(result);
      }
    });
  });

  // get post by email id
  app.get("/posts/:email", (req, res) => {
    const email = req.params.email;
    postCollection.find({ email: email }).toArray((err, result) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(result);
      }
    });
  });

  // delete post by id
  app.delete("/posts/:id", (req, res) => {
    const id = req.params.id;
    postCollection.deleteOne({ _id: ObjectId(id) }, (err, result) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send({
          delete: "success",
        });
      }
    });
  });
});

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(port, () => console.log(`Listening on port 5000`));

const express = require("express");
const cors = require("cors");
// const req = require('express/lib/request');
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://redux-1st:fW04kdK3JhOJC1vu@cluster0.bm9busm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
    app.get("/tasks", async (req, res) => {
      let query = {};
      if (req?.query?.priority) {
        query.priority = req.query.priority;
      }
      const cursor = taskCollection.find(query);
      const tasks = await cursor.toArray();
      res.send({ status: true, data: tasks });
    });

    app.post("/task", async (req, res) => {
      const task = req.body;
      const result = await taskCollection.insertOne(task);
      res.send(result);
    });

    app.get("/task/:id", async (req, res) => {
      const id = req.params.id;
      const result = await taskCollection.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    app.delete("/task/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const result = await taskCollection.deleteOne({ _id: new ObjectId(id) });
      console.log(result);
      res.send(result);
    });

    app.put("/task/:id", async (req, res) => {
      const id = req.params.id;
      const task = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          title: task.title,
          description: task.description,
          priority: task.priority,
          isCompleted: task.isCompleted,
        },
      };
      const options = { upsert: true };
      const result = await taskCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    const db = client.db("todo");
    const taskCollection = db.collection("tasks");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server is running....");
});

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});

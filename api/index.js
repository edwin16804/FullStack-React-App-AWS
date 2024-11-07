
import express from "express";
import serverless from "serverless-http";
import cors from "cors";
import { fetchOrders, cancelOrders, modifyOrders, placeOrders } from './Buy.js';

const app = express();
const port = 3001;


app.use(express.json());

if (process.env.DEVELOPMENT) {
  app.use(cors());
}

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/store", async (req, res) => {
  try {
    const tasks = await fetchOrders();

    res.send(tasks.Items);
  } catch (err) {
    res.status(400).send(`Error fetching orders: ${err}`);
  }
});

app.post("/store", async (req, res) => {
  try {
    const task = req.body;

    const response = await placeOrders(task);

    res.send(response);
  } catch (err) {
    res.status(400).send(`Error placing order: ${err}`);
  }
});

app.put("/store", async (req, res) => {
  try {
    const task = req.body;

    const response = await modifyOrders(task);

    res.send(response);
  } catch (err) {
    res.status(400).send(`Error updating order: ${err}`);
  }
});

app.delete("/store/:order_id", async (req, res) => {
  try {
    const { order_id } = req.params;

    const response = await cancelOrders(order_id);

    res.send(response);
  } catch (err) {
    res.status(400).send(`Error cancelling order: ${err}`);
  }
});

if (process.env.DEVELOPMENT) {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}

export const handler = serverless(app);
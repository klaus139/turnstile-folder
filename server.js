import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

const RENDER_URL = "https://nrc-user-backend.onrender.com";
const LOCAL_URL="http://localhost:4000"

app.post("/api/v1/turnstile/heartbeat", async (req, res) => {
  console.log("Heartbeat:", req.body);

  try {
    const response = await axios.post(`${RENDER_URL}/api/v1/turnstile/heartbeat`, req.body);
    res.status(200).send(response.data);
  } catch (error) {
    console.error(error);
    res.sendStatus(200);
  }
});

app.post("/api/v1/turnstile/access", async (req, res) => {
  console.log("Access:", req.body);

  try {
    const response = await axios.post(`${RENDER_URL}/api/v1/turnstile/access`, req.body);
    res.status(200).send(response.data);
  } catch (error) {
    console.error(error);
    res.sendStatus(200);
  }
});

app.listen(8080, () => console.log("Turnstile Proxy Running on Port 80"));

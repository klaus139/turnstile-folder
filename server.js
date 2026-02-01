import express from "express";
import axios from "axios";

const app = express();

// === RAW BODY PARSING ===
// Turnstile devices often send non-standard JSON, so we use raw parsing
app.use(express.raw({ type: "*/*" }));
app.use(express.urlencoded({ extended: true }));

// === BACKEND URLS ===
const RENDER_URL = "https://nrc-user-backend.onrender.com";
const LOCAL_URL = "http://localhost:4000"; // Optional for local testing

// === LOG ALL INCOMING REQUESTS ===
app.use((req, res, next) => {
  console.log("TURNSTILE HIT");
  console.log("IP:", req.ip);
  console.log("URL:", req.url);
  next();
});

// === HEARTBEAT ROUTE ===
app.post("/api/v1/turnstile/heartbeat", async (req, res) => {
  const bodyString = req.body?.toString() || "";
  console.log("Heartbeat RAW:", bodyString);

  try {
    const response = await axios.post(
      `${RENDER_URL}/api/v1/turnstile/heartbeat`,
      bodyString,
      { headers: { "Content-Type": "text/plain" } }
    );
    res.status(200).send(response.data);
  } catch (error) {
    console.error("Heartbeat Forward Error:", error.message);
    res.sendStatus(200);
  }
});

// === ACCESS EVENT ROUTE ===
app.post("/api/v1/turnstile/access", async (req, res) => {
  const bodyString = req.body?.toString() || "";
  console.log("Access RAW:", bodyString);

  try {
    const response = await axios.post(
      `${RENDER_URL}/api/v1/turnstile/access`,
      bodyString,
      { headers: { "Content-Type": "text/plain" } }
    );
    res.status(200).send(response.data);
  } catch (error) {
    console.error("Access Forward Error:", error.message);
    res.sendStatus(200);
  }
});

// === SERVER LISTENER ===
app.listen(80, "0.0.0.0", () => {
  console.log("Turnstile Proxy Running on Port 80");
});

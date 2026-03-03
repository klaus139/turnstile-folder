/**
 * Turnstile proxy – forwards turnstile requests to Render (avoids TCP restrictions).
 * Important: parse ALL body types the turnstile might send (JSON, form, text/plain),
 * otherwise the body is empty when forwarded and the backend sees "No scan".
 */
const express = require("express");
const axios = require("axios");

const app = express();

const RENDER_URL = process.env.RENDER_URL || "https://nrc-user-backend.onrender.com";

// Parse JSON (Content-Type: application/json)
app.use(express.json());
// Parse form (Content-Type: application/x-www-form-urlencoded) – many readers send Card=xxx&Reader=0
app.use(express.urlencoded({ extended: true }));
// Parse plain text (Content-Type: text/plain) – some readers send JSON or form as text/plain
app.use(express.text({ type: "text/plain" }));

// Normalize body to object for forwarding (in case it was parsed as string)
function bodyToObject(req) {
  if (req.body == null) return {};
  if (typeof req.body === "object" && !Array.isArray(req.body)) return req.body;
  if (typeof req.body === "string" && req.body.trim()) {
    try {
      if (req.body.trim().startsWith("{")) return JSON.parse(req.body);
      return req.body.split("&").reduce((acc, pair) => {
        const [k, v] = pair.split("=").map((s) => decodeURIComponent((s || "").replace(/\+/g, " ")));
        if (k) acc[k] = v ?? "";
        return acc;
      }, {});
    } catch {
      return {};
    }
  }
  return {};
}

app.post("/api/v1/turnstile/heartbeat", async (req, res) => {
  const body = bodyToObject(req);
  console.log("Heartbeat:", body);

  try {
    const response = await axios.post(`${RENDER_URL}/api/v1/turnstile/heartbeat`, body, {
      headers: { "Content-Type": "application/json" },
    });
    res.status(200).send(response.data);
  } catch (error) {
    console.error("Heartbeat proxy error:", error.message);
    res.sendStatus(200);
  }
});

app.post("/api/v1/turnstile/access", async (req, res) => {
  const body = bodyToObject(req);
  console.log("Access:", body);

  try {
    const response = await axios.post(`${RENDER_URL}/api/v1/turnstile/access`, body, {
      headers: { "Content-Type": "application/json" },
    });
    res.status(200).send(response.data);
  } catch (error) {
    console.error("Access proxy error:", error.message);
    res.sendStatus(200);
  }
});

const PORT = process.env.PORT || 80;
app.listen(PORT, () => console.log(`Turnstile proxy running on port ${PORT}`));

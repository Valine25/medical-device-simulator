const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/api/vitals", async (req, res) => {
  try {
    const response = await axios.get("http://127.0.0.1:8001/vitals");
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Python service unavailable" });
  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Node server running on port ${PORT}`);
});
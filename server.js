const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors()); // Enable CORS for frontend access

app.get("/stock/:ticker", async (req, res) => {
    const ticker = req.params.ticker;
    const apiUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=7d`;

    try {
        const response = await axios.get(apiUrl);
        res.json(response.data); // Send data to frontend
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch stock data" });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

document.getElementById('searchBtn').addEventListener('click', function () {
    const ticker = document.getElementById('ticker').value.trim().toUpperCase();

    if (!ticker) {
        alert('Please enter a stock ticker.');
        return;
    }

    fetchStockData(ticker);
    fetchCandlestickData(ticker); // Fetch candlestick data
});

function fetchStockData(ticker) {
    const apiUrl = `http://localhost:3000/stock/${ticker}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.quoteResponse.result.length > 0) {
                displayStockData(data.quoteResponse.result[0]);
            } else {
                throw new Error("Invalid stock ticker.");
            }
        })
        .catch(error => {
            document.getElementById("stockData").innerHTML = `<p>${error.message}</p>`;
        });
}

function displayStockData(data) {
    const stockDataDiv = document.getElementById('stockData');

    if (!data || data.regularMarketPrice === undefined) {
        stockDataDiv.innerHTML = `<p>Invalid stock data. Please try again.</p>`;
        return;
    }

    stockDataDiv.innerHTML = `
        <h3>Stock Information</h3>
        <p><strong>Current Price:</strong> $${data.regularMarketPrice.toFixed(2)}</p>
        <p><strong>High Price (Today):</strong> $${data.regularMarketDayHigh.toFixed(2)}</p>
        <p><strong>Low Price (Today):</strong> $${data.regularMarketDayLow.toFixed(2)}</p>
        <p><strong>Open Price:</strong> $${data.regularMarketOpen.toFixed(2)}</p>
        <p><strong>Previous Close:</strong> $${data.regularMarketPreviousClose.toFixed(2)}</p>
    `;
}

// Fetch and display candlestick chart
function fetchCandlestickData(ticker) {
    const apiUrl = `http://localhost:3000/stock/${ticker}`; // Use local backend

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data); // Debugging: Check what data is returned
            if (data.chart && data.chart.result) {
                displayStockData(data.chart.result[0]);
            } else {
                throw new Error("Invalid stock ticker.");
            }
        })
        .catch(error => {
            document.getElementById("stockData").innerHTML = `<p>${error.message}</p>`;
        });
}

// Function to display candlestick chart
function displayCandlestickChart(data) {
    const ctx = document.getElementById('stockChart').getContext('2d');

    // Extract price data from Yahoo Finance response
    const timestamps = data.timestamp.map(t => t * 1000); // Convert Unix timestamp to milliseconds
    const quotes = data.indicators.quote[0];

    const candleData = timestamps.map((t, index) => ({
        t,
        o: quotes.open[index],
        h: quotes.high[index],
        l: quotes.low[index],
        c: quotes.close[index]
    }));

    new Chart(ctx, {
        type: 'candlestick',
        data: {
            datasets: [{
                label: "Stock Candlestick Chart",
                data: candleData,
                borderColor: "rgba(75, 192, 192, 1)"
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: "Stock Price ($)"
                    }
                }
            }
        }
    });
}

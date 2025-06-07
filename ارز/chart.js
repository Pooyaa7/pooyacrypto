document.addEventListener('DOMContentLoaded', () => {
    const chartContainer = document.getElementById('tradingview-chart-container');
    const chartTitle = document.getElementById('chart-title');

    // Function to get URL parameters
    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    // Get coin symbol from URL
    const coinSymbol = getUrlParameter('coinSymbol');
    const coinId = getUrlParameter('coinId'); // Get coinId too, maybe useful for title

    if (coinSymbol) {
        // Optional: Update the title based on coinId or coinSymbol
        if (chartTitle && coinId) {
             // You might need a mapping from coinId to full name if you want a better title
             chartTitle.textContent = `چارت ${coinId.charAt(0).toUpperCase() + coinId.slice(1)} (${coinSymbol})`;
        } else if (chartTitle) {
             chartTitle.textContent = `چارت ${coinSymbol}`;
        }


        // Create TradingView widget
        new TradingView.widget(
            {
                "width": "100%",
                "height": "100%", // Use 100% to fill the container
                "symbol": `BINANCE:${coinSymbol}`, // Example symbol format (exchange:symbol)
                "interval": "15", // Default interval
                "timezone": "Etc/UTC",
                "theme": "dark", // Dark theme
                "style": "1",
                "locale": "fa", // Persian locale
                "enable_publishing": false,
                "allow_symbol_change": true,
                "container_id": "tradingview-chart-container" // ID of the container div
            }
        );
    } else {
        // Display an error if coin symbol is not found in URL
        if (chartContainer) {
            chartContainer.innerHTML = '<p style="color: red; text-align: center;">نماد ارز برای نمایش چارت پیدا نشد.</p>';
        }
         if (chartTitle) {
             chartTitle.textContent = 'خطا';
         }
    }
});

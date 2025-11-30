import { useState, useEffect } from 'react'

function App() {
  const [activeCoin, setActiveCoin] = useState({
    name: 'Bitcoin',
    symbol: 'BTC',
    price: 96420.00,
    change: 5.24
  });

  // Logic for the search bar
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = () => {
    // pass the text from the search bar (searchQuery) into our fetcher
    fetchData(searchQuery)
  }

// Initialize with an empty list [] instead of null  (const [cryptoData, setCryptoData] = useState(null))
    const [cryptoList, setCryptoList] = useState([])

    // 1. Define the reusable function
    // Notice we added '(coin)' so it can accept ANY coin name  const fetchData = async (coin) => {
    const fetchData = async (coin) => {
      try {
          // we use the variable ${coin} in the url
          const response = await fetch(`http://127.0.0.1:5001/api/crypto?coin=${coin}`);
          const data = await response.json();

          //if there are any errors (like coin not found), don't break the app
          if (data.error) {
              console.error("Coin not found");
              return;
          }
      // "prev" represents the current list.
     // [...prev, data] means "Take the old list, and tack the new data on the end."
          setCryptoList((prev) => {
                // Simple check: filter out the new coin if it exists, then add the new version at the top
                const newList = prev.filter(c => c.symbol !== data.symbol);
                return [data, ...newList]
          });

          // 2. Set as Active Coin (For the main card)
          setActiveCoin(data);

      } catch (error) {
          console.error("Error:", error);
      }

    };

    // 2. Call it automatically when the page loads (Default to bitcoin)
    useEffect(() => {
        fetchData('bitcoin');   // this starts the code from above, like a start button
    }, []);

  return (
    <div className="app-container">

      {/* 1. NAVBAR */}
      <nav className="navbar">
        <div className="logo">BitView</div>
        <div className="nav-links">
          <button className="btn-text">Log In</button>
          <button className="btn-primary">Sign Up</button>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <main className="hero">

        {/* --- LEFT COLUMN (Text) --- */}
        <div className="hero-content">
          <h1 className="hero-title">
            Crypto Clarity <br />
            <span className="highlight">For Everyone</span>
          </h1>

          <p className="hero-subtitle">
            Real-time tracking, professional analysis, and market insights. <br />
            Track your assets, analyze trends, and master your portfolio.
          </p>

          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search for a coin (e.g. BTC, ETH)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="search-btn" onClick={handleSearch}>Search</button>
          </div>
        </div>


        <div className="hero-image">
          {/* No if-statement needed anymore! */}
          <div className="crypto-card">
            <div className="card-top">
              <span className="card-title">{activeCoin.name}</span>
              <span className="card-ticker">{activeCoin.symbol}</span>
            </div>
            <div className="card-price">
              ${activeCoin.price.toLocaleString()}
            </div>
            <div
              className="card-change"
              style={{ color: activeCoin.change >= 0 ? '#10b981' : '#ef4444' }}
            >
              {activeCoin.change > 0 ? '+' : ''}{activeCoin.change}%
              <span style={{ fontSize: '0.8rem', color: '#64748b', marginLeft: '5px' }}>(24h)</span>
            </div>
          </div>
        </div>

      </main>

      {/* 3. MARKET TABLE SECTION */}
          <section className="market-section">
            <h2 className="section-title">Market Watch</h2>
            <div className="table-container">
              <table className="crypto-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Price</th>
                    <th>24h Change</th>
                    <th>Market Cap</th> {/* We don't have this yet, maybe hide it? */}
                  </tr>
                </thead>
                <tbody>
                  {cryptoList.map((coin) => (
                    <tr key={coin.symbol}>
                      <td className="coin-name">
                        <span className="name">{coin.name}</span>
                        <span className="ticker">{coin.symbol}</span>
                      </td>
                      <td className="coin-price">${coin.price.toLocaleString()}</td>
                      <td
                        className="coin-change"
                        style={{ color: coin.change >= 0 ? '#10b981' : '#ef4444' }}
                      >
                        {coin.change > 0 ? '+' : ''}{coin.change}%
                      </td>
                      <td className="coin-mcap">N/A</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

    </div>
  )
}

export default App
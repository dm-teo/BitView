import { useState, useEffect } from 'react'

function App() {
  // Logic for the search bar
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = () => {
    // pass the text from the search bar (searchQuery) into our fetcher
    fetchData(searchQuery)
  }

  // 1. The Bucket: Holds the data from Python. Starts as null (empty).
  const [cryptoData, setCryptoData] = useState(null)

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
          setCryptoData(data);
      } catch (error) {
          console.error("Error fetching data:", error);
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

        {/* --- RIGHT COLUMN (Card) --- */}
        <div className="hero-image">
          {/* If cryptoData is NULL, show Loading. Otherwise show the Card. */}
          {!cryptoData ? (
            <div className="crypto-card">Loading...</div>
          ) : (
            <div className="crypto-card">
              <div className="card-top">
                <span className="card-title">{cryptoData.name}</span>
                <span className="card-ticker">{cryptoData.symbol}</span>
              </div>
              <div className="card-price">${cryptoData.price.toLocaleString()}</div>
              <div className="card-change" style={{ color: cryptoData.change >= 0 ? '#10b981' : '#ef4444' }}>
                  {cryptoData.change > 0 ? '+' : ''}{cryptoData.change}%
                  <span style={{ fontSize: '0.8rem', color: '#64748b', marginLeft: '5px' }}>
                    (24h)
                  </span>
              </div>
            </div>
          )}
        </div>

      </main>

    </div>
  )
}

export default App
from flask import Flask, jsonify, request
from flask_cors import CORS
import requests

app = Flask(__name__)

# This single line enables Cross-Origin Resource Sharing.
# Without this, your React app will get a "Network Error" when trying to fetch data.
CORS(app)

@app.route('/api/crypto', methods=["GET"]) #get tells flask to watch that url and accept get requests
def get_crypto_data():
    # 1. Define the URL for the real API
    # We are asking CoinGecko for Bitcoin's price in USD and the 24h change.
    url = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true"

    # 2. Make the Request (Go get the data!)
    response = requests.get(url)
    data = response.json()

    # 3. Extract the specific numbers we need
    # CoinGecko returns data like: {'bitcoin': {'usd': 96123, 'usd_24h_change': -1.2}}
    btc_data = data['bitcoin']

    current_price = btc_data['usd']
    change_24h = btc_data['usd_24h_change']

    # 4. Package it up for our Frontend
    # We format it to match the shape our React app expects
    formatted_data = {
        'name': 'Bitcoin',
        'symbol': 'BTC',
        'price': current_price,
        'change': round(change_24h, 2)  #round to 2 decimal places
    }

    return jsonify(formatted_data)


if __name__ == '__main__':
    # debug=True: Allows the server to restart if you change code
    # port=5000: The standard port for Flask
    print("--- STARTING CRYPTO SERVER ON PORT 5001 ---")  # <--- Add this
    app.run(debug=True, port=5001)
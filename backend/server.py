from flask import Flask, jsonify, request
from flask_cors import CORS
import requests

app = Flask(__name__)

# This single line enables Cross-Origin Resource Sharing.
# Without this, your React app will get a "Network Error" when trying to fetch data.
CORS(app)

@app.route('/api/crypto', methods=["GET"]) #get tells flask to watch that url and accept get requests
def get_crypto_data():
    # 1. GEt the coin name from the frontend (URL)
    # If no coin provided -> default to bitcoin
    coin_id = request.args.get('coin', 'bitcoin').lower()

    # 2. FETCH: Use that SPECIFIC coin_id in the URL
    url = f"https://api.coingecko.com/api/v3/simple/price?ids={coin_id}&vs_currencies=usd&include_24hr_change=true"

    response = requests.get(url)
    data = response.json()

    # 3. CHECK if we found the coin
    if coin_id not in data:
        return jsonify({'error': 'Coin not found', 'name': 'Error', 'symbol': '???', 'price': 0, 'change': 0}), 404

    #4. EXTRACT the data for the requested coin
    coin_data = data[coin_id]

    formatted_data = {
        'name': coin_id.capitalize(),   # Make 'ethereum' -> 'Ethereum'
        'symbol': coin_id.upper()[0:3],   # Make 'ethereum' -> 'ETH' (Simple hack)
        'price': coin_data['usd'],
        'change': round(coin_data['usd_24h_change'], 2)  #round to 2 decimal places
    }

    return jsonify(formatted_data)


if __name__ == '__main__':
    # debug=True: Allows the server to restart if you change code
    # port=5000: The standard port for Flask
    print("--- STARTING CRYPTO SERVER ON PORT 5001 ---")  # <--- Add this
    app.run(debug=True, port=5001)
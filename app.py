from flask import Flask, render_template, request, jsonify
import os
import requests
from datetime import datetime
from dotenv import load_dotenv


load_dotenv(dotenv_path='C:/Users/alkes/OneDrive/Desktop/weather_monitoring/.env')


api_key = os.getenv('OPENWEATHER_API_KEY')  # Ensure this matches the key in your .env file
print(f"Loaded API Key: {api_key}")

if not api_key:
    print("Error: API key is not set.")

# Initialize Flask app
app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_weather', methods=['POST'])
def get_weather():
    data = request.get_json()
    city = data.get('city')

    # Ensure city input is provided
    if not city:
        return jsonify({'error': 'City is required'})

    # Formulate the API request URL (use HTTPS)
    url = f'https://api.openweathermap.org/data/2.5/forecast?q={city}&appid={api_key}&units=metric'

    try:
        # Make the API request
        response = requests.get(url)
        response.raise_for_status()  # Will raise an exception for HTTP errors
        response_data = response.json()

        # Handle errors from the API
        if response_data.get('cod') != '200':
            return jsonify({'error': 'City not found or API error'})

        # Process and return the weather data (using 3-hour intervals, 5 days)
        weather_data = []
        for i in range(0, len(response_data['list']), 8):  # Every 8th data point corresponds to 3-hour intervals
            day_data = response_data['list'][i]
            weather_data.append({
                'date': datetime.fromtimestamp(day_data['dt']).strftime('%Y-%m-%d %H:%M:%S'),  # 3-hour interval
                'temperature': day_data['main']['temp'],
                'humidity': day_data['main']['humidity'],
                'condition': day_data['weather'][0]['description']
            })

        return jsonify(weather_data)

    except requests.exceptions.RequestException as e:
        # Handle network or API-related errors
        return jsonify({'error': f'Error fetching weather data: {str(e)}'})

if __name__ == '__main__':
    app.run(debug=True)

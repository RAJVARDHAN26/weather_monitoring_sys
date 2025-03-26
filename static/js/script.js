document.addEventListener('DOMContentLoaded', function () {
    // Select form and result elements
    const form = document.querySelector('#weather-form');
    const weatherResult = document.querySelector('#weather-result');
    const cityInput = document.querySelector('#city-input');

    // Error handling for missing elements
    if (!form) {
        console.error('Form element not found in the DOM! Check your HTML.');
        return;
    }
    if (!weatherResult) {
        console.error('Weather result container not found in the DOM! Check your HTML.');
        return;
    }
    if (!cityInput) {
        console.error('City input field not found in the DOM! Check your HTML.');
        return;
    }

    // Add form submission event listener
    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission behavior

        const city = cityInput.value.trim(); // Get and sanitize city input
        if (!city) {
            weatherResult.innerHTML = '<p>Please enter a city name.</p>';
            return;
        }

        console.log('City entered:', city);
        weatherResult.innerHTML = '<p>Loading...</p>';

        try {
            const response = await fetch('/get_weather', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ city: city }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Response received:', data);

            // Handle errors in response data
            if (data.error) {
                weatherResult.innerHTML = `<p>Error: ${data.error}</p>`;
            } else {
                let resultHTML = '<h3>5-Day Weather Forecast</h3>';
                data.forEach((day) => {
                    resultHTML += `
                        <p>
                            <strong>${day.date}</strong>: 
                            ${day.temperature}°C, 
                            ${day.condition}, 
                            Humidity: ${day.humidity}%
                        </p>`;
                });
                weatherResult.innerHTML = resultHTML;
            }
        } catch (error) {
            // Display error message to user
            weatherResult.innerHTML = `<p>Something went wrong. Please try again later.</p>`;
            console.error('Error while fetching weather data:', error);
        }
    });
});

/*
    1. Get latitude & longitude coordinates
        - geolocation API in the browser

    2. Get "point" data:
                                           👇 latitude,longitude
        GET https://api.weather.gov/points/39.7456,-97.0892

        Target Data from the Response Body:
            data.properties.forecastHourly
                - An API URL for retrieving hourly forecast data.
                                          
    3. Get hourly "forecast" data
        GET https://api.weather.gov/gridpoints/TOP/31,80/forecast/hourly

        Target Data from the Response Body:
            data.properties.periods
                - An array of hourly weather periods
                - A "weather period" object:
                    {
                        "number": 1,
                        "name": "",
                        "startTime": "2021-10-18T09:00:00-05:00",
                        "endTime": "2021-10-18T10:00:00-05:00",
                        "isDaytime": true,
                        "temperature": 52,
                        "temperatureUnit": "F",
                        "temperatureTrend": null,
                        "windSpeed": "15 mph",
                        "windDirection": "S",
                        "icon": "https://api.weather.gov/icons/land/day/skc?size=small",
                        "shortForecast": "Sunny",
                        "detailedForecast": ""
                    }
*/

/*  According to the Authentication section of the NWS API
    (https://www.weather.gov/documentation/services-web-api):

    "A User Agent is required to identify your application.
    This string can be anything, and the more unique to your 
    application the less likely it will be affected by a 
    security event. If you include contact information (website 
    or email), we can contact you if your string is associated 
    to a security event."

    EXAMPLES:
        User-Agent: "(myweatherapp.com, contact@myweatherapp.com)"
            or
        User-Agent: "Beryllium 1, your-name, your-email-address"
            or
        User-Agent: "flkj29vnl2jnrfc3198hn"
*/

const headers = new Headers({
    "User-Agent": "Beryllium 1, DMG, dmg@kenzie.academy"
})

navigator.geolocation.getCurrentPosition(getPointsData)

function getPointsData (position) {
    // EXAMPLE: GET https://api.weather.gov/points/39.7456,-97.0892
    const url = `https://api.weather.gov/points/${position.coords.latitude},${position.coords.longitude}`

    fetch(url, headers)
        .then(response => response.json())
        .then(getHourlyForecast)
}

function getHourlyForecast (pointObject) {
    // EXAMPLE: GET https://api.weather.gov/gridpoints/TOP/31,80/forecast/hourly
    const url = pointObject.properties.forecastHourly
    fetch(url, headers)
        .then(response => response.json())
        .then(displayForecast)
}

const main = document.querySelector("main")
function displayForecast (forecast) {
    const weatherPeriods = forecast.properties.periods
    const currentWeather = weatherPeriods[0]

    // Build an element containing the current temperature
    const weatherElement = document.createElement("div")
    weatherElement.classList.add("current-weather")
    weatherElement.append(currentWeather.temperature + currentWeather.temperatureUnit)
    
    // Build an image element containing the current weather icon and append it
    const weatherImage = document.createElement("img")
    weatherImage.src = currentWeather.icon
    weatherElement.append(weatherImage)

    // Append the final weather element to some element which is already on the page
    main.append(weatherElement)
}

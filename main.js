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

navigator.geolocation.getCurrentPosition(getPointsData)

function getPointsData (position) {
    // EXAMPLE: GET https://api.weather.gov/points/39.7456,-97.0892
    const url = `https://api.weather.gov/points/${position.coords.latitude},${position.coords.longitude}`
    fetch(url)
        .then(response => response.json())
        .then(getHourlyForecast)
}

function getHourlyForecast (pointObject) {
    // EXAMPLE: GET https://api.weather.gov/gridpoints/TOP/31,80/forecast/hourly
    const url = pointObject.properties.forecastHourly
    fetch(url)
        .then(response => response.json())
        .then(displayForecast)
}

const main = document.querySelector("main")
function displayForecast (forecast) {
    const weatherPeriods = forecast.properties.periods
    const currentWeather = weatherPeriods[0]

    const weatherElement = document.createElement("div")
    weatherElement.classList.add("current-weather")
    weatherElement.append(currentWeather.temperature + currentWeather.temperatureUnit)
    
    const weatherImage = document.createElement("img")
    weatherImage.src = currentWeather.icon
    weatherElement.append(weatherImage)

    main.append(weatherElement)
}

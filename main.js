
let currentWeatherTemplate = document.querySelector('.current-weather-template').innerHTML
let currentWeatherContainer = document.querySelector('.current-weather-container')
let cityName = document.querySelector('.city-name')

let input = document.querySelector('.search-input')
const form = document.querySelector('.search')

const tempUnitsBtn = document.querySelector('.temp-units-select')
let isFarenheit = false

let templateCard = document.querySelector('.forecast-template').innerHTML
let forecastContainer = document.querySelector('.forecast-container')

form.addEventListener('submit', (e) => {
    e.preventDefault()
    if (!input.checkValidity() && !input.value) return

    getWeatherByCityName()
    getForecastByCityName()
})

async function showStartLocation() {
    try {
        const response = await 
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=Kyiv&units=${isFarenheit ? 'imperial' : 'metric'}&appid=5fedcbd7c2c4e234f857f50c88de30ae`)
        const data = await response.json()

        const template = document.querySelector('.current-weather-template').content.cloneNode(true)

        const content = Mustache.render(currentWeatherTemplate, {
            temp: Math.round(data.main.temp),
            units: isFarenheit ? 'F' : 'C',
            weatherIcon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
            feelsLike: Math.round(data.main.feels_like),
            humidity: data.main.humidity,
            wind: data.wind.speed
        })
        currentWeatherContainer.innerHTML = content
    } catch (error) {
        console.log(error)
    }
}
showStartLocation()

async function showStartLocationForecast() {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=Kyiv&units=metric&appid=5fedcbd7c2c4e234f857f50c88de30ae`)
        const data = await response.json()

        const dailyForecasts = {}

        data.list.forEach(item => {
            const date = item.dt_txt.split(' ')[0]
            if (!dailyForecasts[date]) {
                dailyForecasts[date] = {
                    date: date,
                    weatherIcon: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
                    temp: Math.round(item.main.temp)
                }
            }
        })

        Object.values(dailyForecasts).forEach(forecast => {
            const content = Mustache.render(templateCard, {
                day: forecast.date,
                units: isFarenheit ? 'F' : 'C',
                weatherIcon: forecast.weatherIcon,
                temp: forecast.temp
            })

            let forecastCard = document.createElement('div')
            forecastCard.classList.add('forecast-card')
            forecastCard.innerHTML = content
            forecastContainer.append(forecastCard)
        })

    } catch (error) {
        console.log(error)
    }
}
showStartLocationForecast()

async function getWeatherByCityName() {
    try {
        const response = await 
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${input.value}&units=${isFarenheit ? 'imperial' : 'metric'}&appid=5fedcbd7c2c4e234f857f50c88de30ae`)
        const data = await response.json()

        const template = document.querySelector('.current-weather-template').content.cloneNode(true)

        const content = Mustache.render(currentWeatherTemplate, {
            temp: Math.round(data.main.temp),
            units: isFarenheit ? 'F' : 'C',
            weatherIcon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
            feelsLike: Math.round(data.main.feels_like),
            humidity: data.main.humidity,
            wind: data.wind.speed
        })
        currentWeatherContainer.innerHTML = content

        if(response.ok) {
            cityName.innerHTML = input.value
        }

    } catch (error) {
        console.log(error)
    }
}

async function getForecastByCityName() {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${input.value}&units=${isFarenheit ? 'imperial' : 'metric'}&appid=5fedcbd7c2c4e234f857f50c88de30ae`)
        const data = await response.json()

        forecastContainer.innerHTML = ''

        const dailyForecasts = {};

        data.list.forEach(item => {
            const date = item.dt_txt.split(' ')[0] 
            if (!dailyForecasts[date]) {
                dailyForecasts[date] = {
                    date: date,
                    weatherIcon: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
                    temp: Math.round(item.main.temp)
                }
            }
        })

        Object.values(dailyForecasts).forEach(forecast => {
            const content = Mustache.render(templateCard, {
                day: forecast.date,
                units: isFarenheit ? 'F' : 'C',
                weatherIcon: forecast.weatherIcon,
                temp: forecast.temp
            })

            let forecastCard = document.createElement('div')
            forecastCard.classList.add('forecast-card')
            forecastCard.innerHTML = content;
            forecastContainer.append(forecastCard)
        })

    } catch (error) {
        console.log(error)
    }
}

function celsiusToFahrenheit(e) {
    let currentTemp = document.querySelector('.current-temp')
    let feelsLike = document.querySelector('.feels-like-value')
    let forecastTemp = document.querySelectorAll('.forecast-temp')
    let currentUnit = document.querySelectorAll('.current-unit')

    if(e.target.checked) {
        isFarenheit = true
        currentTemp.innerHTML = Math.round((currentTemp.textContent * 9/5) + 32)
        feelsLike.innerHTML = Math.round((feelsLike.textContent * 9/5) + 32)
        forecastTemp.forEach(el => el.innerHTML = Math.round((el.textContent * 9/5) + 32))
        currentUnit.forEach(el => el.innerHTML = '&deg;F')
        
    } else {
        currentTemp.innerHTML = Math.round((currentTemp.textContent -32) * 5/9)
        feelsLike.innerHTML = Math.round((feelsLike.textContent -32) * 5/9)
        forecastTemp.forEach(el => el.innerHTML = Math.round((el.textContent -32) * 5/9))
        currentUnit.forEach(el => el.innerHTML = '&deg;C')
        
        isFarenheit = false
    }
}

tempUnitsBtn.addEventListener('click', celsiusToFahrenheit)

window.onload = function() {
    let preloader = document.querySelector('.preloader')

    setTimeout(() => {
        preloader.classList.add('hide-preloader')
        setTimeout(function() {
            preloader.classList.add('preloader-hidden')
        }, 990)
    }, 3000) 
}
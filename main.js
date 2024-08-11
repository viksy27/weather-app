let currentWeatherTemplate = document.querySelector('.current-weather-template').innerHTML
let currentWeatherContainer = document.querySelector('.current-weather-container')
let cityNameEl = document.querySelector('.city-name')
let input = document.querySelector('.search-input')
let templateCard = document.querySelector('.forecast-template').innerHTML
let forecastContainer = document.querySelector('.forecast-container')
let isFarenheit = false
let lat = 0
let long = 0
let userCityName = ''

navigator.geolocation.getCurrentPosition(isLocation, isNavigatorError)

document.forms[0].addEventListener('submit', (e) => {
    e.preventDefault()
    if ( !input.checkValidity() && !input.value ) return

    showWeatherByCityName(input.value)
    showForecastByCityName(input.value)

    input.value = ''
})

async function isLocation(position) {
    lat = Math.round(position.coords.latitude)
    long = Math.round(position.coords.longitude)

    await getCityName()
    await showWeatherByCityName(userCityName)
    await showForecastByCityName(userCityName)
}

function isNavigatorError() {
    showWeatherByCityName('Kyiv')
    showForecastByCityName('Kyiv')
}

async function getCityName() {
    const cityName = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=5fedcbd7c2c4e234f857f50c88de30ae&units=${isFarenheit ? 'imperial' : 'metric'}`)
        .then(res => {
        return res.json()
    }).then(data => {
        return data.city.name
    }).catch(err => {
        console.log(err)
    })
    userCityName = cityName
}

async function showWeatherByCityName(userCityName) {
    let data = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${userCityName}&units=${isFarenheit ? 'imperial' : 'metric'}&appid=5fedcbd7c2c4e234f857f50c88de30ae`)

    .then(res => {
        return res.json()
    }).then(data => {
        return data
    }).catch(err => {
        console.log(err)
    })

    if ( data.cod == '404' ) {
        alert(data.message)
        return
    }

    const template = document.querySelector('.current-weather-template').content.cloneNode(true)
    const content = Mustache.render(currentWeatherTemplate, {
        temp: Math.round(data.main.temp),
        units: isFarenheit ? 'F' : 'C',
        weatherIcon: `./assets/lottie/${data.weather[0].icon}.json`,

        feelsLike: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        wind: data.wind.speed
    })
    currentWeatherContainer.innerHTML = content
    cityNameEl.innerHTML = data.name
}

async function showForecastByCityName(cityName) {
    const data = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=${isFarenheit ? 'imperial' : 'metric'}&appid=5fedcbd7c2c4e234f857f50c88de30ae`)

    .then(res => {
        return res.json()
    }).then(data => {
        return data
    }).catch(err => {
        console.log(err)
    })

    if ( data.cod == '404' ) {
        return
    }

    forecastContainer.innerHTML = ''
    const dailyForecasts = {}

    data.list.forEach(item => {
        const date = item.dt_txt.split(' ')[0] 
        if ( !dailyForecasts[date] ) {
            dailyForecasts[date] = {
                date: date,
                weatherIcon: `./assets/lottie/${item.weather[0].icon}.json`,
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
}

function celsiusToFahrenheit(e) {
    let currentTemp = document.querySelector('.current-temp')
    let feelsLike = document.querySelector('.feels-like-value')
    let forecastTemp = document.querySelectorAll('.forecast-temp')
    let currentUnit = document.querySelectorAll('.current-unit')

    if ( e.target.checked ) {
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

document.querySelector('.temp-units-select').addEventListener('click', celsiusToFahrenheit)
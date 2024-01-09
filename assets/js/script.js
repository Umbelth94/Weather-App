var currentDate = dayjs().format('MM/DD/YYYY');
var searchButton = document.querySelector('#search-btn');
var cityInput = document.querySelector('#city-input')
var savedCitiesContainer = document.querySelector('#saved-cities')
var currentWeatherContainer = document.querySelector('#current-weather-container')

var latitude;
var longitude;

var cityData = JSON.parse(localStorage.getItem('cityData')) || [];

//When button is pressed, 
searchButton.addEventListener('click',function(){
    saveCity();
    
});

//Save city locally
function saveCity(){
    var inputData = cityInput.value;
    if (inputData === ''){
        return;
    }
    if (!cityData.includes(inputData)) {
        cityData.push(inputData);
        localStorage.setItem('cityData', JSON.stringify(cityData));
        displayCities();
        getWeather(inputData);
        cityInput.value='';
    } else {
        console.log('City already exists in the list.');
    }
}

//Display the cities on the side of the page
function displayCities(){
    savedCitiesContainer.innerHTML = '';
    for (let i = 0; i < cityData.length; i++){
        var cityBtn = document.createElement('button');
        cityBtn.addEventListener('click', function(){
            getWeather(cityData[i]);
        });
        cityBtn.textContent=cityData[i];
        cityBtn.setAttribute('class', 'btn btn-secondary mt-2');
        savedCitiesContainer.append(cityBtn);
        console.log(cityData[i]);
    }
}

//Call the geolocation API to grab coordinates of the city input
function getCoords(cityName) {
    return fetch('https://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&appid=bf70693fc02342902eb9d0f51befef5a')
        .then(response => response.json())
        .then(data => {
            latitude = Math.round(data[0]?.lat * 100) / 100;
            longitude = Math.round(data[0]?.lon * 100) / 100;
            console.log(latitude, longitude);
            return { latitude, longitude };
        })
        .catch(error => {
            console.error('Error getting coordinates:', error);
            throw error;
        });
}

//Call the weather API for the latitude and longitude of the entered city
function getWeather(cityName) {
    getCoords(cityName)
        .then(({ latitude, longitude }) => {
            fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=bf70693fc02342902eb9d0f51befef5a&units=imperial`)
                .then(response => response.json())
                .then(data => {
                    if (data && data.list && data.list.length > 0){

                    
                        const currentUnixTimestamp = dayjs().unix();
                        console.log('current unix hour ' + currentUnixTimestamp);
                        
                        //Loop through all of the indexes to get the current hour's forecast
                        let closestTimestamp = Infinity;
                        let closestIndex = -1;
                        for (i = 0; i < data.list.length; i++){
                            const timestampDifference = Math.abs(data.list[i].dt - currentUnixTimestamp)
                            if (timestampDifference < closestTimestamp) {
                                closestTimestamp = timestampDifference;
                                closestIndex = i;
                            }
                        }
                            if (closestIndex !== -1){
                                displayMainCard(cityName, data.list[closestIndex]);
                                displaySmallCards(data);
                
                            } else {
                                console.log('no matching weather data found.');
                            }
                        
                        console.log(data);
                    } else {
                        cityInput.value = '';
                        window.alert('That city is either misspelled, or does not exist');
                    }
                })
                .catch(error => {
                    console.error('Error getting weather data:', error);
                });
        })
        .catch(error => {
            console.error('Error getting coordinates:', error);
        });
}


function displayMainCard(cityName, data){
    var weatherCondition = data.weather[0].icon;
    const iconImg = document.createElement('img');
    iconImg.src = 'https://openweathermap.org/img/wn/' + weatherCondition + '@2x.png';

    const cityTitle = document.createElement('h3');
    cityTitle.textContent = cityName + ' (' + currentDate + ')';
    cityTitle.appendChild(iconImg);

    const temperature = document.createElement('p');
    temperature.textContent = 'Temperature: ' + data.main.temp +' °F';
    const wind = document.createElement('p');
    wind.textContent = 'Wind: ' + data.wind.speed + ' MPH' 
    const humidity = document.createElement('p');
    humidity.textContent = 'Humidity: ' + data.main.humidity + ' %';

    currentWeatherContainer.innerHTML = '';  // Clear previous content
    currentWeatherContainer.classList.replace('d-none','d-block');
    currentWeatherContainer.appendChild(cityTitle);
    currentWeatherContainer.appendChild(temperature);
    currentWeatherContainer.appendChild(wind);
    currentWeatherContainer.appendChild(humidity);


    console.log('Closest weather data:', data);
   
}

function displaySmallCards(data) {
    const smallCardsContainer = document.querySelector('#future-weather-container');
    smallCardsContainer.innerHTML = '';  // Clear previous content
    const header = document.createElement('h3');
    header.textContent = '5 Day Weather Forecast';
    smallCardsContainer.appendChild(header)

    for (let i = 0; i < data.list.length; i += 8) {
        const dayData = data.list[i];
        if (!dayData) {
            continue;  // Skip incomplete data
        }

        const card = document.createElement('div');
        card.classList.add('card', 'm-2');

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        const dayTitle = document.createElement('h5');
        dayTitle.classList.add('card-title');
        dayTitle.textContent = dayjs(dayData.dt * 1000).format('ddd, MMM D');

        const iconImg = document.createElement('img');
        const weatherCondition = dayData.weather[0].icon;
        iconImg.src = 'https://openweathermap.org/img/wn/' + weatherCondition + '@2x.png';

        const temperature = document.createElement('p');
        temperature.classList.add('card-text');
        temperature.textContent = 'Temp: ' + dayData.main.temp + ' °F';

        const wind = document.createElement('p');
        wind.classList.add('card-text');
        wind.textContent = 'Wind: ' + dayData.wind.speed + ' MPH';

        const humidity = document.createElement('p');
        humidity.classList.add('card-text');
        humidity.textContent = 'Humidity: ' + dayData.main.humidity + ' %';

        const header = document.createElement('h3');
        header.textContent = '5 Day Weather Forecast';
        cardBody.appendChild(dayTitle);
        cardBody.appendChild(iconImg);
        cardBody.appendChild(temperature);
        cardBody.appendChild(wind);
        cardBody.appendChild(humidity);

        card.appendChild(cardBody);
        smallCardsContainer.appendChild(card);
    }
}

//Initialize the saved cities on page load
displayCities();
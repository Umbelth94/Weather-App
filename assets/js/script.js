//To Do:
    //Tap into the API to actually populate the weather data

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

function saveCity(){
    var inputData = cityInput.value;
    if (inputData === ''){
        return;
    }
    cityData.push(inputData);
    localStorage.setItem('cityData',JSON.stringify(cityData));
    displayCities();
    getWeather(inputData);
    cityInput.value='';
}

function displayCities(){
    savedCitiesContainer.innerHTML = '';
    for (let i = 0; i < cityData.length; i++){
        var cityBtn = document.createElement('button');
        cityBtn.addEventListener('click', function(){
            getWeather(cityData[i]);
            console.log('This is where the' +cityData[i] + 'function goes');
        });
        cityBtn.textContent=cityData[i];
        cityBtn.setAttribute('class', 'btn btn-secondary mt-2');
        savedCitiesContainer.append(cityBtn);
        console.log(cityData[i]);
    }
}

function getCoords(cityName) {
    return fetch('http://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&appid=bf70693fc02342902eb9d0f51befef5a')
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

function getWeather(cityName) {
    getCoords(cityName)
        .then(({ latitude, longitude }) => {
            fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=bf70693fc02342902eb9d0f51befef5a&units=imperial`)
                .then(response => response.json())
                .then(data => {
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
            
                        } else {
                            console.log('no matching weather data found.');
                        }
                    
                    console.log(data);
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
displayCities();
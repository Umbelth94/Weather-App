//To Do:
    //Tap into the API to actually populate the weather data

var currentDate = dayjs().format('MM/DD/YYYY');
var searchButton = document.querySelector('#search-btn');
var cityInput = document.querySelector('#city-input')
var savedCitiesContainer = document.querySelector('#saved-cities')

var cityData = JSON.parse(localStorage.getItem('cityData')) || [];


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
    cityInput.value='';
}

function displayCities(){
    savedCitiesContainer.innerHTML = '';
    for (let i = 0; i < cityData.length; i++){
        var cityBtn = document.createElement('button');
        cityBtn.addEventListener('click', function(){
            //Do the API populate function
        });
        cityBtn.textContent=cityData[i];
        cityBtn.setAttribute('class', 'btn btn-secondary mt-2');
        cityBtn.setAttribute
        savedCitiesContainer.append(cityBtn);
        console.log(cityData[i]);
    }
}

displayCities();
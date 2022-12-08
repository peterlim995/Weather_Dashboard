console.log("connect");

var a = $('li');

var apiKey = '22fa820e436f5674641fa5105f7d768f';


var citySearchEl = $('#city-search');
var cityNameEl = $('#city-name');
var forecastEl = $('#forecast-list');
var storeBtnListEl = $('#storeBtn');
var resultEl = $('#result');
var searchFromButton = false;
var yesBtn = false;

function storeSearch(data) {

    var localStorageArray = getLocalstroage();

    var store = [];

    if (localStorageArray === null) {
        console.log("storage is null");
        store.push(data);
    } else {
        console.log("storage is not empty");

        for (var i = 0; i < localStorageArray.length; i++) {
            store.push(localStorageArray[i]);
        }
        store.push(data);
    }
   
    setLocalStroage(store);
    showBtn();

}

function getLocalstroage() {
    return JSON.parse(localStorage.getItem('searchCity'));
}

function setLocalStroage(data) {
    localStorage.setItem('searchCity', JSON.stringify(data));
}

function showBtn() {

    storeBtnListEl.empty();
    
    var btn = getLocalstroage();
    console.log("ShowBtn call");

    if (btn !== null) {
        for (let i = 0; i < btn.length; i++) {
            var addBtn = $('<button id="' + btn[i].name + '">').text(btn[i].name);
            addBtn.addClass('btn btn-secondary w-100 my-2');
            storeBtnListEl.append(addBtn);
        }
        var resetBtn = $('<button id="reset">').text("Reset");
        resetBtn.addClass('btn btn-dark w-100 my-2');
        storeBtnListEl.append(resetBtn);
        console.log("ShowBtn call inside if");
    }

}


function getCityInfo(event) {
    event.preventDefault();
    console.log("call the function");

    var apiUrl = '';

    var cityName = cityNameEl.val().trim();

    if (cityName) {

        searchFromButton = false;
        yesBtn = true;
       
        beginSearch(cityName);

        cityNameEl.val('');

    } else {
        alert("Enter the city name");
        return;
    }
}

function beginSearch(cityName) {
    apiUrl = 'https://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&limit=1&appid=' + apiKey;

    console.log('apiUrl: ' + apiUrl);


    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                console.log("response: " + response);
                return response.json();
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        .then(function (data) {
            console.log("Data: " + data);
            console.log("apiUrl: " + apiUrl);

            cityData(data);

            if (!searchFromButton) {
                storeSearch(data[0]);
            }

        })
        .catch(function (error) {
            console.log(error);
            alert('Unable to get the data');
        });

}


function cityData(data) {

    var cityName = data[0].name;
    var lat = data[0].lat;
    var lon = data[0].lon;
    var country = data[0].country;
    var state = data[0].state;

    console.log("CityName: " + cityName);

    $('#city').text(cityName);

    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey + '&units=imperial';

    console.log("Weather apiUrl: " + apiUrl);

    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                console.log("response: " + response);
                return response.json();
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        .then(function (data) {
            console.log("Data: " + data);
            console.log("apiUrl: " + apiUrl);

            displayWeather(data);

        })
        .catch(function (error) {
            console.log(error);
            alert('Unable to get the data');
        });

    var forecastApiUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey + '&units=imperial';

    console.log("Forecast apiUrl: " + forecastApiUrl);

    fetch(forecastApiUrl)
        .then(function (response) {
            if (response.ok) {
                console.log("response: " + response);
                return response.json();
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        .then(function (data) {
            console.log("Data: " + data);
            console.log("Forecast apiUrl: " + forecastApiUrl);

            displayForecast(data.list);

        })
        .catch(function (error) {
            console.log(error);
            alert('Unable to get the data');
        });

}



function displayWeather(data) {

    console.log("display called");
    console.log("Icon:" + data.weather[0].icon);

    $('#today').text(dayjs.unix(data.dt).format('MM/D/YYYY'));
    $('#t-icon').html('<img src="https://openweathermap.org/img/wn/' + data.weather[0].icon + '.png">');
    $('#temp').text(data.main.temp + '°F');
    $('#wind').text(data.wind.speed + 'MPH');
    $('#humidity').text(data.main.humidity + '%');

}


function displayForecast(data) {

    console.log("forecast");
    forecastEl.empty();

    for (let i = 7; i < data.length; i += 8) {

        var container = $('<div class="forecast border border-dark col-12 col-lg-2 p-2">');
        var date = $('<h5>').text(dayjs.unix(data[i].dt).format('MM/D/YYYY'));
        var icon = $('<img>').attr('src', 'https://openweathermap.org/img/wn/' + data[i].weather[0].icon + '.png');
        var temp = $('<p>').text('Temp: ' + data[i].main.temp + '°F');
        var wind = $('<p>').text('Wind: ' + data[i].wind.speed + 'MPH');
        var humidity = $('<p>').text('Humidity: ' + data[i].main.humidity + '%');

        container.append(date, icon, temp, wind, humidity);

        forecastEl.append(container);
    }

}

function reset(){
    console.log("Reset Button click");
    localStorage.clear();
    showBtn();
}


function handleButton() {

    var cityName = $(this).attr('id');

    if(cityName === 'reset'){   
        reset();
        showBtn();
        return;
    }

    console.log("City: " + cityName);

    searchFromButton = true;
    beginSearch(cityName);

}


storeBtnListEl.on('click', '.btn', handleButton)
citySearchEl.on('submit', getCityInfo);
showBtn();






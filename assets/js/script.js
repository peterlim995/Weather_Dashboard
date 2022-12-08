console.log("connect");

// API Document - https://openweathermap.org/forecast5
// API Call: api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
var apiKey = '22fa820e436f5674641fa5105f7d768f';

var citySearchEl = $('#city-search');
var cityNameEl = $('#city-name');
var forecastEl = $('#forecast-list');
var storeBtnListEl = $('#storeBtn');
var resultEl = $('#result');
var searchFromButton = true;


// Submit search input field
// If field is empty, call alert message
// Call beginSearch() with city name variable
function getCityInfo(event) {
    
    event.preventDefault();
    // console.log("call the function");

    var cityName = cityNameEl.val().trim();

    if (cityName) {
        searchFromButton = false;   // It is not from stored button
        beginSearch(cityName);  // Call beginSearch() with city name variable
        cityNameEl.val(''); // clean the input field
    } else {
        alert("Enter the city name");
        return;
    }
}


// Making API URL by using city name and api key
// Getting the data from API URL
// Call cityData() with API Data
function beginSearch(cityName) {

    apiUrl = 'https://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&limit=1&appid=' + apiKey;

    // console.log('apiUrl: ' + apiUrl);

    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                // console.log("response: " + response);
                return response.json();
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        .then(function (data) {
            
            cityData(data); 

            if (!searchFromButton) {    // If it is not search from the button, store the information to localstorage
                storeSearch(data[0]);
            }
        })
        .catch(function (error) {
            console.log(error);
            alert('Unable to get the data');
        });

}

// Choosing first city data and making API Url for the first city
// Getting Data from currunt weather API Url and Forecast weather API Url
function cityData(data) {

    var cityName = data[0].name;
    var lat = data[0].lat;
    var lon = data[0].lon;
    // var country = data[0].country;
    // var state = data[0].state;

    // console.log("CityName: " + cityName);

    $('#city').text(cityName);  // Display city name

    // API Url for current weather
    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey + '&units=imperial';     

    // console.log("Current Weather apiUrl: " + apiUrl);

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
            displayWeather(data);   // Display current weather
        })
        .catch(function (error) {
            console.log(error);
            alert('Unable to get the data');
        });

    // API Url for 5 days forecast
    var forecastApiUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey + '&units=imperial';

    // console.log("Forecast apiUrl: " + forecastApiUrl);

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
            displayForecast(data.list);     // display 5 days forecast weather
        })
        .catch(function (error) {
            console.log(error);
            alert('Unable to get the data');
        });
}

// Display Current weather data
function displayWeather(data) {

    // console.log("Icon:" + data.weather[0].icon);
    $('#today').text(dayjs.unix(data.dt).format('MM/D/YYYY'));
    $('#t-icon').html('<img src="https://openweathermap.org/img/wn/' + data.weather[0].icon + '.png">');
    $('#temp').text(data.main.temp + '°F');
    $('#wind').text(data.wind.speed + 'MPH');
    $('#humidity').text(data.main.humidity + '%');

}

// Display Forecast Data
function displayForecast(data) {
    // console.log("forecast");
    forecastEl.empty(); // empty the previous data

    // Getting every 24 hours data / API provide every 3 hours data
    for (var i = 7; i < data.length; i += 8) {

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

// Add seached city data to local stroage
function storeSearch(data) {

    var localStorageArray = getLocalstroage();

    var store = [];

    if (localStorageArray === null) {   // if there is no localstorage data
        // console.log("storage is null");
        store.push(data);
    } else {        //  if there are localstorage data
        // console.log("storage is not empty");
        for (var i = 0; i < localStorageArray.length; i++) {
            store.push(localStorageArray[i]);
        }
        store.push(data);
    }
   
    setLocalStroage(store); // Store added data to localstorage
    showBtn();  // Show stored button
}

// Get localstorage Data
function getLocalstroage() {
    return JSON.parse(localStorage.getItem('searchCity'));
}

// Set localstorage Data
function setLocalStroage(data) {
    localStorage.setItem('searchCity', JSON.stringify(data));
}

// Show Stored city data button
function showBtn() {

    storeBtnListEl.empty(); // empty the previous button
    
    var btn = getLocalstroage();

    // If there is stored data, making the button for the stored city name
    if (btn !== null) {
        for (let i = 0; i < btn.length; i++) {
            var addBtn = $('<button id="' + btn[i].name + '">').text(btn[i].name);
            addBtn.addClass('btn btn-secondary w-100 my-2');
            storeBtnListEl.append(addBtn);
        }

        // At the end of the listed button add the reset button that erase the stored button
        var resetBtn = $('<button id="reset">').text("Reset");
        resetBtn.addClass('btn btn-dark w-100 my-2');
        storeBtnListEl.append(resetBtn);        
    }
}

// Stored Button handling
// If clicking the city name button, it will show weather
// If clicking the reset button, it will clear the button
function handleButton() {

    var cityName = $(this).attr('id');

    if(cityName === 'reset'){   // if it is reset button
        reset();
        showBtn();
        return;
    }
    // console.log("City: " + cityName);

    searchFromButton = true;    // Indicating that the search is from button 
    beginSearch(cityName);      // so that it will not store the data to the localstorage
}

// Clean the localstorage
function reset(){
    localStorage.clear();
    showBtn();
}

showBtn(); // Show localstorage buttons
beginSearch('New Brunswick'); // First Start city is New Brunswick
citySearchEl.on('submit', getCityInfo); // Submit Search
storeBtnListEl.on('click', '.btn', handleButton); // cilck on city name button









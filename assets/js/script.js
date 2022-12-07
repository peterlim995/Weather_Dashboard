console.log("connect");

var a = $('li');

var apiKey = '22fa820e436f5674641fa5105f7d768f';


var citySearchEl = $('#city-search');
var cityNameEl = $('#city-name');
var forecastEl = $('#forecast-list');


function getCityInfo(event) {
    event.preventDefault();
    console.log("call the function");

    var apiUrl = '';

    var cityName = cityNameEl.val().trim();

    if (cityName) {
        apiUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&limit=1&appid=' + apiKey;

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
            })
            .catch(function (error) {
                console.log(error);
                alert('Unable to get the data');
            });

    } else {
        alert("Enter the city name");
        return;
    }
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
    // data.weather.icon);
    $('#temp').text(data.main.temp + '°F');
    $('#wind').text(data.wind.speed + 'MPH');
    $('#humidity').text(data.main.humidity + '%');

}


function displayForecast(data){

    console.log("forecast");
    forecastEl.empty();

    for (let i = 0; i < data.length; i += 8) {

        var container = $('<div class="forecast border border-dark col-2 m-2 p-2">');
        var date = $('<h5>').text(dayjs.unix(data[i].dt).format('MM/D/YYYY'));
        var icon = $('<img>').attr('src','https://openweathermap.org/img/wn/' + data[i].weather[0].icon + '.png');
        var temp = $('<p>').text('Temp: '+data[i].main.temp + '°F');
        var wind = $('<p>').text('Wind: '+data[i].wind.speed+ 'MPH');
        var humidity = $('<p>').text('Humidity: '+data[i].main.humidity + '%');

        container.append(date, icon, temp, wind, humidity);

        forecastEl.append(container);        
    }

}


citySearchEl.on('submit', getCityInfo);



// getCityInfo();



$(document).ready(function () {
  var apikey = "61b3a83a8674abd5cdfebbda62719854";  // api key for the weather
  var latitude;
  var longitude;
  var cities = [];
  var cityEl = localStorage.getItem("cityEl");// local storage to get last searched city
  var date = moment().format("ddd, MMM Do YYYY"); // date 

  var submit = $(".btn");
  var $citylist = $("#search");

  if(cityEl !== null){
    $("#citys").text(cityEl);
    $("#date").text(" " + date);
    getCordinats(cityEl);
  }

  // click the submit button to get the weather of the location
  submit.on("click", function (e) {
    e.preventDefault();
    var city = $("#input").val();
    $("#citys").text(city);
    $("#date").text(" " + date);
    localStorage.setItem("cityEl",city);

    if (cities.includes(city) === false) {
      cities.push(city);
      displaySearch(cities);
      getCordinats(city);
    } else if (city !== cities[cities.length - 1]) {
      getCordinats(city);
    }
    $("#input").val("");
  });

  //display the search history
  function displaySearch(cities) {
    $citylist.text(" ");
    for (var i = 0; i < cities.length; i++) {
      var listItem = $("<li>" + cities[i] + "</li>");
      $citylist.append(listItem);
    }
  }

  //Go get searched city in the city list
  $citylist.on("click", function (event) {
    cityevent = event.target.textContent;
    localStorage.setItem("cityEl",cityevent);
    $("#citys").text(cityevent);
    $("#input").val("");
    getCordinats(cityevent);
  });

  //Get the co-ordinates of the city
  function getCordinats(city) {
    var cityname = city.toLowerCase();

    var coordUrl =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      cityname +
      "&appid=" +
      apikey;

    $.ajax({
      url: coordUrl,
      method: "GET",
    }).then(function (data) {
      longitude = data.coord.lon;
      latitude = data.coord.lat;
      getCurrentWether(longitude, latitude);
    });
  }

  //Get the weather conditions in the city
  function getCurrentWether(long, lat) {
    var currentUrl =
      "https://api.openweathermap.org/data/2.5/onecall?lat=" +
      lat +
      "&lon=" +
      long +
      "&units=metric&exclude=minutely,hourly,alerts&appid=" +
      apikey;

    $.ajax({
      url: currentUrl,
      method: "GET",
    }).then(function (response) {
      $("#icon").attr(
        "src",
        "http://openweathermap.org/img/wn/" + response.current.weather[0].icon+ ".png"
      );
      $("#icon").attr("alt","the weathe icon");
      $("#temp").text(response.current.temp);
      $("#temp").append(" &#8451;");
      $("#humidity").text(response.current.humidity+"%");
      $("#wind").text(response.current.wind_speed+" Meters/second");
      $("#uv").text(response.current.uvi);

      setUVcolor(response.current.uvi);

      futureForcast(response);
    });
  }

  //Set the color of the uv index
  function setUVcolor(data){
    if(data >= 0 && data <= 2)
    {
      $("#uv").css({"background-color":"green"});
    }else if(data >= 3 && data <= 5)
    {
      $("#uv").css({"background-color":"yellow"});
    }else if(data >= 6 && data <= 7)
    {
      $("#uv").css({"background-color":"orange"});
    }else if(data >= 8 && data <= 10)
    {
      $("#uv").css({"background-color":"red"});
    }
  }

  //Get the 5 days future forecast
  function futureForcast(data) {
    var $section = $(".forecast");
    $section.text(" ");
    for (var i = 0; i < 5; i++) {
      var $forcast = $("<section>");
      var $date = $(
        "<p>" +
          moment()
            .add(1 + i, "days")
            .format("ddd, MMM Do YYYY") +
          "</p>"
      );
      var $img = $("<img src = http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + ".png />");
      var $temp = $("<p>Temp: " + data.daily[i].temp.day +" &#8451; </p>");
      var $humidity = $("<p>Humidity: " + data.daily[i].humidity + "%</p>");

      $forcast.append($date, $img, $temp, $humidity);
      $section.append($forcast);
    }
  }
});

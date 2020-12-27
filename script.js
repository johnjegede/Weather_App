$(document).ready(function () {
  var apikey = "61b3a83a8674abd5cdfebbda62719854";
  var latitude;
  var longitude;
  var cities = [];
  var cityEl = localStorage.getItem("cityEl");
  var date = moment().format("dddd, MMMM Do YYYY");

  var submit = $(".btn");
  var $citylist = $("#search");

  if(cityEl !== null){
    $("#citys").text(cityEl);
    $("#date").text(" " + date);
    getCordinats(cityEl);
  }

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

  function displaySearch(cities) {
    $citylist.text(" ");
    for (var i = 0; i < cities.length; i++) {
      var listItem = $("<li>" + cities[i] + "</li>");
      $citylist.append(listItem);
    }
  }

  $citylist.on("click", function (event) {
    cityevent = event.target.textContent;
    $("#citys").text(cityevent);
    $("#input").val("");
    getCordinats(cityevent);
  });

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

  function getCurrentWether(long, lat) {
    var currentUrl =
      "https://api.openweathermap.org/data/2.5/onecall?lat=" +
      lat +
      "&lon=" +
      long +
      "&exclude=minutely,hourly,alerts&appid=" +
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
      $("#humidity").text(response.current.humidity);
      $("#wind").text(response.current.wind_speed);
      $("#uv").text(response.current.uvi);

      setUVcolor(response.current.uvi);

      futureForcast(response);
    });
  }

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

  function futureForcast(data) {
    var $section = $(".forecast");
    $section.text(" ");
    for (var i = 0; i < 5; i++) {
      var $forcast = $("<section>");
      var $date = $(
        "<p>" +
          moment()
            .add(1 + i, "days")
            .format("dddd, MMMM Do YYYY") +
          "</p>"
      );
      var $img = $("<img src = http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + ".png />");
      var $temp = $("<p>" + data.daily[i].temp.day + "</p>");
      var $humidity = $("<p>" + data.daily[i].humidity + "</p>");

      $forcast.append($date, $img, $temp, $humidity);
      $section.append($forcast);
    }
  }
});

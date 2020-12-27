$(document).ready(function () {
  var apikey = "61b3a83a8674abd5cdfebbda62719854";
  var latitude;
  var longitude;
  var cities = [];

  var submit = $(".btn");

  submit.on("click", function (e) {
    //e.prevendefault();
    var city = $("#input").val();
    $("#citys").text(city);
    var date = moment().format("dddd, MMMM Do YYYY");
    $("#date").text(" " + date);

    if (cities.includes(city) === false) {
      cities.push(city);
      console.log(cities);
      displaySearch(cities);
      getCordinats(city);
    } else if (city !== cities[cities.length - 1]) {
      getCordinats(city);
    }
  });

  function displaySearch(cities) {
    var $citylist = $(".search");
    for (var i = 0; i < cities.length; i++) {
      var listItem = $("<li>" + cities[i] + "</li>");
    }
    $citylist.append(listItem);
  }
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
      console.log(response);
      $(".temp").text(response.current.temp);
      $(".humidity").text(response.current.humidity);
      $(".wind").text(response.current.wind_speed);
      $(".uv").text(response.current.uvi);

      futureForcast(response);
    });
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
      var $temp = $("<p>" + data.daily[i].temp.day + "</p>");
      var $humidity = $("<p>" + data.daily[i].humidity + "</p>");

      $forcast.append($date, $temp, $humidity);
      $section.append($forcast);
    }
  }
});

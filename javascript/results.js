// import flight from '../data/flight.json' assert{type: 'json'};
let flight;
let flightData;
let filteredFlights;


function loadData() {
  return fetch('../data/flight.json')
    .then(response => response.json())
    .then(data => {
      flight = data;
    flightData = [...flight];
    filteredFlights = [...flight];
    })
    .catch(error => console.error('Error fetching data:', error));
}

window.addEventListener("load", function () {
  loadData().then(() => {
    FilterLogic();
  });
});
// const flightData = [...flight];
// var filteredFlights = [...flight];
const singleTripTab = document.getElementById("singleTripTab");
const roundTripTab = document.getElementById("roundTripTab");
const departureCity = document.getElementById("departure-city");
var typeofTrip = "singleTrip";
var formData = {}

/* side bar filters data */
var stopsFilterData = [];
var departureTimeFilterData = [];
var priceFilterData = { "minimum": 0, "maximum": 100000 };
var providerFilterData = [];



//function for single trip and round trip
function handleTabClick(tab) {
  if (tab === "singleTrip") {
    singleTripTab.classList.add("active");
    roundTripTab.classList.remove("active");
    let rdate = document.getElementById('return')
    typeofTrip = "singleTrip";
    rdate.value = null;
    rdate.style.display = "none";
  } else if (tab === "roundTrip") {
    typeofTrip = "roundTrip";
    singleTripTab.classList.remove("active");
    roundTripTab.classList.add("active");
    let rdate = document.getElementById('return')
    rdate.style.display = "inline-block";
  }
}
singleTripTab.addEventListener("click", function () {
  handleTabClick("singleTrip");
});
roundTripTab.addEventListener("click", function () {
  handleTabClick("roundTrip");
});

function FilterLogic() {
  // Retrieve form data from local storage
  let triptypeFromIndexPage = localStorage.getItem("tripType")
  if (triptypeFromIndexPage == null) {
    handleTabClick("singleTrip");
  }
  // console.log(triptypeFromIndexPage)
  handleTabClick(triptypeFromIndexPage);

  formData = {
    "from-city-name": localStorage.getItem("from-city-name"),
    "to-city-name": localStorage.getItem("to-city-name"),
    "departure-date": localStorage.getItem("departure-date"),
    "return-date": localStorage.getItem("return-date"),
    "traveller": localStorage.getItem("traveller"),
    "type": localStorage.getItem("type")
  };

  // console.log(formData)
  document.getElementById("from-city-name").value = formData["from-city-name"]
  document.getElementById("to-city-name").value = formData["to-city-name"]
  document.getElementsByName("departure-date")[0].value = formData["departure-date"]
  document.getElementsByName("return-date")[0].value = formData["return-date"]
  document.getElementsByName("traveller")[0].value = formData["traveller"]
  document.getElementsByName("type")[0].value = formData["type"];

  // console.log(filteredFlights, formData)
  filteredFlights = flightData.filter(flight => {
    let departureDate = flight.departureDateTime.split("T")
    return (
      (flight.fromCity.toLowerCase() === formData["from-city-name"].toLowerCase())
      &&
      (flight.toCity.toLowerCase() === formData["to-city-name"].toLowerCase()) &&
      (departureDate[0].toLowerCase() === formData["departure-date"].toLowerCase()) &&
      (flight.ticketType.toLowerCase() === formData["type"].toLowerCase())
    );
  });
  if(typeofTrip=="roundTrip"){
    flightData.filter(flight => {
      let returnDate = flight.arrivalDateTime?.split("T")
      let r=
        (flight.fromCity.toLowerCase() === formData["to-city-name"].toLowerCase())
        &&
        (flight.toCity.toLowerCase() === formData["from-city-name"].toLowerCase()) &&
        (returnDate[0].toLowerCase() === formData["return-date"].toLowerCase()) &&
        (flight.ticketType.toLowerCase() === formData["type"].toLowerCase())
        if(r){
          filteredFlights.push(flight);
        }
      
    });

  }
  console.log(filteredFlights, typeofTrip)
  displayResults(filteredFlights);
  // Clear the form data from local storage
  localStorage.clear();
}
// window.addEventListener("load", function () {
//   FilterLogic();
// });

// Display flight search results
const resultsContainer = document.getElementById("filtered-flights");

function displayResults(resultData) {
  let html = "";
  
  departureCity.innerHTML = "Departure from " + formData["from-city-name"].charAt(0).toUpperCase() 
   +formData["from-city-name"].substr(1).toLowerCase();
  resultsContainer.innerHTML = html = "";
  if (resultData.length > 0) {
    resultData.forEach(flight => {

      html += `
      <div class = "flight-card">
      <div  class="logo">
      <div>
      <img src=${flight.logo} >
      </div>
      <span>${flight.provider}</span>
      </div>
      <div class="from-city">
      <div>${flight.fromCity}</div>
      <div>${flight.departureDateTime.split("T")[0]}</div>
      <div>${flight.departureDateTime.split("T")[1]}</div>
      </div>
      <div class="departure-date-time">
      <div>${Math.abs(new Date(flight.departureDateTime) - new Date(flight.arrivalDateTime)) / 36e5} hrs</div>
      <span><i class="fa-solid fa-arrow-right"></i></span>
      <div class="stops">${flight.numberOfStops ? `<span>${flight.middleStops}</span>` : ``}</div>
      </div>
      <div  class ="to-city">
      <div>${flight.toCity}</div>
      <div>${flight.arrivalDateTime.split("T")[0]}</div>
      <div>${flight.arrivalDateTime.split("T")[1]}</div>
      </div>
      <div class="price" >
      <div>Price</div>
      <div>${flight.price}</div>
      </div>
      <button id="book-button">Book</div>
      </div>
      `;
      resultsContainer.innerHTML = html;
    });
  } else {
    html = ` <div class = "flight-card">
    <div style="padding:10px;display:inline-block">
    <img src= "https://previews.123rf.com/images/blankstock/blankstock2005/blankstock200500579/146308645-cancel-flight-icon-no-flights-sign-stop-travelling-symbol-classic-flat-style-quality-design.jpg" height="300px" width="300px" />
    </div>
    <h3 class="no-result">No flights found.</h3>
    </div>`;
    resultsContainer.innerHTML = html;
  }
}

const resultbutton = document.getElementById("search-button")
resultbutton.addEventListener("click", function (event) {
  event.preventDefault();
  const form = document.getElementById("form");
  const formData = new FormData(form);
  for (let pair of formData.entries()) {
    if (pair[1] == "" || pair[1] == "null") {
      console.log(typeofTrip, pair)
      if (typeofTrip == "singleTrip" && pair[0] == "return-date") {
        continue;

      }
      console.log(pair)
      alert(`Please Enter the ${pair[0]}`)
      return;
    }
    if(typeofTrip=="roundTrip" && (localStorage.getItem("return-date")< localStorage.getItem("departure-date"))){
      alert("return should be greater than or equal to depature date")
      return;
    }
    console.log(pair)
    localStorage.setItem(pair[0], pair[1]);
  }
  localStorage.setItem("tripType", typeofTrip);
  FilterLogic();
});

function displayAccordion() {

  let child = this.nextElementSibling;
  if (child.style.display === 'block') {
    child.style.display = 'none';
  } else {
    child.style.display = 'block';
  }
};



// calling accordion function
let acc = document.getElementsByClassName('accordion');
for (let i = 0; i < acc.length; i++) {
  acc[i].addEventListener('click', displayAccordion);
}


/* Getting selected stops data from side bar filters */
let stopsElements = document.getElementsByClassName("stops")
for (let i = 0; i < stopsElements.length; i++) {
  stopsElements[i].addEventListener('click', function () {
    let stopsElementsArray = [];
    for (let k of stopsElements) {
      if (k.checked) {
        stopsElementsArray.push(k.value);
      }
    }
    if (stopsElementsArray.length == 0) {

      displayResults(filteredFlights);
    }
    else {
      stopsFilterData = [...stopsElementsArray]
      allFiltersApply()
    }
  });
}

/* Getting selected departure time data from side bar filters */
let departureCheckboxElements = document.getElementsByClassName("departure-time")
for (let i = 0; i < departureCheckboxElements.length; i++) {
  let departureCheckboxElements = document.getElementsByClassName("departure-time")
  departureCheckboxElements[i].addEventListener('click', function () {
    let filterArray = [];
    for (let k of departureCheckboxElements) {
      if (k.checked) {
        filterArray.push(k.value);
      }
    }
    if (filterArray.length == 0) {

      displayResults(filteredFlights);
    }
    else {
      departureTimeFilterData = [...filterArray]
      allFiltersApply()
    }
  });
}
function checkTimeRange(time) {
  time = new Date(time)
  var hour = time.getHours();
  if (hour >= 0 && hour < 6) {
    return "12am-6am";
  }
  else if (hour >= 6 && hour < 12) {
    return "6am-12pm";
  }
  else if (hour >= 12 && hour < 18) {
    return "12pm-6pm";
  }
  else {
    return "6pm-12am";
  }
}

/* Getting selected service providers data from side bar filters */
let airLine = document.getElementsByClassName('airline')
for (let i = 0; i < airLine.length; i++) {
  airLine[i].addEventListener('click', function () {
    let airLineArray = [];
    for (let k of airLine) {
      if (k.checked) {
        airLineArray.push(k.value);
      }
    }
    if (airLineArray.length == 0) {

      displayResults(filteredFlights);
    }
    else {
      providerFilterData = [...airLineArray]
      allFiltersApply()
    }
  });
}

/* price slider */
$(document).ready(function () {
  var sliderDiv = $('#slider');
  sliderDiv.slider({
    range: true,
    min: 2500,
    max: 15000,
    values: [2500, 15000],
    slide: function (event, ui) {
    },
    stop: function (event, ui) {
      $('#Min').val('₹' + ui.values[0]);
      $('#Max').val('₹' + ui.values[1]);
      console.log(ui.values, ui)
      priceFilterData.minimum = ui.values[0]
      priceFilterData.maximum = ui.values[1]
      allFiltersApply()
    },
    create: function () {
      $(".ui-slider-handle").css({
        "background-color": "#81c0ea", /* Customize the handler background color */
        "border-color": "#81c0ea",/* Customize the handler border color */
        "border-radius": "60%",
      });
      $(".ui-slider-range").css("background-color", "#81c0ea"); /* Customize the range background color */
    }
  });
  $('#Min').val(sliderDiv.slider('values', 0));
  $('#Max').val(sliderDiv.slider('values', 1));
});

/* swapping cities from - to */
function swap() {
  let fromCity = document.getElementById("from-city-name");
  let toCity = document.getElementById("to-city-name");
  let fromCityValue = fromCity.value;
  let toCityValue = toCity.value;
  fromCity.value = toCityValue;
  toCity.value = fromCityValue;
}

let swapCity = document.getElementById("swap-button");
  swapCity.addEventListener('click',swap);


/* search box for searching flight providers names */
let z = document.getElementById('search-airlines');
z.addEventListener("keyup", () => { search_function(z) })
function search_function(z) {
  let v = []
  let airLineData = filteredFlights;
  let g = z.value;
  let l = airLineData.length
  for (let h = 0; h < l; h++) {
    let n = flight[h].provider;
    if (n.toLowerCase().startsWith(g.toLowerCase())) {
      v.push(flight[h])
    }
  }
  displayResults(v);
}


/* side bar all filters satisfying logic */

function allFiltersApply() {
  let arr = [];
  let temp = [];
  let flag = 0;
  /* filtering based on stops */
  if (stopsFilterData.length > 0) {
    flag = 1;
    for (let i = 0; i < filteredFlights.length; i++) {
      for (let j = 0; j < stopsFilterData.length; j++) {
        if (filteredFlights[i]['numberOfStops'] == stopsFilterData[j]) {
          temp.push(filteredFlights[i]);
        }
      }
    }
  }
  else {
    arr = [...filteredFlights]
  }
  if (flag == 1) {
    arr = [...temp]
    temp = []
  }

  flag = 0;
  /* filtering based on departure timings */
  if (departureTimeFilterData.length > 0) {
    flag = 1
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < departureTimeFilterData.length; j++) {
        if (checkTimeRange(arr[i]['departureDateTime']) == departureTimeFilterData[j]) {
          temp.push(arr[i]);
        }
      }
    }
  }
  if (flag == 1) {
    arr = [...temp]
    temp = []
  }

  /* filtering based on price */
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].price >= priceFilterData.minimum && arr[i].price <= priceFilterData.maximum) {
      temp.push(arr[i]);
    }
  }
  arr = [...temp]
  temp = []

  /* filtering based on flight provider names */
  flag = 0;
  if (providerFilterData.length > 0) {
    flag = 1;
    for (let i = 0; i < arr.length; i++) {

      for (let j = 0; j < providerFilterData.length; j++) {

        if (arr[i]['provider'].includes(providerFilterData[j])) {
          temp.push(arr[i]);

        }
      }
    }
  }
  if (flag == 1 && temp.length > 0) {
    arr = [...temp]
    temp = []
  }

  /* calling function to display results*/
  displayResults(arr)
}



//function to sort mobile data based on price Low to High
function sortLowHigh() {
  let newData =filteredFlights;

  let filterData = newData.sort(function (highPrice, lowPrice) {
    let lowprice = lowPrice.price;
    let highprice = highPrice.price;
    return lowprice - highprice;
  });
  displayResults(filterData);
  allFiltersApply();

}
let priceHigh = document.getElementById('price-high');
priceHigh.addEventListener("click",sortHightoLow);


//function to sort mobile data based on price High to Low
function sortHightoLow() {
let newData = filteredFlights;

let filterData = newData.sort(function (highPrice, lowPrice) {
  let lowprice = lowPrice.price;
  let highprice = highPrice.price;
  return highprice - lowprice;
});
displayResults(filterData);
allFiltersApply();

}

let priceLow = document.getElementById('price-low');
priceLow.addEventListener("click", sortLowHigh);




//to disable the previous dates in calender
let departureDate=document.getElementById('departure-date');
let arrivalDate=document.getElementById('return-date');


var dtToday = new Date();

var month = dtToday.getMonth() + 1;
var day = dtToday.getDate();
var year = dtToday.getFullYear();
if(month < 10)
    month = '0' + month.toString();
if(day < 10)
    day = '0' + day.toString();

var maxDate = year + '-' + month + '-' + day;
departureDate.setAttribute('min', maxDate);
arrivalDate.setAttribute('min', maxDate);




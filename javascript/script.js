const resultbutton = document.getElementById("search-button")
var typeofTrip = "singleTrip";
resultbutton.addEventListener("click", function(event) {
    event.preventDefault(); 
    const form = document.getElementById("form");
    const formData = new FormData(form);
    for (let pair of formData.entries()) {
      if(pair[1]=="" || pair[1]== "null" ){
        if(typeofTrip=="singleTrip" && pair[0]=="return-date"){
          continue;

        }
        alert(`Please Enter the ${pair[0]}`)
        return;
      }
    localStorage.setItem(pair[0], pair[1]);
    }
    if(typeofTrip=="roundTrip" && (localStorage.getItem("return-date")< localStorage.getItem("departure-date"))){
      alert("return should be greater than or equal to depature date")
      return;
    }
    localStorage.setItem("tripType",typeofTrip)
    window.open("results.html", "_blank");
    
  });


  window.addEventListener("load", function() {
    const singleTripTab = document.getElementById("singleTripTab");
    const roundTripTab = document.getElementById("roundTripTab");

    function handleTabClick(tab) {
      if (tab === "singleTrip") {
        typeofTrip= "singleTrip";
        singleTripTab.classList.add("active");
        roundTripTab.classList.remove("active");
        let rdate = document.getElementById('return-date')
        rdate.value = null;
        rdate.style.display="none";
        localStorage.setItem("tripType","singleTrip")
      } else if (tab === "roundTrip") {
        typeofTrip= "roundTrip";
        singleTripTab.classList.remove("active");
        roundTripTab.classList.add("active");
        let rdate = document.getElementById('return-date')
        rdate.style.display="inline-block";
        localStorage.setItem("tripType",typeofTrip)
      }
    }
    handleTabClick("singleTrip")
    singleTripTab.addEventListener("click", function() {
      handleTabClick("singleTrip");
    });
  
    roundTripTab.addEventListener("click", function() {
      handleTabClick("roundTrip");
    });
  });


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


  let slideIndex = 0;

function showSlides() {
  let i;
  let slides = document.getElementsByClassName("carousel-slide");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1}    
  slides[slideIndex-1].style.display = "block";  
  setTimeout(showSlides, 6000);
}
showSlides();




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




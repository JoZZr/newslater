//DOM element variables
var header = document.querySelector("header");
var navigation = document.getElementById("navigation");
var navigationLinks = document.querySelectorAll("#navigation li");
var navigationThemes = navigationLinks[3];
var logo = document.getElementById("logo");
var paralaxImage = document.querySelectorAll(".paralaxImage");
var breadcrumbs = document.getElementById("breadcrumbs");

//Navigation dropdown menues
navigationThemes.addEventListener("mouseenter", function () {
	var dropdown = document.createElement("div");
	
	dropdown.innerHTML = "<ul><li><strong>Lebensmittel & Getränke</strong></li><li><a>Bier</a></li><li><a>Essen / Kochen</a></li><li><a>Fast-Food</a></li><li><a>Wein</a></li></ul><ul><li><strong>Sport & Freizeit</strong></li><li><a>Events</a></li><li><a>Sport</a></li><li><a></a></li><li><a>Reisen</a></li></ul>";
	dropdown.className += "dropdown";
	header.appendChild(dropdown);
});

navigationThemes.addEventListener("mouseout", function () {
	var dropdown = document.querySelector(".dropdown");
	var dropdownHovered = false;
	
	navigationThemes.className += "active";
	
	dropdown.addEventListener("mouseover", function () {
		dropdownHovered = true;
		navigationAddEffects();
	});
	dropdown.addEventListener("mouseout", function () {
		dropdownHovered = false;
		navigationRemoveEffects();
	});
	
	var thisInterval = setInterval(function () {
		if(!dropdownHovered) {
			if (dropdown) {
				header.removeChild(dropdown);
			}
			navigationThemes.className = "";
			clearInterval(thisInterval);
		}
	}, 0);
});

//Breadcrumbs settings
	//Show or hide
var showBreadmcrumbs = function () {
	if (breadcrumbs.childElementCount > 0) {
		breadcrumbs.style.display = "inherit";
	}
}();

//Navigation animation effects
var navigationAddEffects = function () {
	header.style.borderBottom = "4px solid red";
	navigation.style.marginBottom = "-4px";
};

var navigationRemoveEffects = function () {
	header.style.borderBottom = "0";
	navigation.style.marginBottom = "0";
};

for (var i = 0; i < navigationLinks.length; i++) {
	navigationLinks[i].addEventListener("mouseover", navigationAddEffects);
	navigationLinks[i].addEventListener("mouseout", navigationRemoveEffects);
}

//Emotion image animation effects
	document.addEventListener("scroll", function () {
		for (var i = 0; i < paralaxImage.length; i++) {	
		paralaxImage[i].style.backgroundPosition = "0 " + (-300 - window.pageYOffset / 2) + "px";
		}
	});

//Iframe resize
var placeholderIframe = document.querySelector("#placeholder iframe");
if (placeholderIframe) {
	placeholderIframe.src = "ww.html";
}

function iframeLoaded() {
  if(placeholderIframe) {
		placeholderIframe.style.height = "";
		placeholderIframe.style.height = placeholderIframe.contentWindow.document.body.scrollHeight + "px";
  }   
}

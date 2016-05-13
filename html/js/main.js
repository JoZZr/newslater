//DOM element variables
var header = document.querySelector("header");
var navigation = document.getElementById("navigation");
var navigationLinks = document.querySelectorAll("#navigation li");
var navigationThemes = navigationLinks[3];
var logo = document.getElementById("logo");
var paralaxImage = document.querySelectorAll(".paralaxImage");
var messageIframe = document.querySelector("#message iframe");

//Navigation dropdown menues
navigationThemes.addEventListener("mouseenter", function() {
	var dropdown = document.createElement("div");

	dropdown.innerHTML = "<ul><li><strong>Lebensmittel & Getränke</strong></li><li><a>Bier</a></li><li><a>Essen / Kochen</a></li><li><a>Fast-Food</a></li><li><a>Wein</a></li></ul><ul><li><strong>Sport & Freizeit</strong></li><li><a>Events</a></li><li><a>Sport</a></li><li><a></a></li><li><a>Reisen</a></li></ul>";
	dropdown.className += "dropdown";
	header.appendChild(dropdown);
});

navigationThemes.addEventListener("mouseout", function() {
	var dropdown = document.querySelector(".dropdown");
	var dropdownHovered = false;

	navigationThemes.className += "active";

	dropdown.addEventListener("mouseover", function() {
		dropdownHovered = true;
		navigationAddEffects();
	});
	dropdown.addEventListener("mouseout", function() {
		dropdownHovered = false;
		navigationRemoveEffects();
	});

	var thisInterval = setInterval(function() {
		if (!dropdownHovered) {
			if (dropdown) {
				header.removeChild(dropdown);
			}
			navigationThemes.className = "";
			clearInterval(thisInterval);
		}
	}, 0);
});

//Navigation animation effects
var navigationAddEffects = function() {
	header.style.borderBottom = "4px solid red";
	navigation.style.marginBottom = "-4px";
};

var navigationRemoveEffects = function() {
	header.style.borderBottom = "0";
	navigation.style.marginBottom = "0";
};

for (var i = 0; i < navigationLinks.length; i++) {
	navigationLinks[i].addEventListener("mouseover", navigationAddEffects);
	navigationLinks[i].addEventListener("mouseout", navigationRemoveEffects);
}

//Emotion image animation effects
document.addEventListener("scroll", function() {
	for (var i = 0; i < paralaxImage.length; i++) {
		paralaxImage[i].style.backgroundPosition = "0 " + (-300 - window.pageYOffset / 2) + "px";
	}
});

var addBreadcrumbs = function() {
	var breadcrumbs = $("#breadcrumbs"),
		dynamicBreadcrumbs = [$("<div class='breadcrumb'><a href='/'>Startseite</a></div>")];

	//Can be removed later
	if (!breadcrumbs) {
		return false;
	}

	$.getJSON("/message?id=" + messageIframe.src.match(/id=(.*?)&/)[1], function(obj) {
		obj.labels.forEach(function(elem) {
			$.getJSON("/labels", function(labels) {
				labels.forEach(function(label) {
					if (label.id === elem && label.id !== "Label_6") {
						dynamicBreadcrumbs.push($("<div class='breadcrumb'>" + label.label + "</div>"));
					}
				})

				for (var i = 0; i < dynamicBreadcrumbs.length; i++) {
					breadcrumbs.append(dynamicBreadcrumbs[i]);
				}

			});
		});
	});


};

//Iframe resize
function iframeLoaded() {
	if (messageIframe) {
		var windowHeight = window.height;
		messageIframe.style.height = windowHeight;
		messageIframe.addEventListener("load", function() {
			messageIframe.style.height = "0";
			messageIframe.style.height = messageIframe.contentWindow.document.body.scrollHeight + "px";
		});
	}

	addBreadcrumbs();
}

//Random message display
var displayRandomMessage = function() {
	if (!messageIframe) {
		return false;
	}
	if (!messageIframe.classList.contains("random")) {
		return false;
	}

	//TO REMOVE LATER
	// messageIframe.src = "http://localhost:3000/message?id=1548b323ce577cd7&info=body";
	// iframeLoaded();
	// return false;
	//END

	$.getJSON("/labels", function(obj) {
		var random = Math.floor(Math.random() * obj.length),
			randomLabel = obj[random],
			randomLabelId = randomLabel.id.match(/\d+/)[0];

		$.getJSON("/messages?id=" + randomLabelId, function(obj) {
			var src,
				random,
				randomMessage,
				randomMessageId,
				size = obj.resultSizeEstimate;

			if (size === 0) {
				return displayRandomMessage();
			}

			random = Math.floor(Math.random() * size);
			randomMessage = obj.messages[random];
			randomMessageId = randomMessage.id;
			src = "/message?id=" + randomMessageId + "&info=body"
			messageIframe.src = src;
			iframeLoaded();
		});
	});
};

displayRandomMessage();


var displayMostviewed = function () {
	var mostviewed = document.querySelector(".mostviewed");

	if (!mostviewed) return false;

	if (mostviewed.id === "overall") {
		mostviewed = $("#overall.mostviewed");
		$.getJSON("/mostviewed", function(res) {
			var rank, title, category, items = [];
			
			for (var i = 0; i < res.length; i++) {
				rank = i + 1;
				title = res[i].name;
				category = res[i].labels;
				id = res[i].message_id;
				
				items.push($("<li><span>" + rank + "</span><span>" + title + "</span><span>" + category + "</span></li>"));
			}
			items.unshift("<ul>")
			items.push("</ul>");
			console.log(mostviewed);
			for (var i = 0; i < items.length; i++) {
				mostviewed.append(items[i]);
			}
			
		});
	}
};
displayMostviewed(); 

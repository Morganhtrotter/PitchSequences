window.onload = function() {
	var sequence = "";

	$("fastballButton").onclick = function() {
		sequence += "fastball-";
		$("sequenceText").innerHTML = sequence;
	}

	$("changeupButton").onclick = function() {
		sequence += "changeup-";
		$("sequenceText").innerHTML = sequence;
	}

	$("curveballButton").onclick = function() {
		sequence += "curveball-";
		$("sequenceText").innerHTML = sequence;
	}

	$("sliderButton").onclick = function() {
		sequence += "slider-";
		$("sequenceText").innerHTML = sequence;
	}

	$("strikeoutButton").onclick = function() {
		sequence += "strikeout";
		$("sequenceText").innerHTML = sequence;
	}

	$("groundoutButton").onclick = function() {
		sequence += "groundout";
		$("sequenceText").innerHTML = sequence;
	}

	$("reset").onclick = function() {
		sequence = "";
		$("sequenceText").innerHTML = sequence;
	}

	$("add").onclick = function() {
		console.log("here");
		WriteToFile(sequence);
	}
}

function WriteToFile(sequence) {
	// Look into localStorage
}

function $(id) {
	return document.getElementById(id);
}

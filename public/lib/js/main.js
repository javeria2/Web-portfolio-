jQuery(document).ready(function($) {
	document.getElementById("frame").onload = function (){ 
		$('html, body').animate({
			scrollTop: 0
			}, 1000);
	}
});

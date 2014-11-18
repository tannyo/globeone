
$(document).ready(function(){
	var count = parseInt($(".map-point").length);
	var i = 0;





	function startPausing(){
	  if(i<=count){
	    window.setTimeout(startPausing, 200);
	    $('.map-point-reg-america'+i+'').addClass('pulse');
	    $('.map-point-reg-africa'+i+'').addClass('pulse');
	    $('.map-point-reg-europe'+i+'').addClass('pulse');
	    $('.map-point-reg-asia'+i+'').addClass('pulse');
	    $('.map-point-reg-asia-a'+i+'').addClass('pulse');
	    $('.map-point-reg-asia-b'+i+'').addClass('pulse');
	    $('.map-point-reg-australia'+i+'').addClass('pulse');
	    $('.map-point01-'+i+'').addClass('pulse');
	    $('.map-point-reg-america'+i+'').addClass('pulse');
	    /*$('.map-point-reg-america02-'+i+'').addClass('pulse');*/
	    $('.map-point-reg-america03-'+i+'').addClass('pulse');
	    i++;
	  }
	}
	startPausing();







});

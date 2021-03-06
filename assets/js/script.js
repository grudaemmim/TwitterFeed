var CelsoTwitter = {
	busca: 'naturamusical',
	qtd: 10
};

// define array for bird queue
var ToriQueue = new Array(0);
var currentQueueIndex = 0;

// Tory Types: CSS name, Max Speed, Min Speed
ToriTypes = []; //new Array(1)
ToriTypes[0] = ["XL", 880000, 880000];
/*ToriTypes[1] = ["L", 15000, 10000];
ToriTypes[2] = ["M", 20000, 15000];
ToriTypes[3] = ["S", 25000, 20000];
ToriTypes[4] = ["XS", 30000, 25000];*/

// Cloud Types: CSS name, Speed, Initial Speed
CloudTypes = new Array(3)
CloudTypes[0] = ["L", 35000, 8000];
CloudTypes[1] = ["M", 40000, 20000];
CloudTypes[2] = ["S", 45000, 30000];
CloudTypes[3] = ["SS", 65000, 80000];
CloudTypes[4] = ["SG", 15000, 35000];

$(document).ready(function(){

	// facebox for about tori's eye
	$('a[rel*=facebox]').facebox();
	
	// History
	function pageload(hash) {
/* 		hash = encodeURIComponent(hash); */
		if(hash) {
			fetchFeed('search.twitter.com/search', 'callback=?&rpp='+CelsoTwitter.qtd+'&', hash);
		} else {
			fetchFeed('search.twitter.com/search', 'callback=?&rpp='+CelsoTwitter.qtd+'&', CelsoTwitter.busca);
		}
	}

	$.historyInit(pageload);

	$("form:first").submit(function(){
		var hash = $("#search").val();	
		$.historyLoad(hash);
		return false;
	});

	// Start the never-ending spawn cycle
	spawnTori();
	
	// Start the cloud movement
	for (i = 0; i < CloudTypes.length; ++ i) {
		moveCloud(CloudTypes[i][0], CloudTypes[i][1], CloudTypes[i][2]);
	}
	
	// Search input listener to update submit button icon
	$("#search").keyup( function() {
		$("#sendBttn").removeClass("error");
		$("#sendBttn").addClass("standby");
	});

});

// Cloud movement
function moveCloud(id, speed, initialspeed) {
	if (parseInt($("#cloud" + id).css("left")) == 100) {
		// Second or + movement, final speed
		$("#cloud" + id).css("left", "-220px");
		thisspeed = speed;
	} else {
		// First time it's moving, so start at initial speed
		thisspeed = initialspeed;
	}
		
	$("#cloud" + id).animate({left:"100%"}, thisspeed, "linear");
	setTimeout("moveCloud('" + id + "', "+speed+")", thisspeed+100);
}

// Parse tweets to make links to links, @usernames and #hashtags
function chat_string_create_urls(input) {
    return input
    .replace(/(ftp|http|https|file):\/\/[\S]+(\b|$)/gim, '<a href="$&" class="my_link" target="_blank">$&</a>')
    .replace(/([^\/])(www[\S]+(\b|$))/gim, '$1<a href="http://$2" class="my_link" target="_blank">$2</a>')
    .replace(/(^|\s)@(\w+)/g, '$1<a href="http://twitter.com/$2" class="my_link" target="_blank">@$2</a>')
    .replace(/(^|\s)#(\S+)/g, '$1<a href="http://search.twitter.com/search?q=%23$2" class="my_link" target="_blank">#$2</a>');
}

// Hover/out dos Tori's
/*
$('.toriWrapper') 
    .livequery(function(){ 
		var previousZ;
		var newSpeed;
        $(this) 
            .hover(function() {
				if ($(this).find('.tweet').is(':hidden')) {
					previousLeft = parseInt($(this).css('left'));
					screenWidth = $(document).width();
					
					// Only show tweet if not on edges
					//if ((previousLeft > 100) && ((screenWidth - previousLeft) > 100)) {
						$(this).stop();
						previousZ = $(this).css('z-index');
						previousSpeed = parseInt($(this).attr('speed'));
						newSpeed = parseInt((previousLeft/(screenWidth + 150)) * previousSpeed);
						
						$(this).css('z-index','100');
						$(this).find('.tweet').show('fast');
						$(this).stop();
					//}
				}
            }, function() { 
				if ($(this).find('.tweet').is(':visible')) {
					$(this).find('.tweet').hide('fast');
					$(this).animate({left:'-150px'}, newSpeed, 'linear', function (){
						$(this).hide();
						$(this).remove();
						$(this).empty();
					}).css('z-index',previousZ);
				}
            });
		$(this).click(function () {
				// On Tory Click
				//$(this).fadeOut("slow");					
			});
    }); 
	
*/

/* define function to spawn tories */
function spawnTori(){
	var currentToriSpeed = 30000;
	if ((ToriQueue.length >= currentQueueIndex) && (ToriQueue[currentQueueIndex] != undefined)) {
		
		/* Twit message */
		currentToriText = chat_string_create_urls(ToriQueue[currentQueueIndex][0]);
		currentToriTwittID = ToriQueue[currentQueueIndex][1];
		currentTorifrom_user = ToriQueue[currentQueueIndex][2];
		currentToricreated_at = ToriQueue[currentQueueIndex][3]; 
		currentToriDivID = Math.floor(Math.random()*1000000);
		
		/* pick a ori type */
		currentToriType = 0; //Math.floor(5*Math.random());
		
		 //ToriTypes[currentToriType][2] + (Math.floor((ToriTypes[currentToriType][1]-ToriTypes[currentToriType][2])*Math.random()))
		
		// Build Tori HTML
			torihtml = '\
			<div id="'+ currentToriDivID +'" class="toriWrapper tori'+ ToriTypes[currentToriType][0] +'Wrapper" speed="'+currentToriSpeed+'">\
				<div class="toriBouncer">\
					<a href="javascript:void(0);"><img src="assets/img/layout/tori'+ ToriTypes[currentToriType][0] +'.png"></a>\
					<br/><div class="tweet">\
						<h2><strong><a href="http://twitter.com/'+currentTorifrom_user+'" title="'+currentTorifrom_user+'" target="_blank"> '+currentTorifrom_user+'</a> </strong> disse: <i><a class="timeago" href="http://twitter.com/'+currentTorifrom_user+'/statuses/'+currentToriTwittID+'" target="_blank"> <abbr title="'+currentToricreated_at+'">'+jQuery.timeago(currentToricreated_at.substring(4))+'</abbr></a></i></h2>\
						<p>'+currentToriText+'</p>\
					</div>\
				</div>\
			</div>';
		
		// Append Tori to #content
		$('#content').append(torihtml);

		// Twitt built, now slide to left and start to bounce
		startHim('#'+currentToriDivID, currentToriSpeed);
		bounceHim('#'+currentToriDivID);
		
		// Set counter to go to next in queue on the next time spawnTori is called
		currentQueueIndex ++;
		
	//} else if(currentQueueIndex > 0)  {
		//RESTART, REQUERY
		
	} else {
		// Nothing good found in Queue, go to beginning
		currentQueueIndex = 0;
		fetchFeed('search.twitter.com/search', 'callback=?&rpp='+CelsoTwitter.qtd+'&', CelsoTwitter.busca);
	}
	
	// Go to try next in queue, in 2000 to 4000 ms
	setTimeout("spawnTori()",currentToriSpeed - 10000 ); //+ parseInt(Math.random()*10000))
}

function startHim(id, speed){
	randomHeight = 25-parseInt(Math.random()*50);
	$(id).css('left', $(document).width() + 'px');
	$(id + " .toriBouncer").css('margin-top', randomHeight + 'px');
	$(id).animate({left:"-1050px"}, speed, "linear", function (){
	$(this).hide();
	$(this).remove();
	$(this).empty();
});
}

function bounceHim(id){
	$(id + " .toriBouncer").animate({marginTop:"-=4px"},450).animate({marginTop:"+=4px"},300);
	if ($(id).is(':visible')) {
 		setTimeout("bounceHim('" + id + "')", parseInt(Math.random()*1750));
	}	
}


function fetchFeed(type, parameters, torisQuery) {
	$("#sendBttn").removeClass("error");
	$("#sendBttn").addClass("loading");
	$("#search").val(decodeURIComponent(torisQuery.replace(/\+/g,  " ")));
	// safari already encodes the url, for everything else we'll encode it
	if ($.safari == 'false') { torisQuery = encodeURIComponent(torisQuery);	}
	
	$.getJSON('http://'+type+'.json?' + parameters + 'q=' + torisQuery,  
		function(data) {  
     $.each(data, function(i, tweets) {
         if (tweets.length != undefined)
				 	if (tweets.length > 0) {
						if (tweets[0]) {
							if (tweets[0].created_at != undefined) {
								 if (tweets[0].text != undefined) {
									//CLEAR PREVIOUS QUEUE
									ToriQueue.length = 0;
									currentQueueIndex = 0;
									for (i = 0; i < tweets.length; i++) {
										if (tweets[i].text != '')
											ToriQueue[ToriQueue.length] = [tweets[i].text, tweets[i].id, tweets[i].from_user, tweets[i].created_at];
									};
									$("#sendBttn").removeClass("loading");
									$("#sendBttn").addClass("standby");
								 }
							}
						}
					} else {
						$("#sendBttn").removeClass("loading");
						$("#sendBttn").addClass("error");
					}
			 });
		}  
	);
}
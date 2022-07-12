function parseTweets(runkeeper_tweets) {
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});


	new_tweet_array=tweet_array.sort(function(a,b) {
		return new Date(b.time)-new Date(a.time);
	});

	
	var options= { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
	
	var firstDate= document.getElementById("firstDate");
	firstDate.innerHTML=new_tweet_array[tweet_array.length-1].time.toLocaleDateString(undefined,options);
	var lastDate=document.getElementById("lastDate");
	lastDate.innerHTML=new_tweet_array[0].time.toLocaleDateString(undefined,options);

	var completed=0;
	var liveEvents=0;
	var achievements=0;
	var miscellaneous=0;
	var writtenText=0;

	tweet_array.forEach(function(item) {
		if (item.source=="completed_event") {
			if (item.written){
				writtenText++;
			}
			completed++;
		}
        else if (item.source=="live_event") {
            liveEvents++;
        }

        else if (item.source=="achievement"){
            achievements++;
        }

        else {
        	miscellaneous++;
        }

	});

	var w=document.getElementsByClassName("written")[0];
	w.innerHTML= writtenText;

	var wpct=document.getElementsByClassName("writtenPct")[0];
	wpct.innerHTML=math.format(writtenText/completed*100,{notation:'fixed',precision:2})+"%";




	var c=document.getElementsByClassName("completedEvents");
	for (let i=0; i<c.length; i++){
		c[i].innerHTML=completed;
	};

	var cpct=document.getElementsByClassName("completedEventsPct")[0];
	cpct.innerHTML=math.format(completed/tweet_array.length*100,{notation:'fixed',precision:2})+"%";


	var l= document.getElementsByClassName("liveEvents");
	for (let i=0; i<l.length; i++){
		l[i].innerHTML=liveEvents;
	};
	var cpct=document.getElementsByClassName("liveEventsPct")[0];
	cpct.innerHTML=math.format(liveEvents/tweet_array.length*100,{notation:'fixed',precision:2})+"%";

	var a= document.getElementsByClassName("achievements");
	for (let i=0; i<a.length; i++){
		a[i].innerHTML=achievements;
	};

	var cpct=document.getElementsByClassName("achievementsPct")[0];
	cpct.innerHTML=math.format(achievements/tweet_array.length*100,{notation:'fixed',precision:2})+"%";

	var m= document.getElementsByClassName("miscellaneous");
	for (let i=0; i<m.length; i++){
		m[i].innerHTML=miscellaneous;
	};

	var cpct=document.getElementsByClassName("miscellaneousPct")[0];
	cpct.innerHTML=math.format(miscellaneous/tweet_array.length*100, {notation:'fixed',precision:2})+"%";

	document.getElementById('numberTweets').innerText = tweet_array.length;	
}

document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});
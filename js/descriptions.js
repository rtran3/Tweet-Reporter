
var filteredTweets=[];
function parseTweets(runkeeper_tweets) {
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweets = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});


	tweets.forEach(function(tweet) {
		if (tweet.written && tweet.activityType!="unknown") {
			filteredTweets.push(tweet);
		}
	});
}


function addEventHandlerForSearch() {
	document.getElementById("textFilter").addEventListener("keyup",function() {
		document.getElementById("tweetTable").innerHTML="";
		var input=document.getElementById("textFilter").value;
		if (input =="") {
			document.getElementById("searchCount").innerHTML=0;
			document.getElementById("tweetTable").innerHTML="";
		}
		else {
			var cnt=1;
			filteredTweets.forEach(function(item) {
				var table=document.getElementById("tweetTable");
				if(item.writtenText.toLowerCase().includes(input)) {
					var clickable=item.text.replace(/https:[\S]+/g, function(link) {return "<a href="+link+">"+link+"</a>";});
					var row=table.insertRow();
					var header=document.createElement("TH");
					header.innerHTML=cnt;
					row.appendChild(header);
					var cell1= document.createElement("TD");
					cell1.innerHTML=item.activityType;
					row.appendChild(cell1);
					var cell2=document.createElement("TD");
					cell2.innerHTML=clickable;
					row.appendChild(cell2);

					cnt++;
				}
				document.getElementById("searchCount").innerHTML=cnt-1;
			});
		}
		document.getElementById("searchText").innerHTML=input;

	});
}

document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});
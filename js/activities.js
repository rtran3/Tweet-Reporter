function parseTweets(runkeeper_tweets) {
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	var modifiedActivity=[]
	var activity=[];
	var dict={};
	tweet_array.forEach(function(item) {
		if (item.activityType!="activity" && item.activityType!="" && item.activityType!="unknown") {
			activity.push(item.activityType);
			modifiedActivity.push(item);
		}
	});

	activity.forEach(function(item) {
		if (item in dict) {
			dict[item]++;
		}
		else {
			dict[item]=1;
		}
	});

	

	var items = [];
	Object.keys(dict).forEach(function(key) {
	 	items.push([key, dict[key]]);
	});

	items.sort(function(firstItem, secondItem) {
	  return secondItem[1] - firstItem[1];
	});


	var firstMost=document.getElementById("firstMost");
	firstMost.innerHTML=items[0][0];

	var secondMost=document.getElementById("secondMost");
	secondMost.innerHTML=items[1][0];

	var thirdMost=document.getElementById("thirdMost");
	thirdMost.innerHTML=items[2][0];

	
	var max1=Number.NEGATIVE_INFINITY;
	var max2=Number.NEGATIVE_INFINITY;
	var max3=Number.NEGATIVE_INFINITY;
	var firstItem=items[0][0]
	var secondItem=items[1][0]
	var thirdItem=items[2][0]

	var activityDistance=[];
	tweet_array.forEach(function(item) {
		if (item.activityType==firstItem) {
			activityDistance.push(item);

			if (item.distance > max1) {
				max1=item.distance
			}
		}
		else if (item.activityType==secondItem) {
			activityDistance.push(item);
			if (item.distance > max2) {
				max2=item.distance
			}

		}

		else if (item.activityType==thirdItem) {
			activityDistance.push(item);
			if (item.distance > max3) {
				max3=item.distance
			}
		}
	});
	
	var distanceDict= {}
	distanceDict[firstItem]=max1;
	distanceDict[secondItem]=max2;
	distanceDict[thirdItem]=max3;


	var sortedDistanceDict=[];
	Object.keys(distanceDict).forEach(function(key) {
	 	sortedDistanceDict.push([key, distanceDict[key]]);
	});

	sortedDistanceDict.sort(function(firstItem, secondItem) {
	  return secondItem[1] - firstItem[1];
	});

	
	var longestActivityType=document.getElementById("longestActivityType");
	longestActivityType.innerHTML=sortedDistanceDict[0][0];
	

	var shortestActivityType=document.getElementById("shortestActivityType");
	shortestActivityType.innerHTML=sortedDistanceDict[2][0];

	

	var activitySet=new Set(activity)
	var numOfActivities=document.getElementById("numberActivities");
	numOfActivities.innerHTML= activitySet.size;




	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "height":400,
	  "width":200,
	  "data": {
	    "values": modifiedActivity
	  },
	  "mark": "bar",
	  "encoding": {
	  	"y": {
	  		"field": "activityType",
	  		"type": "nominal",
	  		"sort": {"field": "activityType", "op": "count", "order": "descending" },
	  		"axis": {"title": "activity type" },
	  	},
	  	"x": {
	  		"aggregate": "count",
	  		"type": "quantitative",
	  		"axis": {"title": "Number of tweets" },
	  	}
	  }
	  
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	distance_vis_spec = {
		  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		  "height":200,
		  "width":200,
		  "data": {
		    "values": activityDistance
		  },
		  "mark":"point",
		  "encoding": {
				"x": { 
					"field": "day", 
					"type": "nominal",
					"scale": {"domain":["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]},
					"axis": { "labelAngle": 0, "title": "time (day)" },
				},

				"y": { 
					"field":"distance",
					"type": "quantitative",
				},
				"color": { 
					"field": "activityType", 
					"type": "nominal",
					"legend": { "title": "Activity type" }
				}
			},
		};


	distance_vis_aggregated_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "height":200,
	  "width":200,
	  "data": {
	    "values": activityDistance
	  },
	  "mark":"point",
	  "encoding": {
	  	"x":{
	  		"field": "day",
	  		"type": "nominal",
	  		"scale": {"domain":["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]},
			"axis": { "labelAngle": 0, "title": "time (day)" }
	  	},
	  	"y":{
	  		"field":"distance",
	  		"aggregate":"average",
	  		"type":"quantitative",
	  		"axis": { "title": "Mean of distance" }

	  	},
	  	"color": {
	  		"field":"activityType",
	  		"type":"nominal",
	  		"legend": { "title": "Activity type" }
	  	}
	  }
	};

	var dist_vis=document.getElementById("distanceVis");
	dist_vis.style.display="block";
	vegaEmbed('#distanceVis', distance_vis_spec, {actions:false});


	var dist_vis_aggreg=document.getElementById("distanceVisAggregated");
	dist_vis_aggreg.style.display="none";
	vegaEmbed('#distanceVisAggregated', distance_vis_aggregated_spec, {actions:false});

	document.getElementById("aggregate").addEventListener('click', function(event) {

		if (dist_vis.style.display == "none") {
			document.getElementById("aggregate").innerHTML="Show means";
			dist_vis_aggreg.style.display="none";
			dist_vis.style.display="block";
		}
		else {
			document.getElementById("aggregate").innerHTML="Show all activities";
			dist_vis.style.display="none";
			dist_vis_aggreg.style.display="block";
		}
		
	});

	document.getElementById("weekdayOrWeekendLonger").innerHTML="weekends";

}

document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});
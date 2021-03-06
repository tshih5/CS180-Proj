var express = require('express');
var router = express.Router();
const fs = require('fs');
var data = require('../data/dataset.json')

router.post("/getratio", (req, res, next) => {
	var ratioData = req.body;
	console.log(ratioData);
	var numVal0 = 0;
	var numVal1 = 0;
	for(var i in data){
		if(data[i].state == ratioData.value0){
			numVal0++;
		}
		if(data[i].state == ratioData.value1){
			numVal1++;
		}
	}
	var ratio = 100 * (numVal0 / numVal1);
	ratio = Math.round((ratio + Number.EPSILON) * 100) / 100;
	res.send(ratio.toString());
});

router.post("/getsvf", (req, res, next) => {
	var svfData = req.body;
	//console.log(svfData);
	var successes = 0;
	var fails = 0;
	for(var i in data){
		if(data[i].main_category == svfData.category){
			if(data[i].state == 'successful' || data[i].state == 'live'){
				successes++;
				svfData.success.push(data[i]);
			}else{
				fails++;
				svfData.fail.push(data[i]);
			}
		}
	}
	var ratio;
	if(fails != 0){
		ratio = 100 * (successes / fails);
		svfData.ratio = Math.round((ratio + Number.EPSILON) * 100) / 100;
	}else{
		svfData.ratio = Infinity;
	}
	//console.log("ratio is: ", svfData.ratio);
	res.send(svfData);
});

router.post("/getmostPopular", (req, res, next) => {
	var popData = req.body;
	var categories = [];
	var amounts = [];
	for(var i in data){
		arridx = categories.indexOf(data[i].main_category); //index of category 
		if(arridx == -1){									//category has not been added yet
			categories.push(data[i].main_category);
			if(popData.value == 0){
				//get donation amount in $
				amounts.push(parseFloat(data[i].usd_pledged) || 0);
			}else{
				amounts.push(parseFloat(data[i].backers) || 0);
			}
		}else{
			if(popData.value == 0){
				amounts[arridx] += parseFloat(data[i].usd_pledged) || 0;
			}else{
				amounts[arridx] += parseFloat(data[i].backers) || 0;
			}
		}
	}
	var max = 0;
	var maxIdx = 0;
	var total = 0;
	//get total number of backers/ dollars pledged and the index in category array of the biggest category
	for(var i in amounts){
		total += amounts[i];
		if(amounts[i] > max){
			max = amounts[i];
			maxIdx = i;
		}
	}
	//push all projects in the largest category to the array
	for(var i in data){
		if(data[i].main_category == categories[maxIdx]){
			popData.projects.push(data[i]);
		}
	}
	popData.amount = max.toFixed(2);
	popData.total = total.toFixed(2);
	popData.max_category = categories[maxIdx];
	res.send(popData);
});

router.post("/getDonation", (req, res, next) => {
	var donationData = req.body;
	
	var money = 0.00;
	var count = 0;
	var backercount = 0;
	var backerdonates = 0;
	var arr2 = [];

	for(var i in data) {
		if(data[i].main_category == donationData.value) {
			money = money + parseInt(data[i].usd_pledged);
			count++;
		}
	}

	for(var j in data) {
		if(data[j].main_category == donationData.value) {
			backercount = backercount + parseInt(data[j].backers);
		}
	}
	
	var donations = (money / count);
	donations = donations.toFixed(2);
	arr2[0] = parseInt(donations);
	
	backerdonates = (donations / backercount);
	backerdonates = backerdonates.toFixed(2);
	arr2[1] = parseInt(backercount);
	arr2[2] = parseInt(backerdonates);

	console.log(arr2);
	donationData.donationss = arr2[0];
	donationData.backers = arr2[1];
	donationData.backerdonate = arr2[2];

	console.log(donationData);
	res.send(donationData);
});

router.post("/getTop", (req, res, next) => {
	var top = req.body

	var topc1 = "";
	var topc2 = "";
	var topc3 = "";
	var topc4 = "";
	var topc5 = "";

	var cFood = 0;
	var cDesign = 0;
	var cGames = 0;
	var cPublishing = 0;
	var cFashion = 0;
	var cTechnology = 0;
	var cCrafts = 0;
	var cArt = 0;

	for(var i in data){
		if(data[i].main_category == "Food") {
			cFood++;
		}
		if(data[i].main_category == "Design") {
			cDesign++;
		}
		if(data[i].main_category == "Games") {
			cGames++;
		}
		if(data[i].main_category == "Publishing") {
			cPublishing++;
		}
		if(data[i].main_category == "Fashion") {
			cFashion++;
		}
		if(data[i].main_category == "Technology") {
			cTechnology++;
		}
		if(data[i].main_category == "Crafts") {
			cCrafts++;
		}
		if(data[i].main_category == "Art") {
			cArt++;
		}
	}

	var arr = [];
	arr[0] = cFood;
	arr[1] = cDesign;
	arr[2] = cGames;
	arr[3] = cPublishing;
	arr[4] = cFashion;
	arr[5] = cTechnology;
	arr[6] = cCrafts;
	arr[7] = cArt;

	arr.sort(function(a, b){return b-a});

	if(arr[0] == cFood) {
		topc1 = "Food"
	}
	if(arr[1] == cFood) {
		topc2 = "Food"
	}
	if(arr[2] == cFood) {
		topc3 = "Food"
	}
	if(arr[3] == cFood) {
		topc4 = "Food"
	}
	if(arr[4] == cFood) {
		topc5 = "Food"
	}
	if(arr[0] == cDesign) {
		topc1 = "Design"
	}
	if(arr[1] == cDesign) {
		topc2 = "Design"
	}
	if(arr[2] == cDesign) {
		topc3 = "Design"
	}
	if(arr[3] == cDesign) {
		topc4 = "Design"
	}
	if(arr[4] == cDesign) {
		topc5 = "Design"
	}
	if(arr[0] == cGames) {
		topc1 = "Games"
	}
	if(arr[1] == cGames) {
		topc2 = "Games"
	}
	if(arr[2] == cGames) {
		topc3 = "Games"
	}
	if(arr[3] == cGames) {
		topc4 = "Games"
	}
	if(arr[4] == cGames) {
		topc5 = "Games"
	}
	if(arr[0] == cPublishing) {
		topc1 = "Publishing"
	}
	if(arr[1] == cPublishing) {
		topc2 = "Publishing"
	}
	if(arr[2] == cPublishing) {
		topc3 = "Publishing"
	}
	if(arr[3] == cPublishing) {
		topc4 = "Publishing"
	}
	if(arr[4] == cPublishing) {
		topc5 = "Publishing"
	}
	if(arr[0] == cFashion) {
		topc1 = "Fashion"
	}
	if(arr[1] == cFashion) {
		topc2 = "Fashion"
	}
	if(arr[2] == cFashion) {
		topc3 = "Fashion"
	}
	if(arr[3] == cFashion) {
		topc4 = "Fashion"
	}
	if(arr[4] == cFashion) {
		topc5 = "Fashion"
	}
	if(arr[0] == cTechnology) {
		topc1 = "Technology"
	}
	if(arr[1] == cTechnology) {
		topc2 = "Technology"
	}
	if(arr[2] == cTechnology) {
		topc3 = "Technology"
	}
	if(arr[3] == cTechnology) {
		topc4 = "Technology"
	}
	if(arr[4] == cTechnology) {
		topc5 = "Technology"
	}
	if(arr[0] == cCrafts) {
		topc1 = "Crafts"
	}
	if(arr[1] == cCrafts) {
		topc2 = "Crafts"
	}
	if(arr[2] == cCrafts) {
		topc3 = "Crafts"
	}
	if(arr[3] == cCrafts) {
		topc4 = "Crafts"
	}
	if(arr[4] == cCrafts) {
		topc5 = "Crafts"
	}
	if(arr[0] == cArt) {
		topc1 = "Art"
	}
	if(arr[1] == cArt) {
		topc2 = "Art"
	}
	if(arr[2] == cArt) {
		topc3 = "Art"
	}
	if(arr[3] == cArt) {
		topc4 = "Art"
	}
	if(arr[4] == cArt) {
		topc5 = "Art"
	}

	//console.log(arr);
	//console.log(topc1);
	//console.log(topc2);
	//console.log(topc3);
	//console.log(topc4);
	//console.log(topc5);

	top.top1 = topc1;
	top.top2 = topc2;
	top.top3 = topc3;
	top.top4 = topc4;
	top.top5 = topc5;

	top.count1 = arr[0];
	top.count2 = arr[1];
	top.count3 = arr[2];
	top.count4 = arr[3];
	top.count5 = arr[4];

	//console.log(top.count1);

	//console.log(top);
	res.send(top);









	/*var top = "";
	//var top2 = "";
	var countFood = 0;
	var countDesign = 0;
	var countGames = 0;
	var countPublishing = 0;
	var countFashion = 0;
	var countTechnology = 0;
	var countCrafts = 0;
	var countArt = 0;

	for(var i in data) {
		if(data[i].main_category == "Food") {
			countFood++;
		}
		if(data[i].main_category == "Design") {
			countDesign++;
		}
		if(data[i].main_category == "Games") {
			countGames++;
		}
		if(data[i].main_category == "Publishing") {
			countPublishing++;
		}
		if(data[i].main_category == "Fashion") {
			countFashion++;
		}
		if(data[i].main_category == "Technology") {
			countTechnology++;
		}
		if(data[i].main_category == "Crafts") {
			countCrafts++;
		}
		if(data[i].main_category == "Art") {
			countArt++;
		}
	}
	if((countFood > countDesign) && (countFood > countGames) && (countFood > countPublishing) && (countFood > countFashion) && (countFood > countTechnology) && (countFood > countCrafts) && (countFood > countArt)) {
		top = "Food"
	}
	if((countDesign > countFood) && (countDesign > countGames) && (countDesign > countPublishing) && (countDesign > countFashion) && (countDesign > countTechnology) && (countDesign > countCrafts) && (countDesign > countArt)) {
		top = "Design"
	}
	if((countGames > countFood) && (countGames > countDesign) && (countGames > countPublishing) && (countGames > countFashion) && (countGames > countTechnology) && (countGames > countCrafts) && (countGames > countArt)) {
		top = "Games"

		/*if((countFood > countDesign) && (countFood > countPublishing) && (countFood > countFashion) && (countFood > countTechnology) && (countFood > countCrafts) && (countFood > countArt)) {
			top2 = "Food"
		}
		if((countDesign > countFood) && (countDesign > countPublishing) && (countDesign > countFashion) && (countDesign > countTechnology) && (countDesign > countCrafts) && (countDesign > countArt)) {
			top2 = "Design"
		}
		if((countPublishing > countFood) && (countPublishing > countDesign) && (countPublishing > countFashion) && (countPublishing > countTechnology) && (countPublishing > countCrafts) && (countPublishing > countArt)) {
			top2 = "Publishing"
		}
		if((countFashion > countFood) && (countFashion > countPublishing) && (countFashion > countDesign) && (countFashion > countTechnology) && (countFashion > countCrafts) && (countFashion > countArt)) {
			top2 = "Fashion"
		}
		if((countTechnology > countFood) && (countTechnology > countPublishing) && (countTechnology > countFashion) && (countTechnology > countDesign) && (countTechnology > countCrafts) && (countTechnology > countArt)) {
			top2 = "Technology"
		}
		if((countCrafts > countFood) && (countCrafts > countPublishing) && (countCrafts > countFashion) && (countCrafts > countTechnology) && (countCrafts > countDesign) && (countCrafts > countArt)) {
			top2 = "Crafts"
		}
		if((countArt > countFood) && (countArt > countPublishing) && (countArt > countFashion) && (countArt > countTechnology) && (countArt > countCrafts) && (countArt > countDesign)) {
			top2 = "Art"
		}
			*/
	/*}
	if((countPublishing > countFood) && (countPublishing > countGames) && (countPublishing > countDesign) && (countPublishing > countFashion) && (countPublishing > countTechnology) && (countPublishing > countCrafts) && (countPublishing > countArt)) {
		top = "Publishing"
	}
	if((countFashion > countFood) && (countFashion > countGames) && (countFashion > countPublishing) && (countFashion > countDesign) && (countFashion > countTechnology) && (countFashion > countCrafts) && (countFashion > countArt)) {
		top = "Fashion"
	}
	if((countTechnology > countFood) && (countTechnology > countGames) && (countTechnology > countPublishing) && (countTechnology > countFashion) && (countTechnology > countDesign) && (countTechnology > countCrafts) && (countTechnology > countArt)) {
		top = "Technology"
	}
	if((countCrafts > countFood) && (countCrafts > countGames) && (countCrafts > countPublishing) && (countCrafts > countFashion) && (countCrafts > countTechnology) && (countCrafts > countDesign) && (countCrafts > countArt)) {
		top = "Crafts"
	}
	if((countArt > countFood) && (countArt > countGames) && (countArt > countPublishing) && (countArt > countFashion) && (countArt > countTechnology) && (countArt > countCrafts) && (countArt > countDesign)) {
		top = "Art"
	}

	console.log(top)//, top2);
	res.send(top)//, top2);
 */
});

router.post("/getCost", (req, res, next) => {
	var avgcostt = req.body;

	var goal = 0.00
	var count = 0;
	var largest = 0;

	for(var i in data) {
		if(data[i].main_category == avgcostt.value) {
			goal = goal + parseInt(data[i].goal)
			count++;
		}
	}
	//var totalAvg = (goal / count);
	//totalAvg = totalAvg.toFixed(2);

	var moneyy = 0.00;
	var countt = 0;

	for(var j in data) {
		if(data[j].main_category == avgcostt.value) {
			moneyy = moneyy + parseInt(data[j].usd_pledged);
			countt++;
		}
	}
	var donation = (moneyy / countt);
	donation = donation.toFixed(2);

	//var percentage = (donation / totalAvg);
	//percentage = percentage.toFixed(2);

	for(var k in data) {
		if(data[k].main_category == avgcostt.value) {
			if(largest < parseInt(data[k].goal)){
				largest = parseInt(data[k].goal)
			}
		}
	}

	avgcostt.avgcost = (goal / count).toFixed(2);//totalAvg;
	avgcostt.percentMet = (donation / (goal / count)).toFixed(2);//percentage;
	avgcostt.large = largest;
	res.send(avgcostt);
});

router.post("/byLocation", (req, res, next) => {	
		var locationData = req.body;
	console.log(locationData);
	
	var percent = 0;
	var count = 0; var count1 = 0; var count2 = 0; var count3 = 0; var count4 = 0; var count5 = 0;
	var count6 = 0; var count7 = 0; var count8 = 0; var count9 = 0; var count10 = 0; var count11 = 0;
	var count12 = 0;
	matches = [];
	//var count2 = 0;
	for(var i in data) {
		if(data[i].country == "US" && locationData.value == "US") {
			count++;
		}
		else if(data[i].country == "UK" && locationData.value == "UK") {
			count++;
		}
		else if(data[i].country == "AU" && locationData.value == "AU") {
			count++;
		}
		else if(data[i].country == "DE" && locationData.value == "DE") {
			count++;
		}
		else if(data[i].country == "ES" && locationData.value == "ES") {
			count++;
		}
		else if(data[i].country == "FR" && locationData.value == "FR") {
			count++;
		}
		else if(data[i].country == "IE" && locationData.value == "IE") {
			count++;
		}
		else if(data[i].country == "IT" && locationData.value == "IT") {
			count++;
		}
		else if(data[i].country == "MX" && locationData.value == "MX") {
			count++;
		}
		else if(data[i].country == "NL" && locationData.value == "NL") {
			count++;
		}
		else if(data[i].country == "NO" && locationData.value == "NO") {
			count++;
		}
		else if(data[i].country == "NZ" && locationData.value == "NZ") {
			count++;
		}
		else if(data[i].country == "SE" && locationData.value == "SE") {
			count++;

		}
		
	}
	
	var locations = [];
	
	//	for(var i in data){
	//	if(data[i].country == "US"&& locationData.value == "US"){
	//		locations.push(data[i].name);
	//		console.log(data[i].name);
	//	}
//	}
	var ratio;
	
	if(count !=0) {
	 ratio = 100 * (count / 355);
	}
	if(count1 !=0) {
	 ratio = 100 * (count1 / 355);
	}
	if(count2 !=0) {
	 ratio = 100 * (count2 / 355);
	}if(count3 !=0) {
	 ratio = 100 * (count3 / 355);
	}if(count4 !=0) {
	 ratio = 100 * (count4 / 355);
	}if(count5 !=0) {
	 ratio = 100 * (count5 / 355);
	}if(count6 !=0) {
	 ratio = 100 * (count6 / 355);
	}if(count7 !=0) {
	 ratio = 100 * (count7 / 355);
	}if(count8 !=0) {
	 ratio = 100 * (count8 / 355);
	}if(count9 !=0) {
	 ratio = 100 * (count9 / 355);
	}if(count10 !=0) {
	 ratio = 100 * (count10 / 355);
	}if(count11 !=0) {
	 ratio = 100 * (count11 / 355);
	}
	if(count12 !=0) {
	 ratio = 100 * (count12 / 355);
	}
	
	
	locationData.USProjects = locations;
	console.log("ratio: ", ratio);
	ratio = Math.round((ratio + Number.EPSILON) * 100) / 100;
	res.send(ratio.toString());
});

//router.post("/byLocationNames", (req, res, next) => {	
	//	var locationData = req.body;
	//console.log(locationData);
	
//		var locations = [];
	
//		for(var i in data){
//		if(data[i].country == "US"&& locationData.value == "US"){
//			locations.push(data[i].name);
//			console.log(data[i].name);
//		}
//	}
	
	
//	locationData.USProjects = locations;
//	res.send(locationData);
//});
router.post("/byYear", (req, res, next) => {	
		var locationData = req.body;
	console.log(locationData);
	
	var searchtext = "/10 ";
	var searchtext1 = "/11 ";
	var searchtext2 = "/12 ";
	var searchtext3 = "/13 ";
	var searchtext4 = "/14 ";
	var searchtext5 = "/15 ";
	var searchtext6 = "/16 ";
	var count = 0;
	var count1 = 0;
	var count2 = 0;
	var count3 = 0;
	var count4 = 0;
	var count5 = 0;
	var count6 = 0;
	
	var str = "";
	//var count2 = 0;
	for(var i in data) {
		if((data[i].launched.includes(searchtext) && locationData.value == 2010)) {
			count++;
		}
		else if ((data[i].launched.includes(searchtext1)&& locationData.value == 2011)) {
			count1++;
		}
		else if ((data[i].launched.includes(searchtext2)&& locationData.value == 2012)) {
			count2++;
		}
		else if ((data[i].launched.includes(searchtext3)&& locationData.value == 2013)) {
			count3++;
		}
		else if ((data[i].launched.includes(searchtext4)&& locationData.value == 2014)) {
			count4++;
		}
		else if ((data[i].launched.includes(searchtext5)&& locationData.value == 2015)) {
			count5++;
		}
		else if ((data[i].launched.includes(searchtext6)&& locationData.value == 2016)) {
			count6++;
		}
	}
	
	
	var year1;
	year1 = count;
	year2 = count1;
	year3 = count2;
	year4 = count3;
	year5 = count4;
	year6 = count5;
	year7 = count6;
	console.log("count of year: ", year1);
if (count !=0) {
	res.send(year1.toString());
}
if (count1 !=0) {
	res.send(year2.toString());
}
if (count2 !=0) {
	res.send(year3.toString());
}
if (count3 !=0) {
	res.send(year4.toString());
}
if (count4 !=0) {
	res.send(year5.toString());
}
if (count5 !=0) {
	res.send(year6.toString());
}
if (count6 !=0) {
	res.send(year7.toString());
}

});


//app.post("/update/", (req,res) => {
module.exports = router;	


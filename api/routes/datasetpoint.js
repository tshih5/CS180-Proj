var express = require('express');
var router = express.Router();
const fs = require('fs');
var data = require('../data/dataset.json')


router.get('/home', function (req, res) {
	res.send(data);
});

router.get("/search/:searchtext", (req, res) => {
	console.log(req.params)
	
    if (req.params["searchtext"] == "undefined") {
	res.send(data)}
	else {
		searchtext = req.params["searchtext"].toLowerCase();
		matches = [];
		for(i = 0; i < data.length; i++) {
			if (data[i].name.toLowerCase().includes(searchtext)) {
				matches.push(data[i])
			}
		
		}	
		console.log("returning these" + matches)
		res.send(JSON.stringify(matches));
	}
});

router.post("/save", (req, res, next) =>{
	var changedData = req.body;
	console.log("changed data is " + JSON.stringify(changedData));
	let id = [];
	for(var i in changedData){
		for(var j in data){
			if(changedData[i].ID === data[j].ID){
				id.push(JSON.stringify(data[j].ID));
				console.log("ID found: " + JSON.stringify(data[j].ID));
				data[j]= changedData[i];
			}
		}
	}
	fs.writeFile("../api/data/dataset.json", JSON.stringify(data, null, 4), err =>{
		if(err){
			console.log(err);
		}
	});
	res.send('Save request recieved; Changed Project ' + id.toString());
});

router.post("/add", (req, res, next) =>{
	var obj = 
		{
		"category": "",
	    "": "",
	    "name": "insert project name",
	    "main_category": "",
	    "country": "",
	    "pledged": "",
	    "usd_pledged": "",
	    "backers": "",
	    "currency": "",
	    "state": "",
	    "deadline": "",
	    "ID": "",
	    "launched": "",
	    "goal": ""
		};
	fs.readFile("../api/data/dataset.json", 'utf8', function (err, data) {
		var temp = JSON.parse(data)
			temp.push(obj)
				fs.writeFile("../api/data/dataset.json", JSON.stringify(temp, null, 4), function (err, temp)  {
			if(err){
					console.log(err);
				}
			});
			res.send(temp);

		});
});

router.post("/delete_element", () => {
	data.splice(data[0], 1);
	console.log("deleting first element of array")
	fs.writeFile("../api/data/dataset.json", JSON.stringify(data, null, 4), err =>{
		if(err){
			console.log(err);
		}
	});
});

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
	console.log(svfData);
	var successes = 0;
	var fails = 0;
	for(var i in data){
		if((data[i].state == 'successful' || data[i].state == 'live') && data[i].main_category == svfData.category){
			successes++;
		}else if((data[i].state == 'failed' || data[i].state == 'canceled') && data[i].main_category == svfData.category){
			fails++;
		}
	}
	var ratio;
	if(fails != 0){
		ratio = 100 * (successes / fails);
		ratio = Math.round((ratio + Number.EPSILON) * 100) / 100;
	}else{
		ratio = Infinity;
	}
	console.log("ratio is: ", ratio);
	res.send(ratio.toString());
});

router.post("/getmostPopular", (req, res, next) => {
	var popData = req.body;
	console.log(popData);
	var categories = [];
	var amounts = [];
	for(var i in data){
		arridx = categories.indexOf(data[i].main_category);
		if(arridx == -1){																	//category has not been added yet
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
	console.log(categories);
	var max = 0;
	var maxIdx = 0;
	var total = 0;
	for(var i in amounts){
		total += amounts[i];
		if(amounts[i] > max){
			max = amounts[i];
			maxIdx = i;
		}
	}
	popData.amount = max.toFixed(2);
	popData.total = total.toFixed(2);
	popData.max_category = categories[maxIdx];
	console.log(popData);
	res.send(popData);
});

router.post("/getDonation", (req, res, next) => {
	var donationData = req.body;
	console.log(donationData);
	
	var money = 0.00;
	var count = 0;

	for(var i in data) {
		if(data[i].main_category == donationData.value) {
			money = money + parseInt(data[i].usd_pledged);
			count++;
		}
	}
	var donation = (money / count);
	donation = donation.toFixed(2);
	console.log(donation);
	res.send(donation);
});

//app.post("/update/", (req,res) => {
module.exports = router;	


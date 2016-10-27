var botKit = require("botkit");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var cheerio = require("cheerio");
var http = require("http");
var request = require("request");

var secretconfig = require("./trianglecorp.config.secret.json");
var config = require("./trafficbot.config.json")
//console.log(config.accesstoken);//REMOVE
var controller = botKit.slackbot();

var bot = controller.spawn({
	token: secretconfig.accesstoken
});

bot.startRTM(function(err, bot, payload){
	if (err){
		throw new Error("Could not connect to slack");
	}
});


controller.hears(["!garagecount"],["ambient", "direct_message"],function(bot, message){

	getGarageCounts(function(err, results){
		
		var info;
		info = "The current number of available spaces for each UCF garage is:" 
		+ "\n*Garage A*:      " + results[0]
		+ "\n*Garage B*:      " + results[1]
		+ "\n*Garage C*:      " + results[2]
		+ "\n*Garage D*:      " + results[3]
		+ "\n*Garage H*:      " + results[4]
		+ "\n*Garage I*:        " + results[5]
		+ "\n*Garage Libra*: " + results[6];
		
		bot.reply(message, info);
	});
	
});


//Gets counts of available spaces for the garages listed. Returns an array of counts
function getGarageCounts(callback){

	var connectionString = "http://secure.parking.ucf.edu/GarageCount/iframe.aspx/";
	
	request(connectionString, function(error, response, body){
		
		$ = cheerio.load(body);
		var garageCounts = [];
		
		garageCounts[0] = $(config.garageAid).find("strong").html();	//Get garage counts by unique IDs, stored in config
		garageCounts[1] = $(config.garageBid).find("strong").html();
		garageCounts[2] = $(config.garageCid).find("strong").html();
		garageCounts[3] = $(config.garageDid).find("strong").html();
		garageCounts[4] = $(config.garageHid).find("strong").html();
		garageCounts[5] = $(config.garageIid).find("strong").html();
		garageCounts[6] = $(config.garageLibraid).find("strong").html();
		
		callback(null, garageCounts)
	});
	
	//$('.dxgvDataRow_DevEx').each();	//Select divs with counts by class
		
}
	
/* 	
	var getGarages;

	//COPIED AND TRANSLATED, NOT TESTED OR PROBABLY EVEN WORKING
	getGarages = function(callback) {
	  var r;
	  r = request('https://secure.parking.ucf.edu/GarageCount/iframe.aspx/', function(error, response, body) {
		var $, garages;
		garages = [];
		$ = cheerio.load(body);
		$('.dxgvDataRow_DevEx').each(function(i, obj) {
		  var html, j, len, line, percent, thisGarage;
		  thisGarage = {};
		  html = $(obj).html().replace(RegExp(' ', 'g'), '').split('\n');
		  for (j = 0, len = html.length; j < len; j++) {
			line = html[j];
			if (line.startsWith("percent:")) {
			  percent = parseInt(line.replace("percent:", ''));
			  thisGarage.perc = percent;
			}
		  }
		  thisGarage.garage = ($(obj).find('.dxgv').html()).replace("Garage ", '');
		  return garages[i] = thisGarage;
		});
		return callback(garages);
	  });
	  return null;
	}; */
	
	//COFFEESCRIPT, COPIED DIRECTLY
	//https://github.com/KnightHacks/hubot/blob/master/scripts/garage.coffee
	/* getGarages = (callback) ->
		r = request 'https://secure.parking.ucf.edu/GarageCount/iframe.aspx/', (error, response, body) ->	
			garages = []
			$ = cheerio.load(body);
			$('.dxgvDataRow_DevEx').each (i, obj) ->
				thisGarage = {};
				html = $(obj).html().replace(RegExp(' ', 'g'), '').split '\n'
				for line in html
					if line.startsWith("percent:")
						percent = parseInt(line.replace("percent:", ''))
						thisGarage.perc = percent
				thisGarage.garage = ($(obj).find('.dxgv').html()).replace("Garage ", '')
				garages[i] = thisGarage
			callback garages
		return null */


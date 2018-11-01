'use strict';
var AWS = require("aws-sdk");
var sns = new AWS.SNS();
var moment = require('moment');

AWS.config.update({ region: 'us-east-1' });
//AWS.config.update({ region: process.env.REGION });

const PEOPLE_TABLE_NAME = 'ctc-people';//process.env.PEOPLE_TABLE_NAME;
const LOG_TABLE_NAME = 'ctc-scanlog';//process.env.LOG_TABLE_NAME;

var dynamoDb = new AWS.DynamoDB.DocumentClient();

var params = {
	TableName: LOG_TABLE_NAME,
	/*KeyConditionExpression: "#mo = :mm",
	ExpressionAttributeNames: {
		"#mo": "timestamp",
	},
	ExpressionAttributeValues: {
		 ":start_mo": 10,
		 ":end_mo": 11
	}*/
};
var todayBegin = moment().startOf('day');
//todayBegin.setHours(0,0,0,0);

var todayEnd = moment().endOf('day');
//todayEnd.setHours(23,59,59,999);


console.log('Checking for scans between ' + todayBegin.format('MMMM Do YYYY, h:mm:ss a') + ' and ' + todayEnd.format('MMMM Do YYYY, h:mm:ss a'))
//console.log(moment().format('MMMM Do YYYY, h:mm:ss a'))

var count = 0;
dynamoDb.scan(params, function(err, data) {
	if (err) {
		console.log(err)
		//res.status(500).json({
		//	message: "Could not load scans"
		//}).end()
	} else {
		//console.log(data['Items'])
		//res.json(data['Items'])

		data.Items.forEach(function(item) {
			var d = moment(item.timestamp);
			if (d.isAfter(todayBegin) && d.isBefore(todayEnd)){
				count++;
				console.log(" -", item.sid + ": " + item.timestamp);
			}
		});
		console.log(count + ' scans for ' + todayBegin.format('MMMM Do YYYY'))

	}
})
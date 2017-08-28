'use strict';

const googleTrends = require('google-trends-api');
const setArgs = (params) => {
  let args = {};

  args.keyword = params.content ? params.content : 'ibm';
  args.startTime = parseDate(params.startYear, params.startMonth, params.startDay, "start");
  args.endTime = parseDate(params.endYear, params.endMonth, params.endDay, "end");

  return args;
};

const parseDate = (year, month, day, type) => {
  let date;
  if (year && month && day) {
    date = new Date(year +"-"+ month +"-"+ day);
    if (date.toString !== 'Invalid Date') {
      return date;
    }
  }
  if (type === "start") {
    date = new Date();
    date.setMonth(date.getMonth() -1);
    return date;
  }
  else {
    return new Date();
  }
};

module.exports = function(Gtrends) {
  Gtrends.find = function(msg, cb) {
    let args = {};
    if (msg) {
      args = setArgs(msg);
    }
    else {
      args.keyword = 'ibm';
      args.startTime = parseDate(msg, msg, msg, "start");
      args.endTime = parseDate(msg, msg, msg, "end");
    }

    googleTrends.relatedTopics(args)
    .then(function(result){
      var respData = [];
      var data = JSON.parse(result).default.rankedList[1].rankedKeyword;
      for (var i = 0; i < data.length; i++) {
        respData.push({"description" : data[i].topic.title + " - " + data[i].topic.type, "title" : data[i].topic.type, "location" : "item", "link" : data[i].link, "date" : "2012-11-03T07:00:00"});
        respData.push({"description" : data[i].formattedValue, "title" : data[i].topic.type, "location" : "raising", "link" : data[i].link, "date" : "2012-11-03T07:00:00"});
      }
      cb(null, respData);
    })
    .catch(function(err){
      cb(null, err);
    });
  };
};

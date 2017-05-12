'use strict';

const googleTrends = require('google-trends-api');

module.exports = function(Gtrends) {
  Gtrends.find = function(msg, cb) {
    var args = {};
    var startDate;
    var endDate;
    if (msg) {
      args.keyword = msg.content ? msg.content : 'ibm';
      if (msg.startYear && msg.startMonth && msg.startDay) {
        startDate = new Date(msg.startYear +"-"+ msg.startMonth +"-"+ msg.startDay);
      }
      if (msg.endYear && msg.endMonth && msg.endDay) {
        endDate = new Date(msg.endYear +"-"+ msg.endMonth +"-"+ msg.endDay);
      }

      if (startDate && startDate.toString() !== "Invalid Date") {
        args.startTime = startDate;
      }
      if (endDate && endDate.toString() !== "Invalid Date") {
        args.endTime = endDate;
      }
    }
    else {
      args.keyword = "ibm";
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

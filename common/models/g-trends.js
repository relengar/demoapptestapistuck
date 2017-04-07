'use strict';


var request = require("request");
const googleTrends = require('google-trends-api');
var loopback = require("loopback");

module.exports = function(Gtrends) {
  Gtrends.find = function(msg, cb) {
    // msg = loopback.getCurrentContext();
    msg = msg ? msg.content : 'ibm';
    // googleTrends.interestOverTime({keyword: msg})
    // .then(function(result){
    //   cb(null, result);
    // })
    // .catch(function(err){
    //   cb(null, err);
    // });
    // cb(null, "the message is " + msg);
    googleTrends.relatedTopics({keyword: msg})
    .then(function(result){
      var respData = [];
      var data = JSON.parse(result).default.rankedList[0].rankedKeyword;
      for (var i = 0; i < data.length; i++) {
        respData.push({"description" : data[i].topic.type, "title" : data[i].topic.title, "location" : "None", "link" : data[i].link, "date" : "2012-11-03T07:00:00"});
      }
      cb(null, respData);
    })
    .catch(function(err){
      cb(null, err);
    });
  };

  Gtrends.findOne = function(param, cb) {
    cb(null, "findOne" + param);
  };

  Gtrends.remoteMethod('find', {
    http: {path: '/Gtrends', verb: 'get'},
    accepts: {arg: 'msg', type: 'string'},
    returns: {arg: 'greeting', type: 'string'}
  });

  // Gtrends.setup = function() {
  //   Gtrends.base.setup.apply(this, arguments);
  //
  //   this.remoteMethod('nearby', {
  //     description: 'Find nearby locations around the geo point',
  //     accepts: [{arg: 'msg', type: 'string'}],
  //     returns: {arg: 'greeting', type: 'string'},
  //     http: { verb: 'GET' }
  //   });
  // };
  //
  // Gtrends.setup();
};

'use strict';
//
// module.exports = function(Gtrends) {
//
// };


var request = require("request");
const googleTrends = require('google-trends-api');

module.exports = function(Gtrends) {
  Gtrends.find = function(msg, cb) {
    process.nextTick(function() {
      msg = msg ? msg : 'ibm';
      // googleTrends.interestOverTime({keyword: msg})
      // .then(function(result){
      //   cb(null, result);
      // })
      // .catch(function(err){
      //   cb(null, err);
      // });
      // cb(null, 'Sender says ' + msg + ' to YOU!!!');

      googleTrends.relatedTopics({keyword: msg})
      .then(function(result){
        var respData = [];
        var data = JSON.parse(result).default.rankedList[0].rankedKeyword;
        for (var i = 0; i < data.length; i++) {
          respData.push({"description" : data[i].topic.type, "title" : data[i].topic.title});
        }
        cb(null, respData);
      })
      .catch(function(err){
        cb(null, err);
      });
    });
  };
};

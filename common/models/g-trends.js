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

module.exports = (Gtrends) => {
  Gtrends.find = (msg, cb)  =>{
    let args = {};
    if (msg) {
      args = setArgs(msg);
    }
    else {
      args.keyword = 'ibm';
    }

    googleTrends.relatedTopics(args)
    .then((result) =>{
      let respData = [];
      let data = JSON.parse(result).default.rankedList[1].rankedKeyword;
      for (let i = 0; i < data.length; i++) {
        respData.push({"description" : data[i].topic.title + " - " + data[i].topic.type, "title" : data[i].topic.type, "location" : "item", "link" : data[i].link, "date" : "2012-11-03T07:00:00"});
        respData.push({"description" : data[i].formattedValue, "title" : data[i].topic.type, "location" : "raising", "link" : data[i].link, "date" : "2012-11-03T07:00:00"});
      }
      cb(null, respData);
    })
    .catch((err) =>{
      cb(null, err);
    });
  };

  Gtrends.getDataforChart = (keyword, startYear, startMonth, startDay, endYear, endMonth, endDay, cb) => {
    let req = {
      'keyword': keyword,
      'startYear': startYear,
      'startMonth' : startMonth,
      'startDay' : startDay,
      'endYear' : endYear,
      'endMonth' : endMonth,
      'endDay' : endDay
    };
    let args = setArgs(req);


    googleTrends.interestOverTime(args)
    .then((result) => {
      let resp = JSON.parse(result).default.timelineData;
      let respData = [];
      for (let i = 0; i < resp.length; i++) {
        respData.push({"value": resp[i].value[0], "time": resp[i].time, "timeLabel" : resp[i].formattedTime});
      }
      cb(null, respData);
    })
    .catch((err) => {
      cb(null, err);
    })
  };

  Gtrends.remoteMethod(
    'getDataforChart', {
      http: {
        path: '/chart',
        verb: 'get'
      },
      accepts: [
        {
          arg: 'keyword',
          type: 'string'
        },
        {
          arg: 'startYear',
          type: 'string'
        },
        {
          arg: 'startMonth',
          type: 'string'
        },
        {
          arg: 'startDay',
          type: 'string'
        },
        {
          arg: 'endYear',
          type: 'string'
        },
        {
          arg: 'endMonth',
          type: 'string'
        },
        {
          arg: 'endDay',
          type: 'string'
        }
      ],
      returns: {
        arg: 'data',
        type: 'string'
      }
    }
  );
};

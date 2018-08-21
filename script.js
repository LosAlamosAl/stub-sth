var hourlyData = rawData.map(arr => {
  var narr = [];
  var speed = parseInt(arr["s"].split(" ")[0]);
  if (isNaN(speed))
    speed = null;
  narr.push(Date.parse(arr["d"]), speed);
  return narr;
});


var sdData = [];      // date in short format YYYY-MM-DD
for (let i in hourlyData) {
  let ld = new Date(hourlyData[i][0]);
  let sd = new Date(ld.getFullYear(), ld.getMonth(), ld.getDate());
  sdData.push([sd, hourlyData[i][1]]);
}


var dailyData = [];
var lo = 0;
var hi = 0;
for (var i=0; i<sdData.length; i++) {
  let speeds = [];
  let tDate = sdData[i][0].getDate();        // day of month (1-31)
  while (i<sdData.length && sdData[i][0].getDate() == tDate) {
    if (sdData[i][1] !== null)      // null indicated missing data
      speeds.push(sdData[i][1]);
    i++;
  }
  i--;       //  back up to avoid double increment of i (while and for)
  if (speeds.length != 0) {
    lo = Math.min(...speeds);
    hi = Math.max(...speeds);
  } else {                        // entire day is missing data
    lo = null;
    hi = null;
  }
  dailyData.push([Date.parse(sdData[i][0]), lo, hi]);
}


var hourlyDiffData = [];
for (var i in hourlyData) {
  let ld = new Date(hourlyData[i][0]);
  let sd = Date.UTC(ld.getFullYear(), ld.getMonth(), ld.getDate());
  hourlyDiffData.push([sd, ld.getHours(), hourlyData[i][1]-75]);
}


Highcharts.stockChart('hourly', {

  rangeSelector: {
    selected: 1
  },

  plotOptions: {
    line: {
      connectNulls: false
    }
  },
  
  title: {
    text: 'Hourly fast.com Download Speed'
  },

  navigator: {
    yAxis: {
      min: 0
    }
  },

  xAxis: {
    plotBands: [{                            // Pi disk full
      from: Date.UTC(2018, 05, 23, 13, 0),
      to: Date.UTC(2018, 05, 24, 21, 0),
      color: '#F2F5FC',
    },{                                      // national outage
      from: Date.UTC(2018, 05, 29, 16, 0),
      to: Date.UTC(2018, 05, 29, 19, 0),
      color: '#FCF2F2'
    }, {
      from: Date.UTC(2018, 07, 05, 21, 0),   // test new Pi 3B+
      to: Date.UTC(2018, 07, 06, 06, 0),
      color: '#F2F5FC'
    }, {
      from: Date.UTC(2018, 7, 8, 2, 0),   // install new Pi 3B+
      to: Date.UTC(2018, 7, 8, 6, 0),
      color: '#F2F5FC'
    }]
  },

  yAxis: {
    min: 0,
    plotLines: [{
      value: 75,
      color: 'green',
      dashStyle: 'shortdash',
      width: 2
    }]
  },
  series: [{
    name: 'Mbps',
    data: hourlyData,
    id: 'dlspeed',
    linewidth: 1,
    tooltip: {
      valueDecimals: 2
    }
  }, {
    type: 'flags',
    data: [{
      x: Date.UTC(2018, 05, 23, 13, 0),     // Pi disk full
      title: '1',
      text: '<em>Maintenance</em>: <br>Raspberry PI disk full'
    }, {
      x: Date.UTC(2018, 05, 29, 16, 0),     // national outage
      title: '2',
      text: '<em>National Comcast outage</em>: <br>cut fiber cable'
    }, {
      x: Date.UTC(2018, 06, 16, 12, 0),     // new cable modem
      title: '3',
      text: '<em>Upgrade</em>: <br>installed new cable modem'
    }, {
      x: Date.UTC(2018, 07, 05, 21, 0),     // testing new Pi 3B+
      title: '4',
      text: '<em>Maintenance</em>: <br>Testing new Pi 3B+'
    }, {
      x: Date.UTC(2018, 07, 08, 02, 0),     // install new Pi 3B+
      title: '5',
      text: '<em>Upgrade</em>: <br>Install new Pi 3B+, GigE switch'
    }],
    shape: 'squarepin',
    width: 16
  }]
});


Highcharts.stockChart('daily', {

  rangeSelector: {
    selected: 1
  },

  chart: {
      type: 'columnrange'
  },

  title: {
    text: 'Daily fast.com Download Speed'
  },

  navigator: {
    yAxis: {
      min: 0
    }
  },
  
  yAxis: {
    min: 0,
    plotLines: [{
      value: 75,
      color: 'green',
      dashStyle: 'shortdash',
      width: 2
    }]
  },
  
  xAxis: {
    type: 'datetime'
  },
  
  tooltip: {
    valueSuffix: 'Mbps',
    valueDecimals: 0
  },

  series: [{
    name: 'Mbps',
    data: dailyData
  }]
});


Highcharts.chart('speedmap', {

  chart: {
    type: 'heatmap',
    margin: [60, 10, 80, 50]
  },

  boost: {
    useGPUTranslations: true
  },

  title: {
    text: '2018 Internet Speed Heat Map',
    align: 'left',
    x: 40
  },

  subtitle: {
    text: 'Speed variation from 75Mbps (+/- 75 Mbps)',
    align: 'left',
    x: 40
  },

  xAxis: {
    type: 'datetime',
    min: Date.UTC(2018, 0, 1),
    max: Date.UTC(2018, 11, 31, 23, 59, 59),
    labels: {
      align: 'left',
      x: 5,
      y: 14,
      format: '{value:%B}' // long month
    },
    showLastLabel: false,
    tickLength: 16
  },

  yAxis: {
    title: {
      text: null
    },
    labels: {
      format: '{value}:00'
    },
    minPadding: 0,
    maxPadding: 0,
    startOnTick: false,
    endOnTick: false,
    tickPositions: [0, 6, 12, 18, 24],
    tickWidth: 1,
    min: 0,
    max: 23,
    reversed: true
  },

  colorAxis: {
    stops: [
      [0, '#de425b'],
      [0.5, '#f1f1f1'],
      [1, '#488f31']
    ],
    min: -75,
    max: 75,
    startOnTick: false,
    endOnTick: false,
    labels: {
      format: '{value} Mbps'
    }
  },

  series: [{
    data: hourlyDiffData,
    boostThreshold: 100,
    borderWidth: 0,
    nullColor: '#00FF00',
    colsize: 24 * 36e5, // one day
    tooltip: {
      headerFormat: 'Speed variance from 75Mbps:<br/>',
      pointFormat: '{point.x:%e %b, %Y} {point.y}:00: <b>{point.value} Mbps</b>'
    },
    turboThreshold: Number.MAX_VALUE // #3404, remove after 4.0.5 release
  }]

});


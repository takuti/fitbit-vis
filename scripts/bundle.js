(function (React$1, ReactDOM, d3, ReactDropdown) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var React__default = /*#__PURE__*/_interopDefaultLegacy(React$1);
  var ReactDOM__default = /*#__PURE__*/_interopDefaultLegacy(ReactDOM);
  var ReactDropdown__default = /*#__PURE__*/_interopDefaultLegacy(ReactDropdown);

  var url = 'https://gist.githubusercontent.com/takuti/f7adf1c14de7c6ec8f1502173efb38d7/raw/53367f6725a48f8ccfa63cddd71a5f9c9c0a5a3b/activities.csv';

  var row = function (d) {
    d.dateTime = new Date(d.Date);
    d.steps = +d['Steps'].replace(',', '');
    d.calories = +d['Activity Calories'].replace(',', '');
    d.distance = +d['Distance'];
    d.floors = +d['Floors'];
    d.fairlyActive = +d['Minutes Fairly Active'];
    d.lightlyActive = +d['Minutes Lightly Active'];
    d.Sedentary = +d['Minutes Sedentary'].replace(',', '');
    d.veryActive = +d['Minutes Very Active'];
    return d;
  };

  var useActivities = function () {
    var ref = React$1.useState(null);
    var data = ref[0];
    var setData = ref[1];

    React$1.useEffect(function () {
      d3.csv(url, row).then(setData); 
    }, []);

    return data;
  };

  var url$1 = 'https://gist.githubusercontent.com/takuti/f7adf1c14de7c6ec8f1502173efb38d7/raw/53367f6725a48f8ccfa63cddd71a5f9c9c0a5a3b/sleep.csv';

  var row$1 = function (d) {
    d.key = d['Start Time'].substring(0, 10);  // YYYY-MM-DD
    d.date = new Date(d.key);
    d.asleep = +d['Minutes Asleep'];
    d.awake = +d['Minutes Awake'];
    d.awakenings = +d['Number of Awakenings'];
    d.duration = +d['Time in Bed'];
    d.rem = +d['Minutes REM Sleep'];
    d.light = +d['Minutes Light Sleep'];
    d.deep = +d['Minutes Deep Sleep'];
    return d;
  };

  var useSleep = function () {
    var ref = React$1.useState(null);
    var data = ref[0];
    var setData = ref[1];

    React$1.useEffect(function () {
      d3.csv(url$1, row$1).then(function (data) {
        var aggMap = new Map();
        data.forEach(function (d) {
          if (aggMap.has(d.key)) {
            var e = aggMap.get(d.key);
            e.asleep += d.asleep;
            e.awake += d.awake;
            e.awakenings += d.awakenings;
            e.duration += d.duration;
            e.rem += d.rem;
            e.light += d.light;
            e.deep += d.light;
          } else {
            aggMap.set(d.key, {
              key: d.key,
              date: d.date, 
              asleep: d.asleep, 
              awake: d.awake, 
              awakenings: d.awakenings, 
              duration: d.duration,
              rem: d.rem,
              light: d.light,
              deep: d.deep
            });
          }
        });
        return setData(Array.from(aggMap.values()));
      }); 
    }, []);

    return data;
  };

  var AxisBottom = function (ref) {
      var xScale = ref.xScale;
      var innerHeight = ref.innerHeight;
      var tickFormat = ref.tickFormat;
      var tickOffset = ref.tickOffset;
      var barWidth = ref.barWidth;

      return xScale.ticks().map(function (tickValue) { return (
      React.createElement( 'g', {
        className: "tick", transform: ("translate(" + (xScale(tickValue)) + ",0)") },
        React.createElement( 'line', { 
          x1: barWidth / 2, x2: barWidth / 2, y2: innerHeight }),
        React.createElement( 'text', { 
          style: { textAnchor: 'end' }, y: innerHeight + tickOffset, transform: ("translate(\n          -" + innerHeight + ",\n          " + (innerHeight + tickOffset) + "\n        ) rotate(-90)") },
          tickFormat(tickValue)
        )
      )
    ); }
  );
  };

  var AxisLeft = function (ref) {
      var yScale = ref.yScale;
      var innerWidth = ref.innerWidth;
      var tickOffset = ref.tickOffset;

      return yScale.ticks().map(function (tickValue) { return (
      React.createElement( 'g', { className: "tick", transform: ("translate(0," + (yScale(tickValue)) + ")") },
        React.createElement( 'line', { x2: innerWidth }),
        React.createElement( 'text', {
          key: tickValue, style: { textAnchor: 'end' }, x: -tickOffset },
          tickValue
        )
      )
    ); });
  };

  var Marks = function (ref) {
      var data = ref.data;
      var xScale = ref.xScale;
      var yScale = ref.yScale;
      var xValue = ref.xValue;
      var yValue = ref.yValue;
      var innerHeight = ref.innerHeight;
      var barWidth = ref.barWidth;

      return data.map(function (d) { return (
      React.createElement( 'rect', {
        className: "mark", x: xScale(xValue(d)), y: yScale(yValue(d)), width: barWidth, height: innerHeight - yScale(yValue(d)) },
        React.createElement( 'title', null, yValue(d) )
      )
    ); });
  };

  var barWidth = 2;
  var xAxisLabelOffset = 100;

  var BarChart = function (ref) {
    var data = ref.data;
    var width = ref.width;
    var height = ref.height;
    var margin = ref.margin;
    var yValue = ref.yValue;

    var xValue = function (d) { return d.date; };
    var xAxisLabel = 'Date';
    var xAxisTickFormat = d3.timeFormat('%m/%d/%Y');

    var innerHeight = height - margin.top - margin.bottom;
    var innerWidth = width - margin.right - margin.left;

    var xScale = d3.scaleTime()
      .domain(d3.extent(data, xValue))
      .range([0, innerWidth])
      .nice();

    var yScale = d3.scaleLinear()
      .domain([0, d3.max(data, yValue)])
      .range([innerHeight, 0])
      .nice();

    return (
      React__default['default'].createElement( React__default['default'].Fragment, null,
        React__default['default'].createElement( 'svg', { width: width, height: height },
          React__default['default'].createElement( 'g', {
            transform: ("translate(" + (margin.left) + "," + (margin.top) + ")") },
            React__default['default'].createElement( AxisBottom, {
              xScale: xScale, innerHeight: innerHeight, tickFormat: xAxisTickFormat, tickOffset: 5, barWidth: barWidth }),
            React__default['default'].createElement( 'text', {
              className: "axis-label", x: innerWidth / 2, y: innerHeight + xAxisLabelOffset, textAnchor: "middle" },
              xAxisLabel
            ),
            React__default['default'].createElement( AxisLeft, {
              yScale: yScale, innerWidth: innerWidth, tickOffset: 5 }),
            React__default['default'].createElement( Marks, {
              data: data, xScale: xScale, yScale: yScale, xValue: xValue, yValue: yValue, innerHeight: innerHeight, barWidth: barWidth })
          )
        )
      )
    );
  };

  var AxisBottom$1 = function (ref) {
      var xScale = ref.xScale;
      var innerHeight = ref.innerHeight;
      var tickOffset = ref.tickOffset; if ( tickOffset === void 0 ) tickOffset = 3;

      return xScale.ticks().map(function (tickValue) { return (
      React.createElement( 'g', {
        className: "tick", key: tickValue, transform: ("translate(" + (xScale(tickValue)) + ",0)") },
        React.createElement( 'line', { y2: innerHeight }),
        React.createElement( 'text', {
          style: { textAnchor: 'middle' }, dy: ".71em", y: innerHeight + tickOffset },
          tickValue
        )
      )
    ); });
  };

  var AxisLeft$1 = function (ref) {
      var yScale = ref.yScale;
      var innerWidth = ref.innerWidth;
      var tickOffset = ref.tickOffset; if ( tickOffset === void 0 ) tickOffset = 3;

      return yScale.ticks().map(function (tickValue) { return (
      React.createElement( 'g', {
        className: "tick", transform: ("translate(0," + (yScale(tickValue)) + ")") },
        React.createElement( 'line', { x2: innerWidth }),
        React.createElement( 'text', {
          key: tickValue, style: { textAnchor: 'end' }, x: -tickOffset, dy: ".32em" },
          tickValue
        )
      )
    ); });
  };

  var Marks$1 = function (ref) {
      var data = ref.data;
      var xScale = ref.xScale;
      var yScale = ref.yScale;
      var xValue = ref.xValue;
      var yValue = ref.yValue;
      var circleRadius = ref.circleRadius;
      var opacity = ref.opacity;

      return data.map(function (d) {
      if (isNaN(xValue(d))) { return; }
      return React.createElement( 'circle', {
        className: "mark", cx: xScale(xValue(d)), cy: yScale(yValue(d)), r: circleRadius, opacity: opacity });
    });
  };

  var xAxisOffset = 150;
  var yAxisOffset = 320;

  var tickOffset = 16;

  var attributes = {
    x: [
      { value: 'asleep', label: 'Minutes Asleep' },
      { value: 'awake', label: 'Minutes Awake' },
      { value: 'awakenings', label: 'Number of Awakenings' },
      { value: 'duration', label: 'Time in Bed' },
      { value: 'rem', label: 'Minutes REM Sleep' },
      { value: 'light', label: 'Minutes Light Sleep' },
      { value: 'deep', label: 'Minutes Deep Sleep' }
    ],
    y: [
      { value: 'steps', label: 'Steps' },
      { value: 'calories', label: 'Activity Calories' },
      { value: 'distance', label: 'Distance' },
      { value: 'floors', label: 'Floors' },
      { value: 'fairlyActive', label: 'Minutes Fairly Active' },
      { value: 'lightlyActive', label: 'Minutes Lightly Active' },
      { value: 'Sedentary', label: 'Minutes Sedentary' },
      { value: 'veryActive', label: 'Minutes Very Active' }
    ]
  };

  var ScatterPlot = function (ref) {
    var data = ref.data;
    var width = ref.width;
    var height = ref.height;
    var margin = ref.margin;
    var yValue = ref.yValue;
    var yAttribute = ref.yAttribute;
    var setYAttribute = ref.setYAttribute;

    var initialXAttribute = 'asleep';
    var ref$1 = React$1.useState(
      initialXAttribute
    );
    var xAttribute = ref$1[0];
    var setXAttribute = ref$1[1];
    var xValue = function (d) { return d[xAttribute]; };

    var circleRadius = 4;

    var innerHeight = height - margin.top - margin.bottom;
    var innerWidth = width - margin.right - margin.left;

    var xScale = d3.scaleLinear()
      .domain(d3.extent(data, xValue))
      .range([0, innerWidth])
      .nice();

    var yScale = d3.scaleLinear()
      .domain(d3.extent(data, yValue))
      .range([innerHeight, 0])
      .nice();

    return (
      React__default['default'].createElement( React__default['default'].Fragment, null,
        React__default['default'].createElement( 'div', { 
          className: "dropdown-container", style: { 
            position: 'absolute',
            left: -innerWidth / 2 + yAxisOffset,
            top: innerHeight / 1.3,
            transform: 'rotate(-90deg)'
          } },
          React__default['default'].createElement( ReactDropdown__default['default'], {
            options: attributes['y'], value: yAttribute, onChange: function (ref) {
              var value = ref.value;

              return setYAttribute(value);
    } })
        ),
        React__default['default'].createElement( 'svg', { width: width, height: height },
          React__default['default'].createElement( 'g', {
            transform: ("translate(" + (margin.left) + "," + (margin.top) + ")") },
            React__default['default'].createElement( AxisBottom$1, {
              xScale: xScale, innerHeight: innerHeight, tickOffset: tickOffset }),
            React__default['default'].createElement( AxisLeft$1, {
              yScale: yScale, innerWidth: innerWidth, tickOffset: tickOffset }),
            React__default['default'].createElement( Marks$1, {
              data: data, xScale: xScale, yScale: yScale, xValue: xValue, yValue: yValue, circleRadius: circleRadius, opacity: 0.5 })
          )
        ),
        React__default['default'].createElement( 'div', { 
          className: "dropdown-container", style: { 
            position: 'absolute', 
            left: innerWidth / 2, 
            top: innerHeight + xAxisOffset 
          } },
          React__default['default'].createElement( ReactDropdown__default['default'], {
            options: attributes['x'], value: xAttribute, onChange: function (ref) {
              var value = ref.value;

              return setXAttribute(value);
    } })
        )
      )
    );
  };

  var width = 960;
  var height = 400;
  var margin = {
    top: 20,
    right: 20,
    bottom: 120,
    left: 150,
  };

  var App = function () {
    var activities = useActivities();
    var sleep = useSleep();

    var initialYAttribute = 'steps';
    var ref = React$1.useState(
      initialYAttribute
    );
    var yAttribute = ref[0];
    var setYAttribute = ref[1];
    var yValue = function (d) { return d[yAttribute]; };


    if (!activities || !sleep) {
      return React__default['default'].createElement( 'pre', null, "Loading..." );
    }

    var activitiesMap = new Map();
    for (var i = 0; i < activities.length; i++) {
      activitiesMap.set(activities[i].Date, activities[i]);
    }

    var sleepMap = new Map();
    for (var i$1 = 0; i$1 < sleep.length; i$1++) {
      sleepMap.set(sleep[i$1].key, sleep[i$1]);
    }

    var data = new Map();
    Array.from(activitiesMap.keys())
      .filter(function (k) { return sleepMap.has(k); })
      .forEach(function (k) {
        data.set(k, activitiesMap.get(k));
        data.set(k, Object.assign(data.get(k), sleepMap.get(k)));
      });

    return (
      React__default['default'].createElement( React__default['default'].Fragment, null,
        React__default['default'].createElement( 'h1', { className: "chart-title" }, "Fitbit Activity/Sleep Correlation Explorer"),
        React__default['default'].createElement( ScatterPlot, { 
          data: Array.from(data.values()), width: width, height: height, margin: margin, yValue: yValue, yAttribute: yAttribute, setYAttribute: setYAttribute }),
        React__default['default'].createElement( BarChart, { 
          data: Array.from(data.values()), width: width, height: height / 1.5, margin: margin, yValue: yValue })
      )
    );
  };

  var rootElement = document.getElementById('root');
  ReactDOM__default['default'].render(React__default['default'].createElement( App, null ), rootElement);

}(React, ReactDOM, d3, ReactDropdown));

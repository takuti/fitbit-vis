(function (React$1, ReactDOM, d3, ReactDropdown) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var React__default = /*#__PURE__*/_interopDefaultLegacy(React$1);
  var ReactDOM__default = /*#__PURE__*/_interopDefaultLegacy(ReactDOM);
  var ReactDropdown__default = /*#__PURE__*/_interopDefaultLegacy(ReactDropdown);

  var url = 'https://gist.githubusercontent.com/takuti/f7adf1c14de7c6ec8f1502173efb38d7/raw/9b272c7251e0320e9f77d8fd9f9ec14b79198c7f/activities.csv';

  var row = function (d) {
    d.dateTime = new Date(d.Date);
    d.steps = +d['Steps'].replace(',', '');
    d.calories = +d['Calories Burned'].replace(',', '');
    d.distance = +d['Distance'];
    d.floors = +d['Floors'];
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

  var url$1 = 'https://gist.githubusercontent.com/takuti/f7adf1c14de7c6ec8f1502173efb38d7/raw/9b272c7251e0320e9f77d8fd9f9ec14b79198c7f/sleep.csv';

  var row$1 = function (d) {
    d.key = d['Start Time'].substring(0, 10);  // YYYY-MM-DD
    d.date = new Date(d.key);
    d.asleep = +d['Minutes Asleep'];
    d.awake = +d['Minutes Awake'];
    d.awakenings = +d['Number of Awakenings'];
    d.duration = +d['Time in Bed'];
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
          } else {
            aggMap.set(d.key, {
              key: d.key,
              date: d.date, 
              asleep: d.asleep, 
              awake: d.awake, 
              awakenings: d.awakenings, 
              duration: d.duration
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

      return xScale.domain().map(function (tickValue) {
      var tickBaseX = xScale(tickValue) + xScale.bandwidth() / 2;
      var tickBaseY = innerHeight + tickOffset;
      return (
        React.createElement( 'g', {
          className: "tick", transform: ("translate(" + (xScale(tickValue)) + ",0)") },
          React.createElement( 'line', { 
            x1: barWidth / 2, x2: barWidth / 2, y2: innerHeight }),
          React.createElement( 'text', { 
            style: { textAnchor: 'end' }, x: tickBaseX, y: tickBaseY, transform: ("translate(\n            -" + innerHeight + ",\n            " + (tickBaseX + tickBaseY) + "\n          ) rotate(-90)") },
            tickFormat(tickValue)
          )
        )
      );
    });
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

  var margin = {
    top: 50,
    right: 30,
    bottom: 150,
    left: 100,
  };

  var barWidth = 8;

  var xValue = function (d) { return d.date; };
  var xAxisLabel = 'Date';
  var xAxisTickFormat = d3.timeFormat('%m/%d/%Y');
  var xAxisLabelOffset = 100;

  var yValue = function (d) { return d.steps; };
  var yAxisLabel = 'Steps';
  var yAxisLabelOffset = 60;

  var BarChart = function (ref) {
    var data = ref.data;
    var width = ref.width;
    var height = ref.height;

    var innerHeight = height - margin.top - margin.bottom;
    var innerWidth = width - margin.right - margin.left;

    var xScale = d3.scaleBand()
      .domain(data.map(xValue))
      .range([0, innerWidth])
      .paddingInner(0.15);

    var yScale = d3.scaleLinear()
      .domain([0, d3.max(data, yValue)])
      .range([innerHeight, 0]);

    return (
      React.createElement( 'svg', { width: width, height: height },
        React.createElement( 'g', {
          transform: ("translate(" + (margin.left) + "," + (margin.top) + ")") },
          React.createElement( 'text', {
            className: "chart-title", x: innerWidth / 2, y: -20, textAnchor: "middle" }, "Fitbit Daily Steps"),
          React.createElement( AxisBottom, {
            xScale: xScale, innerHeight: innerHeight, tickFormat: xAxisTickFormat, tickOffset: 5, barWidth: barWidth }),
          React.createElement( 'text', {
            className: "axis-label", x: innerWidth / 2, y: innerHeight + xAxisLabelOffset, textAnchor: "middle" },
            xAxisLabel
          ),
          React.createElement( AxisLeft, {
            yScale: yScale, innerWidth: innerWidth, tickOffset: 5 }),
          React.createElement( 'text', {
            className: "axis-label", textAnchor: "middle", transform: ("translate(" + (-yAxisLabelOffset) + "," + (innerHeight / 2) + ") rotate(-90)") },
            yAxisLabel
          ),
          React.createElement( Marks, {
            data: data, xScale: xScale, yScale: yScale, xValue: xValue, yValue: yValue, innerHeight: innerHeight, barWidth: barWidth })
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

      return data.map(function (d) { return (
      React.createElement( 'circle', {
        className: "mark", cx: xScale(xValue(d)), cy: yScale(yValue(d)), r: circleRadius })
    ); });
  };

  var margin$1 = {
    top: 20,
    right: 20,
    bottom: 80,
    left: 150,
  };
  var xAxisOffset = 60;
  var yAxisOffset = 100;

  var tickOffset = 16;

  var attributes = {
    x: [
      { value: 'asleep', label: 'Minutes Asleep' },
      { value: 'awake', label: 'Minutes Awake' },
      { value: 'awakenings', label: 'Number of Awakenings' },
      { value: 'duration', label: 'Time in Bed' }
    ],
    y: [
      { value: 'steps', label: 'Steps' },
      { value: 'calories', label: 'Calories Burned' },
      { value: 'distance', label: 'Distance' },
      { value: 'floors', label: 'Floors' }
    ]
  };

  var xDropdownLabel = 'Sleep Metric';
  var yDropdownLabel = 'Activitiy Metric';
  var getLabel = function (axis, attribute) {
    for (var i = 0; i < attributes[axis].length; i++) {
      if (attributes[axis][i].value === attribute) {
        return attributes[axis][i].label;
      }
    }
  };

  var ScatterPlot = function (ref) {
    var data = ref.data;
    var width = ref.width;
    var height = ref.height;

    var initialXAttribute = 'asleep';
    var ref$1 = React$1.useState(
      initialXAttribute
    );
    var xAttribute = ref$1[0];
    var setXAttribute = ref$1[1];
    var xValue = function (d) { return d[xAttribute]; };
    var xAxisLabel = getLabel('x', xAttribute);

    var initialYAttribute = 'steps';
    var ref$2 = React$1.useState(
      initialYAttribute
    );
    var yAttribute = ref$2[0];
    var setYAttribute = ref$2[1];
    var yValue = function (d) { return d[yAttribute]; };
    var yAxisLabel = getLabel('y', yAttribute);

    var circleRadius = 7;

    var innerHeight = height - margin$1.top - margin$1.bottom;
    var innerWidth = width - margin$1.right - margin$1.left;

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
        React__default['default'].createElement( 'div', { className: "menus-container" },
          React__default['default'].createElement( 'span', { className: "dropdown-label" }, "X (", xDropdownLabel, ") "),
          React__default['default'].createElement( ReactDropdown__default['default'], {
            options: attributes['x'], value: xAttribute, onChange: function (ref) {
              var value = ref.value;

              return setXAttribute(value);
    } }),
          React__default['default'].createElement( 'span', { className: "dropdown-label" }, "Y (", yDropdownLabel, ")"),
          React__default['default'].createElement( ReactDropdown__default['default'], {
            options: attributes['y'], value: yAttribute, onChange: function (ref) {
              var value = ref.value;

              return setYAttribute(value);
    } })
        ),
        React__default['default'].createElement( 'svg', { width: width, height: height },
          React__default['default'].createElement( 'g', {
            transform: ("translate(" + (margin$1.left) + "," + (margin$1.top) + ")") },
            React__default['default'].createElement( AxisBottom$1, {
              xScale: xScale, innerHeight: innerHeight, tickOffset: tickOffset }),
            React__default['default'].createElement( 'text', {
              className: "axis-label", x: innerWidth / 2, y: innerHeight + xAxisOffset, textAnchor: "middle" },
              xAxisLabel
            ),
            React__default['default'].createElement( AxisLeft$1, {
              yScale: yScale, innerWidth: innerWidth, tickOffset: tickOffset }),
            React__default['default'].createElement( 'text', {
              className: "axis-label", textAnchor: "middle", transform: ("translate(" + (-yAxisOffset) + "," + (innerHeight / 2) + ") rotate(-90)") },
              yAxisLabel
            ),
            React__default['default'].createElement( Marks$1, {
              data: data, xScale: xScale, yScale: yScale, xValue: xValue, yValue: yValue, circleRadius: circleRadius })
          )
        )
      )
    );
  };

  var width = 960;
  var height = 500;

  var App = function () {
    var activities = useActivities();
    var sleep = useSleep();

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
        React__default['default'].createElement( BarChart, { 
          data: Array.from(data.values()), width: width, height: height }),
        React__default['default'].createElement( ScatterPlot, { 
          data: Array.from(data.values()), width: width, height: height - 80 })
      )
    );
  };

  var rootElement = document.getElementById('root');
  ReactDOM__default['default'].render(React__default['default'].createElement( App, null ), rootElement);

}(React, ReactDOM, d3, ReactDropdown));

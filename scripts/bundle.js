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
    d.key = d['End Time'].substring(0, 10);  // YYYY-MM-DD
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

  var AxisLeft = function (ref) {
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

  var Marks = function (ref) {
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

  var margin = {
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
            transform: ("translate(" + (margin.left) + "," + (margin.top) + ")") },
            React__default['default'].createElement( AxisBottom, {
              xScale: xScale, innerHeight: innerHeight, tickOffset: tickOffset }),
            React__default['default'].createElement( 'text', {
              className: "axis-label", x: innerWidth / 2, y: innerHeight + xAxisOffset, textAnchor: "middle" },
              xAxisLabel
            ),
            React__default['default'].createElement( AxisLeft, {
              yScale: yScale, innerWidth: innerWidth, tickOffset: tickOffset }),
            React__default['default'].createElement( 'text', {
              className: "axis-label", textAnchor: "middle", transform: ("translate(" + (-yAxisOffset) + "," + (innerHeight / 2) + ") rotate(-90)") },
              yAxisLabel
            ),
            React__default['default'].createElement( Marks, {
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

    var data = new Map();
    for (var i = 0; i < activities.length; i++) {
      var e = data.get(activities[i].Date);
      if (e) {
        data.set(activities[i].Date, Object.assign(e, activities[i]));
      } else {
        data.set(activities[i].Date, activities[i]);
      }

      e = data.get(sleep[i].key);
      if (e) {
        data.set(sleep[i].key, Object.assign(e, sleep[i]));
      } else {
        data.set(sleep[i].key, sleep[i]);
      }
    }
    return (
      React__default['default'].createElement( ScatterPlot, { 
        data: Array.from(data.values()), width: width, height: height - 80 })
    );
  };

  var rootElement = document.getElementById('root');
  ReactDOM__default['default'].render(React__default['default'].createElement( App, null ), rootElement);

}(React, ReactDOM, d3, ReactDropdown));

(function (React$1, ReactDOM, d3) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var React__default = /*#__PURE__*/_interopDefaultLegacy(React$1);
  var ReactDOM__default = /*#__PURE__*/_interopDefaultLegacy(ReactDOM);

  var url = 'https://gist.githubusercontent.com/takuti/f7adf1c14de7c6ec8f1502173efb38d7/raw/9b272c7251e0320e9f77d8fd9f9ec14b79198c7f/activities.csv';

  var row = function (d) {
    d.dateTime = new Date(d.Date);
    d.value = +d.Steps.replace(',', '');
    return d;
  };

  var useActivities = function (endpoint) {
    var ref = React$1.useState(null);
    var data = ref[0];
    var setData = ref[1];

    React$1.useEffect(function () {
      d3.csv(url, row).then(setData); 
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

  var xValue = function (d) { return d.dateTime; };
  var xAxisLabel = 'Date';
  var xAxisTickFormat = d3.timeFormat('%m/%d/%Y');
  var xAxisLabelOffset = 100;

  var yValue = function (d) { return d.value; };
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
    );
  };

  var width = 960;
  var height = 500;

  var App = function () {
    var activities = useActivities();

    if (!activities) {
      return React__default['default'].createElement( 'pre', null, "Loading..." );
    }

    return (
      React__default['default'].createElement( 'svg', { width: width, height: height },
       React__default['default'].createElement( BarChart, { 
        data: activities, width: width, height: height })
      )
    );
  };

  var rootElement = document.getElementById('root');
  ReactDOM__default['default'].render(React__default['default'].createElement( App, null ), rootElement);

}(React, ReactDOM, d3));

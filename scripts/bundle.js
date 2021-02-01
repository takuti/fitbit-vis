(function (React$1, ReactDOM, d3, ReactDropdown) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var React__default = /*#__PURE__*/_interopDefaultLegacy(React$1);
  var ReactDOM__default = /*#__PURE__*/_interopDefaultLegacy(ReactDOM);
  var ReactDropdown__default = /*#__PURE__*/_interopDefaultLegacy(ReactDropdown);

  var AxisBottom = function (ref) {
      var xScale = ref.xScale;
      var innerHeight = ref.innerHeight;
      var tickFormat = ref.tickFormat;
      var tickOffset = ref.tickOffset;

      return xScale.ticks().map(function (tickValue) { return (
      React.createElement( 'g', {
        className: "tick", transform: ("translate(" + (xScale(tickValue)) + ",0)") },
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
      var innerHeight = ref.innerHeight;
      var colorThresholdDate = ref.colorThresholdDate;

      return data.map(function (d) { return (
      React.createElement( 'rect', {
        className: d.x0 <= colorThresholdDate ? "mark-green" : "mark-red", x: xScale(d.x0), y: yScale(d.y), width: xScale(d.x1) - xScale(d.x0), height: innerHeight - yScale(d.y) },
        React.createElement( 'title', null, d.y )
      )
    ); });
  };

  var xAxisLabel = 'Date';
  var xAxisTickFormat = d3.timeFormat('%m/%d/%Y');
  var xAxisLabelOffset = 100;

  var yAxisLabel = 'Weekly Total';
  var yAxisLabelOffset = 100;

  var BarChart = function (ref) {
    var data = ref.data;
    var width = ref.width;
    var height = ref.height;
    var margin = ref.margin;
    var xValue = ref.xValue;
    var yValue = ref.yValue;
    var setBrushExtent = ref.setBrushExtent;
    var colorThresholdDate = ref.colorThresholdDate;

    var innerHeight = height - margin.top - margin.bottom;
    var innerWidth = width - margin.right - margin.left;

    var xScale = React$1.useMemo(
      function () { return d3.scaleTime()
          .domain(d3.extent(data, xValue))
          .range([0, innerWidth])
          .nice(); },
      [data, xValue, innerWidth]
    );

    var binnedData = React$1.useMemo(function () {
      var ref = xScale.domain();
      var start = ref[0];
      var stop = ref[1];
      return d3.histogram()
        .value(xValue)
        .domain(xScale.domain())
        .thresholds(d3.timeWeeks(start, stop))(data)
        .map(function (array) { return ({
          y: d3.sum(array, yValue),
          x0: array.x0,
          x1: array.x1,
        }); });
    }, [xValue, xScale, data, yValue]);

    var yScale = React$1.useMemo(
      function () { return d3.scaleLinear()
        .domain([0, d3.max(binnedData, function (d) { return d.y; })])
        .range([innerHeight, 0])
        .nice(); },
      [binnedData, innerHeight]
    );

    var brushRef = React$1.useRef();
    React$1.useEffect(function () {
      var brush = d3.brushX().extent([
        [0, 0],
        [innerWidth, innerHeight] ]);
      brush(d3.select(brushRef.current));
      brush.on('brush end', function () {
        setBrushExtent(
          d3.event.selection &&
            d3.event.selection.map(xScale.invert)
        );
      });
    });

    return (
      React__default['default'].createElement( React__default['default'].Fragment, null,
        React__default['default'].createElement( 'svg', { width: width, height: height },
          React__default['default'].createElement( 'g', {
            transform: ("translate(" + (margin.left) + "," + (margin.top) + ")") },
            React__default['default'].createElement( AxisBottom, {
              xScale: xScale, innerHeight: innerHeight, tickFormat: xAxisTickFormat, tickOffset: 5 }),
            React__default['default'].createElement( 'text', {
              className: "axis-label", x: innerWidth / 2, y: innerHeight + xAxisLabelOffset, textAnchor: "middle" },
              xAxisLabel
            ),
            React__default['default'].createElement( AxisLeft, {
              yScale: yScale, innerWidth: innerWidth, tickOffset: 5 }),
            React__default['default'].createElement( 'text', {
              className: "axis-label", textAnchor: "middle", transform: ("translate(" + (-yAxisLabelOffset) + "," + (innerHeight / 2) + ") rotate(-90)") },
              yAxisLabel
            ),
            React__default['default'].createElement( Marks, {
              data: binnedData, xScale: xScale, yScale: yScale, innerHeight: innerHeight, colorThresholdDate: colorThresholdDate }),
            React__default['default'].createElement( 'g', { ref: brushRef })
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
      var colorThresholdDate = ref.colorThresholdDate;

      return data.map(function (d) {
      if (isNaN(xValue(d))) { return; }
      return React.createElement( 'circle', {
        className: d.date <= colorThresholdDate ? "mark-green" : "mark-red", cx: xScale(xValue(d)), cy: yScale(yValue(d)), r: circleRadius, opacity: opacity });
    });
  };

  var ColorLegend = function (ref) {
      var colorScale = ref.colorScale;
      var tickSpacing = ref.tickSpacing; if ( tickSpacing === void 0 ) tickSpacing = 30;
      var tickSize = ref.tickSize; if ( tickSize === void 0 ) tickSize = 10;
      var tickTextOffset = ref.tickTextOffset; if ( tickTextOffset === void 0 ) tickTextOffset = 20;
      var onHover = ref.onHover;
      var hoveredValue = ref.hoveredValue;
      var fadeOpacity = ref.fadeOpacity;

      return colorScale.domain().map(function (domainValue, i) { return (
      React.createElement( 'g', {
        className: "tick", transform: ("translate(0," + (i * tickSpacing) + ")"), onMouseEnter: function () { return onHover(domainValue); }, onMouseOut: function () { return onHover(null); }, opacity: hoveredValue && domainValue !== hoveredValue
            ? fadeOpacity
            : 1.0 },
        React.createElement( 'circle', { fill: colorScale(domainValue), r: tickSize }),
        React.createElement( 'text', { x: tickTextOffset, dy: ".32em" },
          domainValue
        )
      )
    ); });
  };

  var xAxisOffset = 150;
  var yAxisOffset = 320;

  var tickOffset = 16;
  var fadeOpacity = 0.2;

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
      { value: 'sedentary', label: 'Minutes Sedentary' },
      { value: 'veryActive', label: 'Minutes Very Active' }
    ]
  };

  var circleRadius = 4;

  var ScatterPlot = function (ref) {
    var data = ref.data;
    var filteredData = ref.filteredData;
    var width = ref.width;
    var height = ref.height;
    var margin = ref.margin;
    var yValue = ref.yValue;
    var yAttribute = ref.yAttribute;
    var setYAttribute = ref.setYAttribute;
    var colorThresholdDate = ref.colorThresholdDate;

    var initialXAttribute = 'asleep';
    var ref$1 = React$1.useState(
      initialXAttribute
    );
    var xAttribute = ref$1[0];
    var setXAttribute = ref$1[1];
    var xValue = function (d) { return d[xAttribute]; };

    var innerHeight = height - margin.top - margin.bottom;
    var innerWidth = width - margin.right - margin.left;

    var xScale = React$1.useMemo(
      function () { return d3.scaleLinear()
        .domain(d3.extent(data, xValue))
        .range([0, innerWidth])
        .nice(); },
      [data, xValue, innerWidth]
    );

    var yScale = React$1.useMemo(
      function () { return d3.scaleLinear()
        .domain(d3.extent(data, yValue))
        .range([innerHeight, 0])
        .nice(); },
      [data, yValue, innerHeight]
    );

    var ref$2 = React$1.useState(null);
    var hoveredValue = ref$2[0];
    var setHoveredValue = ref$2[1];
    var colorValue = function (d) { return (d.date <= colorThresholdDate) ? 'Pre-COVID' : 'Post-COVID'; };
    var colorLegendLabel = 'Timing';
    var colorScale = d3.scaleOrdinal()
      .domain(data.map(colorValue))
      .range(['rgba(196, 91, 161, 0.973)', '#137B80']);
    var filteredDataByColor = filteredData.filter(
      function (d) { return colorValue(d) === hoveredValue; }
    );

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
          React__default['default'].createElement( 'g', { transform: ("translate(" + (innerWidth + 50) + ",60)") },
            React__default['default'].createElement( 'text', {
              x: 50, y: -30, className: "axis-label", textAnchor: "middle" },
              colorLegendLabel
            ),
            React__default['default'].createElement( ColorLegend, {
              colorScale: colorScale, tickSpacing: 30, tickSize: circleRadius, tickTextOffset: 20, onHover: setHoveredValue, hoveredValue: hoveredValue, fadeOpacity: fadeOpacity })
          ),
          React__default['default'].createElement( 'g', {
            transform: ("translate(" + (margin.left) + "," + (margin.top) + ")") },
            React__default['default'].createElement( AxisBottom$1, {
              xScale: xScale, innerHeight: innerHeight, tickOffset: tickOffset }),
            React__default['default'].createElement( AxisLeft$1, {
              yScale: yScale, innerWidth: innerWidth, tickOffset: tickOffset }),
            React__default['default'].createElement( 'g', { opacity: hoveredValue ? fadeOpacity : 1.0 },
              React__default['default'].createElement( Marks$1, {
                data: filteredData, xScale: xScale, yScale: yScale, xValue: xValue, yValue: yValue, circleRadius: circleRadius, opacity: 0.5, colorThresholdDate: colorThresholdDate })
            ),
            React__default['default'].createElement( Marks$1, {
              data: filteredDataByColor, xScale: xScale, yScale: yScale, xValue: xValue, yValue: yValue, circleRadius: circleRadius, opacity: 0.5, colorThresholdDate: colorThresholdDate })
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

  var activitiesUrl = 'https://gist.githubusercontent.com/takuti/f7adf1c14de7c6ec8f1502173efb38d7/raw/53367f6725a48f8ccfa63cddd71a5f9c9c0a5a3b/activities.csv';
  var parseActivitiesRow = function (d) { return ({
    key: d.Date, // YYYY-MM-DD
    date: new Date(d.Date),
    steps: +d['Steps'].replace(',', ''),
    calories: +d['Activity Calories'].replace(',', ''),
    distance: +d['Distance'],
    floors: +d['Floors'],
    fairlyActive: +d['Minutes Fairly Active'],
    lightlyActive: +d['Minutes Lightly Active'],
    sedentary: +d['Minutes Sedentary'].replace(',', ''),
    veryActive: +d['Minutes Very Active'],
  }); };

  var sleepUrl = 'https://gist.githubusercontent.com/takuti/f7adf1c14de7c6ec8f1502173efb38d7/raw/53367f6725a48f8ccfa63cddd71a5f9c9c0a5a3b/sleep.csv';
  var parseSleepRow = function (d) {
    var dateStr = d['Start Time'].substring(0, 10); // YYYY-MM-DD
    return {
      key: dateStr,
      date: new Date(dateStr),
      asleep: +d['Minutes Asleep'],
      awake: +d['Minutes Awake'],
      awakenings: +d['Number of Awakenings'],
      duration: +d['Time in Bed'],
      rem: +d['Minutes REM Sleep'],
      light: +d['Minutes Light Sleep'],
      deep: +d['Minutes Deep Sleep'],
    };
  };

  // https://stackoverflow.com/questions/17500312/is-there-some-way-i-can-join-the-contents-of-two-javascript-arrays-much-like-i/17500836#17500836
  var innerJoin = function (t1, t2, key1, key2, selectFunc) {
    var lookup = t1.reduce(function (lookup, row1) { return lookup.set(row1[key1], row1); }, new Map);
    return t2
      .filter(function (row2) { return lookup.get(row2[key2]); })
      .map(function (row2) { return selectFunc(lookup.get(row2[key2]), row2); });
  };

  // aggregate array of hash over a certain key
  var aggregate = function (t, key, aggFunc) {
    var aggMap = t.reduce(
      function (aggMap, row) { return aggMap.set(
          row[key], 
          aggMap.has(row[key]) 
            ? aggFunc(row, aggMap.get(row[key])) 
            : row
        ); },
      new Map
    );
    return Array.from(aggMap.values());
  };

  var useData = function () {
    var ref = React$1.useState();
    var data = ref[0];
    var setData = ref[1];

    React$1.useEffect(function () {
      Promise.all([
        d3.csv(activitiesUrl, parseActivitiesRow),
        d3.csv(sleepUrl, parseSleepRow)
      ]).then(function (ref) {
        var activities = ref[0];
        var sleep = ref[1];

        var sleeps = aggregate(sleep, 'key', function (row, ref) { return ({
          key: row.key,
          date: row.date, 
          asleep: row.asleep + ref.asleep, 
          awake: row.awake + ref.awake, 
          awakenings: row.awakenings + ref.awakenings, 
          duration: row.duration + ref.duration,
          rem: row.rem + ref.rem,
          light: row.light + ref.light,
          deep: row.deep + ref.deep
        }); });
        
        var data = innerJoin(activities, sleeps, 'key', 'key', function (
            ref, 
            ref$1
          ) {
            var date = ref.date;
            var steps = ref.steps;
            var calories = ref.calories;
            var distance = ref.distance;
            var floors = ref.floors;
            var fairlyActive = ref.fairlyActive;
            var lightlyActive = ref.lightlyActive;
            var sedentary = ref.sedentary;
            var veryActive = ref.veryActive;
            var asleep = ref$1.asleep;
            var awake = ref$1.awake;
            var awakenings = ref$1.awakenings;
            var duration = ref$1.duration;
            var rem = ref$1.rem;
            var light = ref$1.light;
            var deep = ref$1.deep;

            return ({
            date: date, steps: steps, calories: calories, distance: distance, floors: floors, fairlyActive: fairlyActive, lightlyActive: lightlyActive, sedentary: sedentary, veryActive: veryActive,
            asleep: asleep, awake: awake, awakenings: awakenings, duration: duration, rem: rem, light: light, deep: deep
          });
        });

        setData(data);
      });
    }, []);

    return data;
  };

  var width = 960;
  var height = 400;
  var margin = {
    top: 20,
    right: 20,
    bottom: 120,
    left: 150,
  };
  var xValue = function (d) { return d.date; };
  var colorThresholdDate = new Date('2020-03-31');

  var App = function () {
    var data = useData();
    var ref = React$1.useState();
    var brushExtent = ref[0];
    var setBrushExtent = ref[1];

    var initialYAttribute = 'steps';
    var ref$1 = React$1.useState(
      initialYAttribute
    );
    var yAttribute = ref$1[0];
    var setYAttribute = ref$1[1];
    var yValue = function (d) { return d[yAttribute]; };

    if (!data) {
      return React__default['default'].createElement( 'pre', null, "Loading..." );
    }

    var filteredData = brushExtent
      ? data.filter(function (d) {
          var date = xValue(d);
          return (
            brushExtent[0] < date && date < brushExtent[1]
          );
        })
      : data;

    return (
      React__default['default'].createElement( React__default['default'].Fragment, null,
        React__default['default'].createElement( 'h1', { className: "chart-title" }, "Fitbit Activity/Sleep Explorer"),
        React__default['default'].createElement( ScatterPlot, { 
          data: data, filteredData: filteredData, width: width, height: height, margin: margin, yValue: yValue, yAttribute: yAttribute, setYAttribute: setYAttribute, colorThresholdDate: colorThresholdDate }),
        React__default['default'].createElement( BarChart, { 
          data: data, width: width, height: height / 1.5, margin: margin, xValue: xValue, yValue: yValue, setBrushExtent: setBrushExtent, colorThresholdDate: colorThresholdDate })
      )
    );
  };

  var rootElement = document.getElementById('root');
  ReactDOM__default['default'].render(React__default['default'].createElement( App, null ), rootElement);

}(React, ReactDOM, d3, ReactDropdown));

/****
 * barchart.js
 *
 * Xander Locsin, 10722432
 *
 * Implements a bar chart using d3 to create svg elements in barchart.html
 *
 * Code is heavily based on this tutorial: https://bost.ocks.org/mike/bar/3/
 * For the tooltips:
 * http://bl.ocks.org/Caged/6476579
 * For the calendar view:
 * https://www.crowdanalytix.com/communityBlog/10-steps-to-create-calendar-view-heatmap-in-d3-js
 * https://github.com/mohans-ca/d3js-heatmap/blob/master/calendermap.js
 ****/

// Parse the date / time
var parseDate = d3.time.format("%Y-%m-%d").parse;

// Get weeknumber of the year with week starting on Sunday from a js date
var week = d3.time.format("%U");

// Get weekday as a decimal number from a js date
var day = d3.time.format("%w");


// ----------------- CALENDAR INITIALISATION -----------------------------------

// Sets the margins for the calendar view.
var calendarMargin = {top: 20, right: 30, bottom: 30, left: 30},
  calendarWidth = 450 - calendarMargin.left - calendarMargin.right,
  calendarHeight = 500 - calendarMargin.top - calendarMargin.bottom;


// Selects the chart in the html and gives it width and height including margins
var calendarView = d3.select(".calendarView")
  .attr("width", calendarWidth + calendarMargin.left + calendarMargin.right)
  .attr("height", calendarHeight + calendarMargin.top + calendarMargin.bottom)
  .append("g")
    .attr("transform", "translate(" + calendarMargin.left + "," + calendarMargin.top + ")");

var cellSize = 50;

// Colour range
var colour = d3.scale.linear().range(["white", '#002b53'])
    .domain([0, 1])

var month = ['Sep','Oct','Nov'];

// Adds a legend to show the month names.
var calendarLegend = calendarView.selectAll(".legend")
      .data(month)
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate( 0," + (100 + i * 150) + ")"; });

calendarLegend.append("text")
   .attr("class", function(d,i){ return month[i] })
   .style("text-anchor", "end")
   .attr("dy", "-.25em")
   .text(function(d,i){ return month[i] });

// ----------------- BAR CHART INITIALISATION ----------------------------------

// Sets the margins for the bar chart and sets the width and height
var barMargin = {top: 20, right: 30, bottom: 30, left: 20},
  barWidth = 450 - barMargin.left - barMargin.right,
  barHeight = 500 - barMargin.top - barMargin.bottom;

// Ordinal scale for the x-axis to display station names
var x = d3.scale.ordinal()
  .rangeRoundBands([0, barWidth], .1);

// Linear scale to properly set the length of the bars
var y = d3.scale.linear()
  .range([barHeight, 0]);

// Defines the x-axis. Placed at the bottom.
var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom");

// Defines the y-axis. Placed on the left.
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

// Tooltip.
var tip = d3.tip()
  .attr("class", 'd3-tip')
  .html(function(d) {
    return "<div class='tip'>" + d.average + " \xB0C </div>";
  })

// Selects the chart in the html and gives it width and height including margins
var barChart = d3.select(".barChart")
    .attr("width", barWidth + barMargin.left + barMargin.right)
    .attr("height", barHeight + barMargin.top + barMargin.bottom)
  .append("g")
    .attr("transform", "translate(" + barMargin.left + "," + barMargin.top + ")");

barChart.call(tip);

// Adds a title to the top of the chart
barChart.append("text")
  .attr("x", barWidth / 2)
  .attr("y", 20)
  .style("font", "20px sans-serif")
  .text("Sum of rainfall measured per day at Schiphol from october 30 to november 12 in 2017");

// ----------------- LOAD EXTERNAL DATA ----------------------------------------
queue()
  .defer(d3.json, "../Data/DeBilt.json")
	.defer(d3.json, "../Data/Eindhoven.json")
  .defer(d3.json, "../Data/Leeuwarden.json")
  .defer(d3.json, "../Data/Schiphol.json")
  .defer(d3.json, "../Data/Vlissingen.json")
	.await(collectData);

var names = ["De Bilt", "Eindhoven", "Leeuwarden", "Schiphol", "Vlissingen"]

// Loads in all data sets and makes the charts.
function collectData(error, dataDeBilt, dataEindhoven, dataLeeuwarden, dataSchiphol, dataVlissingen) {

  // Collects all temperatures for all stations for a single date
  var dateData = [];
  plotDate = "2017-10-01";
  dateData[0] = getStationData(error, dataDeBilt, names[0], plotDate);
  dateData[1] = getStationData(error, dataEindhoven, names[1], plotDate);
  dateData[2] = getStationData(error, dataLeeuwarden, names[2], plotDate);
  dateData[3] = getStationData(error, dataSchiphol, names[3], plotDate);
  dateData[4] = getStationData(error, dataVlissingen, names[4], plotDate);

  // Collects average temperature for the Schiphol weather station for all dates
  var calendarData = [];
  // Collect data for a date.
  dataSchiphol.forEach(function(d, i) {
    var dateAverage = {};
    dateAverage.date = parseDate(d.date);
    dateAverage.average = d.average;
    calendarData[i] = dateAverage;
  });

  // ----------------- CALENDAR -----------------------------------------------

  calendarView.selectAll(".month")
    .data(function(d) { return d3.time.months(new Date(2017, 9, 1), new Date(2017, 12, 1)); })
    .enter().append("path")
    .attr("class", "month")
    .attr("id", function(d,i){ return month[i] })
    .attr("d", monthPath);

  var calendarRect = calendarView.selectAll(".day")
    .data(calendarData)
    .enter()

    // Adds a rect for every date
  	.append("rect")
      .attr("class", "day")
      .attr("width", cellSize)
      .attr("height", cellSize)

      // Set position of rect based on the weeknumber and day in the week.
      .attr("x", function(d) { return (week(d.date) * cellSize); })
      .attr("y", function(d) { return day(d.date) * cellSize; })
      .attr("fill",'#fff')

      // Assigns this date as data on this rect
      .datum(function(d) { return d.date; });

  calendarRect.filter(function(d) { return d in calendarData; })
        .attr("fill", function(d) { return colour(calendarData[d]); })

  // ----------------- BAR CHART -----------------------------------------------
  // Width of bars in the chart set to width divided by number of data entries
  var rectWidth = barWidth / 5;

  // Defines domain based on the data
  x.domain(names);
  y.domain([-5, 35]);
  // d3.extent(dateData, function(d) { return d[2]; })

  var bar = barChart.selectAll(".stuff")
    .data(dateData)
    .enter().append("g")
      .attr("class", "bar")
      .attr("transform", function(d, i) { return "translate(" + i * rectWidth + ",0)"; });


  // Gives the bar a rectangle for the minimum temperature
  bar.append("rect")
    // gives the rectangle a proper range and  domain
    .attr("y", function(d) { return y(d.minimum); })

    // Set height to the temperature data.
    .attr("height", function(d) {return barHeight - y(d.minimum);})

    // Set width to barWidth - 1 to create space between bars
    .attr("width", (rectWidth / 3) - 1)

    .style("fill", "steelblue")
    .on("mouseover", tip.show)
    .on("mouseout", tip.hide);

  // Gives the bar a rectangle for the average temperature
  bar.append("rect")
    .attr("y", function(d) { return y(d.average); })
    .attr("x", (rectWidth / 3))
    .attr("height", function(d) {return barHeight - y(d.average);})
    .attr("width", (rectWidth / 3) - 1)
    .style("fill", "grey")
    .on("mouseover", tip.show)
    .on("mouseout", tip.hide);

  // Gives the bar a rectangle for the maximum temperature
  bar.append("rect")
    .attr("y", function(d) { return y(d.maximum); })
    .attr("x", (rectWidth / 3) * 2)
    .attr("height", function(d) {return barHeight - y(d.maximum);})
    .attr("width", (rectWidth / 3) - 1)
    .style("fill", "orange")
    .on("mouseover", tip.show)
    .on("mouseout", tip.hide);


  // Adds a g element for an X axis
  barChart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + barHeight + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "axisLabel")
      .attr("x", barWidth)
      .attr("y", 30)
      .style("font", "20px sans-serif")
      .style("text-anchor", "end")
      .text("Station");

  // Adds a g element for a Y axis
  barChart.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("font", "20px sans-serif")
      .style("text-anchor", "end")
      .text("Temperature (\xB0C)");
};



// Function to collect the data for a single date from a specific station.
function getStationData(error, data, station, date){
  if (error) throw error;

  var stationData = {};
  stationData["station"] = station;

  // Collect data for a date.
  data.forEach(function(d) {
    if (d.date == "2017-10-01") {
      stationData.minimum = d.minimum;
      stationData.average = d.average;
      stationData.maximum = d.maximum;
    };
  });
  return stationData;
};


// Function do draw a path around the calendar's months
// ==============REQUIRES UNDERSTANDING =========================================
function monthPath(t0) {
  var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
      d0 = +day(t0), w0 = +week(t0),
      d1 = +day(t1), w1 = +week(t1);
  return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize
      + "H" + w0 * cellSize + "V" + 7 * cellSize
      + "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize
      + "H" + (w1 + 1) * cellSize + "V" + 0
      + "H" + (w0 + 1) * cellSize + "Z";
}

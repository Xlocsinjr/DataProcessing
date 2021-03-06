/****
 * linked.js
 *
 * Name: Xander Locsin
 * StudentID: 10722432
 *
 * Script to create a calendar heatmap and a linked bar chart in linked.html
 * The bar chart displays temperatures measured on the date that was clicked on
 * in the calendar.
 *
 * References:
 *  For the barchart:
 *    https://bost.ocks.org/mike/bar/3/
 *  For the tooltips:
 *    http://bl.ocks.org/Caged/6476579
 *  For the calendar view:
 *    https://www.crowdanalytix.com/communityBlog/10-steps-to-create-calendar-view-heatmap-in-d3-js
 *    https://github.com/mohans-ca/d3js-heatmap/blob/master/calendermap.js
 ****/


// ----------------- CALENDAR INITIALISATION -----------------------------------

// Sets the margins for the calendar view.
var calendarMargin = {top: 20, right: 30, bottom: 30, left: 30},
  calendarWidth = 400 - calendarMargin.left - calendarMargin.right,
  calendarHeight = 500 - calendarMargin.top - calendarMargin.bottom;

// Selects the chart in the html and gives it width and height including margins
var calendarView = d3.select(".calendarView")
    .attr("width", calendarWidth + calendarMargin.left + calendarMargin.right)
    .attr("height", calendarHeight + calendarMargin.top + calendarMargin.bottom)
  .append("g")
    .attr("transform", "translate(" + calendarMargin.left + "," + calendarMargin.top + ")");


var month = ['September','October','November'];

var names = ["De Bilt", "Eindhoven", "Leeuwarden", "Schiphol", "Vlissingen"]

// Adds a legend to show the month names.
var calendarLegend = calendarView.selectAll(".legend")
  .data(month)
  .enter().append("g")
    .attr("transform", function(d, i) { return "translate( 0," + (100 + i * 150) + ")"; });

calendarLegend.append("text")
  .attr("class", "calendarLegendText")
  .attr("x", 90)
  .text(function(d,i){ return month[i] });

// Calendar tooltip to show average temperature of a date.
var calendarTip = d3.tip()
 .attr('class', 'd3-tip')
 .offset([-10, 0])
 .html(function(d) {
   var tipDateString = "<strong> Date: </strong>" + formatDate(d.date) + "<br>";
   var tipTempString = "<strong> Average temperature: </strong>" + String(d.average) + " \xB0C";
   return tipDateString + tipTempString;
 });

calendarView.call(calendarTip);


// ----------------- BAR CHART INITIALISATION ----------------------------------

// Sets the margins for the bar chart and sets the width and height
var barMargin = {top: 50, right: 0, bottom: 150, left: 50},
  barWidth = 500 - barMargin.left - barMargin.right,
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

// Barchart tooltip.
var tip = d3.tip()
  .attr("class", 'd3-tip');

// Selects the chart in the html and gives it width and height including margins
var barChart = d3.select(".barChart")
    .attr("width", barWidth + barMargin.left + barMargin.right)
    .attr("height", barHeight + barMargin.top + barMargin.bottom)
  .append("g")
    .attr("transform", "translate(" + barMargin.left + "," + barMargin.top + ")");

barChart.call(tip);

var barLegendColours = ["orange", "grey", "steelblue"]
var barLegendNames = ["Maximum temperature", "Average temperature", "Minimum temperature" ]

// Adds a canvas for the Legend to the chart
var legendX = barWidth / 4;
var legendY = barHeight + 30;
var barLegend = barChart.append("g");
barLegend.append("rect")
    .attr("id", "barLegend")
    .attr("x", legendX)
    .attr("y", legendY)
    .attr("width", 160)
    .attr("height", 110);

// Adds coloured boxes to the legend
for (var i = 0; i < 3; i++) {
  barLegend.append("rect")
    .attr("class", "barLegendBox")
    .attr("x", legendX + 10)
    .attr("y", function () { yVal = legendY + 10 + 30 * i;
      return yVal;})
    .attr("width", 20)
    .attr("height", 20)
    .style("fill", barLegendColours[i]);

  // Adds text to the legend
  barLegend.append("text")
      .attr("class", "barLegendText")
      .attr("x", legendX + 40)
      .attr("y", function () { yVal = legendY + 20 + 30 * i;
        return yVal;})
      .style("text-anchor", "start")
      .text( barLegendNames[i]);
};




// ----------------- LOAD EXTERNAL DATA ----------------------------------------
queue()
  .defer(d3.json, "../Data/DeBilt.json")
	.defer(d3.json, "../Data/Eindhoven.json")
  .defer(d3.json, "../Data/Leeuwarden.json")
  .defer(d3.json, "../Data/Schiphol.json")
  .defer(d3.json, "../Data/Vlissingen.json")
	.await(charts);

// Loads in all data sets and makes the charts.
function charts(error, dataDeBilt, dataEindhoven, dataLeeuwarden, dataSchiphol, dataVlissingen) {
  if (error) throw error;

  var plotDate = "1-9-2017";
  makeCalendarView(dataDeBilt, dataEindhoven, dataLeeuwarden, dataSchiphol, dataVlissingen);
  makeBarChart(plotDate, dataDeBilt, dataEindhoven, dataLeeuwarden, dataSchiphol, dataVlissingen);
};


// ----------------- CALENDAR --------------------------------------------------
function makeCalendarView(dataDeBilt, dataEindhoven, dataLeeuwarden, dataSchiphol, dataVlissingen) {

  // Collects average temperature for the Schiphol weather station for all dates
  var calendarData = [];

  // Collect data for a date.
  dataSchiphol.forEach(function(d, i) {
    var dateAverage = {};
    dateAverage.date = parseDate(d.date);
    dateAverage.average = d.average;
    calendarData[i] = dateAverage;
  });

  // Adds a title to the top of the calendar.
  calendarView.append("text")
    .attr("class", "title")
    .attr("x", calendarWidth / 2)
    .attr("y", 20)
    .text("Average temperature at Schiphol from October to November");

  // Colour range
  var colour = d3.scale.linear()
    .range(["white", "blue"])
    .domain(d3.extent(calendarData, function(d) { return d.average; }));

  var cellSize = 25;
  var monthOffset = -cellSize - 2;

  // Adds a rect for every date
  var calendarRect = calendarView.selectAll(".day")
  .data(calendarData)
  .enter()
  .append("rect")
    .attr("class", "day")
    .attr("width", cellSize)
    .attr("height", cellSize)

    // Set position of rect based on the weeknumber and day in the week.
    .attr("x", function(d) { return (day(d.date) * cellSize) + 100; })
    .attr("y", function(d) {

      // Change the offset if the day is the first of the month.
      if ((d.date).getDate() == 1) {
        monthOffset += cellSize + 2
      }

      // Sets y to right position and sets offset for space between months.
      rectY = (week(d.date) - 30) * cellSize - 40 + monthOffset
      return rectY;
    })
    .attr("fill", function(d) { return colour(d.average); })
    .attr("stroke", "black")

    // Changes the bar chart to show temperatures from the clicked on date.
    .on("click", function(d) {
      dateToPlot = formatDate(d.date);
      makeBarChart(dateToPlot, dataDeBilt, dataEindhoven, dataLeeuwarden, dataSchiphol, dataVlissingen);
    })

    // Shows and hides the calendar tooltip.
    .on("mouseover", calendarTip.show)
    .on("mouseout", calendarTip.hide);
}

// ----------------- BAR CHART -------------------------------------------------
function makeBarChart(plotDate, dataDeBilt, dataEindhoven, dataLeeuwarden, dataSchiphol, dataVlissingen) {

  // Removes all old elements.
  barChart.selectAll(".bar").remove();
  barChart.selectAll(".title").remove();
  barChart.selectAll(".axis").remove();

  // Collect the temperature data from a specific date.
  var dateData = getDateData(plotDate, dataDeBilt, dataEindhoven, dataLeeuwarden, dataSchiphol, dataVlissingen);

  // Adds a title to the top of the barchart.
  barChart.append("text")
    .attr("class", "title")
    .attr("x", barWidth / 2)
    .attr("y", -10)
    .text("Temperatures measured on " + plotDate + " at various weather stations");

  // Width of bars in the chart set to width divided by number of data entries
  var rectGroupWidth = barWidth / 5;


  // Gathers the lowest of the minimum temperatures and the highest of the max.
  var minTemp = d3.min(dateData, function(d) { return d.minimum; });
  var maxTemp = d3.max(dateData, function(d) { return d.maximum; });

  // Temperature axis margin to prevent large difference in bar size.
  var barSizeMargin = (maxTemp - minTemp) / 3;

  // Defines domain based on the data.
  x.domain(names);
  y.domain([minTemp - barSizeMargin, maxTemp + barSizeMargin]);


  var bar = barChart.selectAll(".bar")
    .data(dateData)
    .enter().append("g")
      .attr("class", "bar")
      .attr("transform", function(d, i) { return "translate(" + i * rectGroupWidth + ",0)"; });


  // Gives the bar a rectangle for the minimum temperature
  bar.append("rect")
    // gives the rectangle a proper range and  domain
    .attr("x", 4)
    .attr("y", function(d) { return y(d.minimum); })

    // Set height to the temperature data.
    .attr("height", function(d) {return barHeight - y(d.minimum);})

    // Set width to barWidth - 5 to create space between bars
    .attr("width", (rectGroupWidth / 3) - 5)

    .style("fill", "steelblue")
    .on("mouseover", function(d) {
      tip.html("<div class='tip'>" + d.minimum + " \xB0C </div>")
      tip.show();
    })
    .on("mouseout", tip.hide);

  // Gives the bar a rectangle for the average temperature
  bar.append("rect")
    .attr("x", (rectGroupWidth / 3))
    .attr("y", function(d) { return y(d.average); })
    .attr("height", function(d) {return barHeight - y(d.average);})
    .attr("width", (rectGroupWidth / 3) - 5)
    .style("fill", "grey")
    .on("mouseover", function(d) {
      tip.html("<div class='tip'>" + d.average + " \xB0C </div>")
      tip.show();
    })
    .on("mouseout", tip.hide);

  // Gives the bar a rectangle for the maximum temperature
  bar.append("rect")
    .attr("x", ((rectGroupWidth / 3) * 2) - 4)
    .attr("y", function(d) { return y(d.maximum); })
    .attr("height", function(d) {return barHeight - y(d.maximum);})
    .attr("width", (rectGroupWidth / 3) - 5)
    .style("fill", "orange")
    .on("mouseover", function(d) {
      tip.html("<div class='tip'>" + d.maximum + " \xB0C </div>")
      tip.show();
    })
    .on("mouseout", tip.hide);

  // Adds a g element for an X axis
  barChart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + barHeight + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "axisLabel")
      .attr("x", barWidth)
      .attr("y", 35)
      .style("font", "20px sans-serif")
      .style("text-anchor", "end")
      .text("Station");

  // Adds a g element for a Y axis
  barChart.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -40)
      .attr("dy", ".71em")
      .style("font", "20px sans-serif")
      .style("text-anchor", "end")
      .text("Temperature (\xB0C)");
};


// --------------------------- HELPER FUNCTIONS --------------------------------

// Parse the date / time.
var parseDate = d3.time.format("%Y-%m-%d").parse;

// Get weeknumber of the year with week starting on Sunday from a js date.
var week = d3.time.format("%U");

// Get weekday as a decimal number from a js date.
var day = d3.time.format("%w");


// Collects all temperatures for all stations for a single date.
function getDateData(plotDate, dataDeBilt, dataEindhoven, dataLeeuwarden, dataSchiphol, dataVlissingen) {
  var dateData = [];
  dateData[0] = getStationData(dataDeBilt, names[0], plotDate);
  dateData[1] = getStationData(dataEindhoven, names[1], plotDate);
  dateData[2] = getStationData(dataLeeuwarden, names[2], plotDate);
  dateData[3] = getStationData(dataSchiphol, names[3], plotDate);
  dateData[4] = getStationData(dataVlissingen, names[4], plotDate);
  return dateData;
};

// Function to collect the data for a single date from a specific station.
function getStationData(data, station, date){
  var stationData = {};
  stationData["station"] = station;

  // Collect data for a date.
  data.forEach(function(d) {
    if (formatDate(parseDate((d.date))) == date) {
      stationData.minimum = d.minimum;
      stationData.average = d.average;
      stationData.maximum = d.maximum;
    };
  });
  return stationData;
};


// formats date to easier to read string.
function formatDate(dateVariable) {
 var day = dateVariable.getDate();
 var month = dateVariable.getMonth() + 1;
 var year = dateVariable.getFullYear();
 return day + "-" + month + "-" + year;
};

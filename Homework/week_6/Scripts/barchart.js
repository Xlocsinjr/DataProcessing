/****
 * barchart.js
 *
 * Xander Locsin, 10722432
 *
 * Implements a bar chart using d3 to create svg elements in barchart.html
 * Code is heavily based on this tutorial: https://bost.ocks.org/mike/bar/3/
 * From: http://bl.ocks.org/Caged/6476579
 ****/

// Sets the margins for the chart and sets the width and height
var margin = {top: 20, right: 30, bottom: 30, left: 40},
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

// Parse the date / time
var parseDate = d3.time.format("%Y-%m-%d").parse;

// Ordinal scale for the x-axis to display station names
var x = d3.scale.ordinal()
  .rangeRoundBands([0, width], .1);

// Linear scale to properly set the length of the bars
var y = d3.scale.linear()
  .range([height, 0]);

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
var chart = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

chart.call(tip);

// Adds a title to the top of the chart
chart.append("text")
  .attr("x", width / 2)
  .attr("y", 20)
  .style("font", "20px sans-serif")
  .text("Sum of rainfall measured per day at Schiphol from october 30 to november 12 in 2017");

// ----------------- LOAD EXTERNAL DATA ----------------------------------------
queue()
	.defer(d3.json, '../Data/DeBilt.json')
	.defer(d3.json, '../Data/Eindhoven.json')
	.await(makeBar);

var names = ["De Bilt", "Eindhoven", "Leeuwarden", "Schiphol", "Vlissingen"]

function makeBar(error, dataDeBilt, dataEindhoven) {
  if (error) throw error;

  // parse date strings to dates
  dataDeBilt.forEach(function(d) {
    d.date = parseDate(d.date);
    });

  // Defines domain based on the data
  x.domain(names);
  y.domain(d3.extent(dataDeBilt, function(d) { return d.average; }));


  // Width of the bar is defined as width divided by the number of data entries
  var barWidth = width / dataDeBilt.length;

  // Loads in the external data into g elements
  var bar = chart.selectAll("g")
      .data(dataDeBilt)
    .enter().append("g")
      .attr("class", "bar")
      .attr("transform", function(d, i) {return "translate(" + i * barWidth + ",0)";});

  // Gives the bar a rectangle
  bar.append("rect")
      // gives the rectangle a proper range and  domain
      .attr("y", function(d) { return y(+d.average); })

      // Set height to the temperature data.
      .attr("height", function(d) {return height - y(+d.average);})

      // Set width to barWidth - 1 to create space between bars
      .attr("width", barWidth - 1)

      // Shows and hides the tooltip
      .on("mouseover", tip.show)
      .on("mouseout", tip.hide);


  // Adds a g element for an X axis
  chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "axisLabel")
      .attr("x", width)
      .attr("y", 30)
      .style("font", "20px sans-serif")
      .style("text-anchor", "end")
      .text("Date");

  // Adds a g element for a Y axis
  chart.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("font", "20px sans-serif")
      .style("text-anchor", "end")
      .text("Rainfall (+ 0.1 mm)");
};

/****
 * week3_script.js
 *
 * Xander Locsin, 10722432
 *
 *
 ****/

// Code is heavily based on this tutorial: https://bost.ocks.org/mike/bar/3/

// Sets the margins for the chart and sets the width and height
var margin = {top: 20, right: 30, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// Offset magic number to allow negative values into the chart
var dataOffset = 0.1;


// Linear scale to properly set the length of the bars
// Range of the bars starts at height since 0 is at the top
var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
  .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

// Selects the chart in the html and gives it width and height including margins
var chart = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");






// Loads in external data
d3.json("Rainsum.json", function(error, data) {

  // Defines domain based on the data
  //x.domain(data.map(function(d) { return d.date; }));
  y.domain([0, d3.max(data, function(d) {return d.rainfall;}) + dataOffset]);

  // Adds a g element for an X axis
  chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0,' + height + ')")
      .call(xAxis);

  // Adds a g element for a Y axis
  chart.append("g")
      .attr("class", "y axis")
      .call(yAxis);


  // Width of the bar is defined as width divided by the number of data entries
  var barWidth = width / data.length;

  // Loads in the external data into g elements
  var bar = chart.selectAll("g")
      .data(data)
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(" + i * barWidth + ",0)"; });

  // Gives the bar a rectangle (so that it's actually a bar)
  bar.append("rect")
      // gives the rectangle a proper range and  domain
      .attr("y", function(d) { return y(d.rainfall + dataOffset); })

      // Set height to the rainfall data + the offset to allow negatives
      .attr("height", function(d) {return height - y(d.rainfall + dataOffset);})

      // Set width to barWidth - 1 to create space between bars
      .attr("width", barWidth - 1);

  // Adds text to the bars displaying the rainfall
  bar.append("text")
      .attr("x", barWidth / 2)
      .attr("y", function(d) { return y(d.rainfall) - 3; })
      .attr("dy", ".75em")
      .text(function(d) { return d.rainfall; });
});

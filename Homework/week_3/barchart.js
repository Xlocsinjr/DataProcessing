/****
 * week3_script.js
 *
 * Xander Locsin, 10722432
 *
 *
 ****/


// // load the data
// d3.json("Rainsum.json", function(error, data) {
//  i = 0
//  data.forEach(function(d) {
//    rainfall[i] = d.rainfall;
//    dates[i] = d.date;
//    i++;
//  });

// sets width and height for the plot
var width = 960,
    height = 500;

// Offset magic number to allow negative values into the chart
var dataOffset = 0.1;

// Linear scale to properly set the length of the bars
// Range of the bars starts at height since 0 is at the top
var y = d3.scale.linear()
  .range([height, 0]);

// Selects the chart in the html and gives it the attributes of width and height
var chart = d3.select(".chart")
    .attr("width", width)
    .attr("height", height);

// Loads in external data
d3.json("Rainsum.json", function(error, data) {

  // Defines domain based on the data
  y.domain([0, d3.max(data, function(d) {return d.rainfall;}) + dataOffset]);

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
      .attr("height", function(d) {return height - y(d.rainfall + dataOffset);})
      .attr("width", barWidth - 1);

  bar.append("text")
      .attr("x", barWidth / 2)
      .attr("y", function(d) { return y(d.rainfall) - 3; })
      .attr("dy", ".75em")
      .text(function(d) { return d.rainfall; });

});

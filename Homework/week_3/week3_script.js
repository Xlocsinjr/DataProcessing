/****
 * week3_script.js
 *
 * Xander Locsin, 10722432
 *
 *
 ****/

// load in data
d3.json("Rainsum.json", function(data) {
  console.log(data);
});


// https://bost.ocks.org/mike/bar/
var data = [4, 8, 15, 16, 23, 42];

var x = d3.scale.linear()
    .domain([0, d3.max(data)])
    .range([0, 420]);

d3.select(".chart")
  .selectAll("div")
    .data(data)
  .enter().append("div")
    .style("width", function(d) { return x(d) + "px"; })
    .text(function(d) { return d; });

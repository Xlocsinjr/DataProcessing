/****
 * week3_script.js
 *
 * Xander Locsin, 10722432
 *
 *
 ****/

var rainfall = [];
var dates = [];

// http://bl.ocks.org/Jverma/887877fc5c2c2d99be10

// load the data
d3.json("Rainsum.json", function(error, data) {
  i = 0
  data.forEach(function(d) {
    rainfall[i] = d.rainfall;
    dates[i] = d.date;
    i++;
  });
});

// var div = document.createElement("div");
// div.innerHTML = "Hello, world!";
// document.body.appendChild(div);
//
// var body = d3.select("body");
// var div = body.append("div");
// div.html("Hello, world!");

d3.select("body")
    .style("color", "black")
    .style("background-color", "white");

d3.selectAll("section")
    .attr("class", "special")
  .append("div")
    .html("Hello, world!");

d3.select("body")
  .append("div")
  .html("Hello, world!");



var data = [4, 8, 15, 16, 23, 42];

d3.select("body")
    .append("div")
    .html("Hello, world!");

d3.select(".chart")
  .selectAll("div")
    .data(data)
  .enter().append("div")
    .style("width", function(d) { return d * 10 + "px"; })
    .text(function(d) { return d; });

d3.select(".chart").selectAll("div")
    .style("color", "black")
    .style("background-color", "steelblue")
    .style("padding", "2px")
    .style("margin", "2px");

window.onload = function() {
  console.log(dates);
  console.log(rainfall);

  // var x = d3.scale.linear()
  //     .domain([0, d3.max(rainfall)])
  //     .range([0, 10]);
  //
  // d3.select(".chart")
  //   .selectAll("div")
  //     .data(rainfall)
  //   .enter().append("div")
  //     .style("width", function(d) { return x(d) + "px"; })
  //     .text(function(d) { return d; });
}


// https://bost.ocks.org/mike/bar/
// var data = [4, 8, 15, 16, 23, 42];


// http://bl.ocks.org/Jverma/887877fc5c2c2d99be10

/****
 * scatterplot.js
 *
 * Xander Locsin, 10722432
 *
 *
 ****/

var days = 31;

// Function to round numbers off to 1 decimal
function rounder(number){
  rounded = Math.round( number * 10 ) / 10;
  return rounded;
}


// Run script when page is fully loaded
window.onload = function() {

  var url = "https://raw.githubusercontent.com/Xlocsinjr/DataProcessing/master/Homework/week_4/KNMI_20171031.csv"
  var request = new XMLHttpRequest();
  request.open("GET", url);

  /*
  * from example in
  * https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseText
  */
  var raw_data;
  request.onload = function () {
   if (request.readyState === request.DONE) {
     if (request.status === 200) {
       raw_data = String(request.responseText);
       main();
     }
   }
  };
  request.send();
  // Run this main function when request was succesful
  function main() {
    // Splits the data into separate lines
    var raw_data_split = raw_data.split("\n");

    var stations = [];
    var precipitations = [];
    var windspeeds = [];
    var temperatures = [];

    var station_check = "";
    var station_count = 0;
    var precipitation_sum = 0;
    var windspeed_sum = 0;
    var temperature_sum = 0;

    for (var line = 0; line < raw_data_split.length; line++){
      // Splits the lines by comma
      line_split = raw_data_split[line].trim();
      line_split = line_split.split(",");

      // Retrieves information from the line
      station = line_split[0];
      windspeed = parseInt(line_split[2]);
      temperature = parseInt(line_split[3]);
      precipitation = parseInt(line_split[4]);

      // Reformats information to proper units
      windspeed = rounder(windspeed * 0.1);
      temperature = rounder(temperature * 0.1);
      precipitation = rounder(temperature * 0.1);

      windspeed_sum += windspeed;
      temperature_sum += temperature;
      precipitation_sum += precipitation;

      // If data for a month of a station is summed: store averages
      if ((line + 1) % days == 0){
        stations[station_count] = station;
        windspeeds[station_count] = rounder(windspeed_sum / days);
        temperatures[station_count] = rounder(temperature_sum / days);
        precipitations[station_count] = rounder(precipitation_sum / days);

        // Reset sums to 0 for summation of next station's data
        windspeed_sum = 0;
        temperature_sum = 0;
        precipitation_sum = 0;

        station_count++;
      }

    }
    console.log(stations);
    console.log(precipitations);
    console.log(windspeeds);
    console.log(temperatures);
  }
}



// // Sets the margins for the chart and sets the width and height
// var margin = {top: 20, right: 30, bottom: 30, left: 40},
//     width = 960 - margin.left - margin.right,
//     height = 500 - margin.top - margin.bottom;
//
// // Ordinal scale for the x-axis to display dates
// var x = d3.scale.ordinal()
//     .rangeRoundBands([0, width], .1);
//
// // Linear scale to properly set the length of the bars
// var y = d3.scale.linear()
//   .range([height, 0]);
//
// // Defines the x-axis. Placed at the bottom.
// var xAxis = d3.svg.axis()
//     .scale(x)
//     .orient("bottom");
//
// // Defines the y-axis. Placed on the left.
// var yAxis = d3.svg.axis()
//     .scale(y)
//     .orient("left");
//
// // From: http://bl.ocks.org/Caged/6476579
// var tip = d3.tip()
//   .attr('class', 'd3-tip')
//   //.offset([-10, 0])
//   .html(function(d) {
//     return "<div class='tip'>" + d.rainfall + " mm </div>";
//   })
//
// // Selects the chart in the html and gives it width and height including margins
// var chart = d3.select(".chart")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//   .append("g")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//
// chart.call(tip);
//
// // Adds a title to the top of the chart
// chart.append("text")
//   .attr("x", width / 2)
//   .attr("y", 20)
//   .style("font", "20px sans-serif")
//   .text("Sum of rainfall measured per day at Schiphol from october 30 to november 12 in 2017");
//
// // Loads in external data
// d3.json("Rainsum.json", function(error, data) {
//
//   // Defines domain based on the data
//   x.domain(data.map(function(d) { return d.date; }));
//   y.domain([-dataOffset, d3.max(data, function(d) {return d.rainfall;})]);
//
//
//   // Width of the bar is defined as width divided by the number of data entries
//   var barWidth = width / data.length;
//
//   // Loads in the external data into g elements
//   var bar = chart.selectAll("g")
//       .data(data)
//     .enter().append("g")
//       .attr("class", "bar")
//       .attr("transform", function(d, i) { return "translate(" + i * barWidth + ",0)"; });
//
//   // Gives the bar a rectangle (so that it's actually a bar)
//   bar.append("rect")
//       // gives the rectangle a proper range and  domain
//       .attr("y", function(d) { return y(d.rainfall + dataOffset); })
//
//       // Set height to the rainfall data + the offset to allow negatives
//       .attr("height", function(d) {return height - y(d.rainfall + dataOffset);})
//
//       // Set width to barWidth - 1 to create space between bars
//       .attr("width", barWidth - 1)
//
//       // Shows and hides the tooltip
//       .on("mouseover", tip.show)
//       .on("mouseout", tip.hide);
//
//
//   // Adds a g element for an X axis
//   chart.append("g")
//       .attr("class", "x axis")
//       .attr("transform", "translate(0," + height + ")")
//       .call(xAxis)
//     .append("text")
//       .attr("class", "axisLabel")
//       .attr("x", width)
//       .attr("y", 30)
//       .style("font", "20px sans-serif")
//       .style("text-anchor", "end")
//       .text("Date");
//
//   // Adds a g element for a Y axis
//   chart.append("g")
//       .attr("class", "y axis")
//       .call(yAxis)
//     .append("text")
//       .attr("transform", "rotate(-90)")
//       .attr("y", 6)
//       .attr("dy", ".71em")
//       .style("font", "20px sans-serif")
//       .style("text-anchor", "end")
//       .text("Rainfall (+ 0.1 mm)");
// });

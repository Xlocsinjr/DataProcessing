/****
 * scatterplot.js
 *
 * Xander Locsin, 10722432
 *
 * Makes a scatterplot of the monthly average precipitation duration, average windspeed,
 * and average temperature for various weather stations of the KNMI.
 * The data was taken in October 2017
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

    var station_count = 0;
    var precipitation_sum = 0;
    var windspeed_sum = 0;
    var temperature_sum = 0;

    for (var line = 0; line < raw_data_split.length; line++){
      // Splits the lines by comma
      line_split = raw_data_split[line].trim();
      line_split = line_split.split(",");

      // Retrieves information from the line
      station = parseInt(line_split[0]);
      windspeed = parseInt(line_split[2]);
      temperature = parseInt(line_split[3]);
      precipitation = parseInt(line_split[4]);

      // Reformats information to proper units
      windspeed = rounder(windspeed * 0.1);
      temperature = rounder(temperature * 0.1);
      precipitation = rounder(precipitation * 0.1);

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

    // Orders the data into points
    var data = [];
    for (var i = 0; i < stations.length; i++){
      var point = [];
      point[0] = stations[i];
      point[1] = precipitations[i];
      point[2] = windspeeds[i];
      point[3] = temperatures[i];

      data[i] = point;
    }


    // From example: https://bost.ocks.org/mike/bar/3/

    // Sets the margins for the chart and sets the width and height
    var margin = {top: 20, right: 30, bottom: 40, left: 40},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // Sets x-axis scale for windspeeds
    var x = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { return d[2]; }) + 1])
        .range([0, width]);

    // Sets y-axis scale for precipitations
    var y = d3.scale.linear()
      .domain([0, d3.max(data, function(d) { return d[1]; }) + 0.5])
      .range([height, 0]);

    /* From: https://stackoverflow.com/questions/38793897/setting-color-for-a-particular-value-when-using-d3-scale-threshold
     * Maps the station numbers to colours */
    var colours = ["red", "orange", "yellow", "green",
      "steelblue", "aqua", "BurlyWood", "Cornsilk"]
    var q = d3.scale.ordinal()
      .domain([235, 240, 260, 269, 270, 290, 370, 380])
      .range(colours);

    // Maps station number to station names
    var s = d3.scale.ordinal()
      .domain([235, 240, 260, 269, 270, 290, 370, 380])
      .range(["De Kooy", "Schiphol", "De Bilt", "Lelystad", "Leeuwarden", "Twenthe", "Eindhoven", "Maastricht"]);

    // Maps average temperature to circle radius
    var r = d3.scale.linear()
      .domain([d3.min(data, function(d) { return d[3]; })
        , d3.max(data, function(d) { return d[3]; })])
      .range([5, 15]);

    // Defines the x-axis. Placed at the bottom.
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    // Defines the y-axis. Placed on the left.
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    // From: http://bl.ocks.org/Caged/6476579
    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .html(function(d) {
        var tip = "<div class='tip-title'>" + s(d[0]) + " </div>\n"
          + "<div class='tip'> precipitation duration: " + d[1] + " h</div>\n"
          + "<div class='tip'> windspeed: " + d[2] + " m/s  </div>\n"
          + "<div class='tip'> average temperature: " + d[3] + " C  </div>\n";
        return tip;
      })

    // Selects the chart in the html and gives it width and height including margins
    var chart = d3.select(".chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    chart.call(tip);


    /* From example: http://bl.ocks.org/bunkat/2595950
     * Adds dots for every station's data */
    var dots = chart.append("g");

    dots.selectAll("scatter-dots")
      .data(data)
      .enter().append("circle")
          .attr("class", "scatter_dot")

          // x based on average windspeed
          .attr("cx", function (d) { return x(d[2]); } )

          // y based on average precipitation duration
          .attr("cy", function (d) { return y(d[1]); } )

          // circle size based on average temperature
          .attr("r", function (d) { return r(d[3]); } )

          // color depending on station
          .style("fill", function (d) { return q(d[0]); })

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
        .text("average daily windspeed (m/s)");

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
        .text("average daily precipitation duration (hours)");

    // Adds a canvas for the Legend to the chart
    var legend_x = 90;
    var legend_y = height - 260;
    var legend = chart.append("g")
      .append("rect")
      //<rect id="canvas" x="1.8" y="1.8" class="st0" width="175.1" height="291.4"/>
        .attr("class", "legend")
        .attr("x", legend_x)
        .attr("y", legend_y)
        .attr("width", 130)
        .attr("height", 250);

    // Adds coloured boxes to the legend
    var legend_count = 0;
    chart.selectAll("legend_colour")
      .data(data)
      .enter()
        .append("rect")
          .attr("class", "legend_element")
          .attr("x", legend_x + 10)
          .attr("y", function () { y_val = legend_y + 10 + 30 * legend_count;
            legend_count++
            return y_val;})
          .attr("width", 20)
          .attr("height", 20)
          .style("fill", function (d) {
            legend_count++;
            return q(d[0]); })

    // Adds text to the legend
    var legend_count = 0;
    chart.selectAll("legend_text")
      .data(data)
      .enter()
        .append("text")
          .attr("class", "legend_text")
          .attr("x", legend_x + 40)
          .attr("y", function () { y_val = legend_y + 20 + 30 * legend_count;
            legend_count++
            return y_val;})
          .style("text-anchor", "start")
          .text( function (d) {return s(d[0]); } );


  }
}

// ADD LEGEND AND SOURCE

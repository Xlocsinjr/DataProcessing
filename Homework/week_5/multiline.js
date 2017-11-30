/****
 * multiline.js
 *
 * Xander Locsin, 10722432
 *
 * Code based on these examples:
 * http://bl.ocks.org/d3noob/b3ff6ae1c120eea654b5
 * http://bl.ocks.org/mikehadlow/raw/93b471e569e31af07cd3/
 * https://www.pshrmn.com/tutorials/d3/mouse/
 ****/

 /* formats date to easier to read string.
  *From:https://stackoverflow.com/questions/3552461/how-to-format-a-javascript-date */
function formatDate(dateVariable) {
  var day = dateVariable.getDate();
  var month = dateVariable.getMonth();
  var year = dateVariable.getFullYear();
  return day + "-" + month + "-" + year;
};

// ---------------------------CHART---------------------------------------------

// Sets the margins for the chart and sets the width and height
var margin = {top: 30, right: 30, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// Parse the date / time
var parseDate = d3.time.format("%Y-%m-%d").parse;

// Ordinal scale for the x-axis to display dates
var x = d3.time.scale()
    .range([0, width]);

// Linear scale to properly set the length of the bars
var y = d3.scale.linear()
  .range([height, 0]);

// Defines the x-axis. Placed at the bottom.
var xAxis = d3.svg.axis()
    .scale(x)
    .ticks(15)
    .orient("bottom");

// Defines the y-axis. Placed on the left.
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

// Selects the chart in the html and gives it width and height including margins
var chart = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Adds a title to the top of the chart
chart.append("text")
  .attr("x", width / 2)
  .attr("y", 0)
  .style("font", "20px sans-serif")
  .text("Minimum, average and maximum temperatures measured in October");

// ----------------------TOOLTIPS-----------------------------------------------

/* From: http://bl.ocks.org/Caged/6476579
 * Adds tooltips for maximum, average and minimum temperature lines */
var tipMax = d3.tip()
  .attr('class', 'd3-tip')
  .html(function(d) {
    var date = formatDate(d.date);
    var tiptext = "<div class='tip'> date: " + date + " </div>\n"
      + "<div class='tip'> temperature: " + d.maximum + "\xB0C </div>\n";
    return tiptext;
  });

var tipAv = d3.tip()
  .attr('class', 'd3-tip')
  .html(function(d) {
    var date = formatDate(d.date);
    var tiptext = "<div class='tip'> date: " + date + " </div>\n"
      + "<div class='tip'> temperature: " + d.average + "\xB0C </div>\n";
    return tiptext;
  });

var tipMin = d3.tip()
  .attr('class', 'd3-tip')
  .html(function(d) {
    var date = formatDate(d.date);
    var tiptext = "<div class='tip'> date: " + date + " </div>\n"
      + "<div class='tip'> temperature: " + d.minimum + "\xB0C </div>\n";
    return tiptext;
  });

var crossTip = d3.tip()
  .attr('class', 'd3-tip')
  .html(function(d) {
    var tiptext = "<div class='tip'> date: " + d.date + " h</div>\n"
      + "<div class='tip'> temperature: " + d.minimum + "\xB0C </div>\n";
    return tiptext;
  });

chart.call(tipMax);
chart.call(tipAv);
chart.call(tipMin);
chart.call(crossTip);

// -----------------------LINE DEFINITIONS--------------------------------------

// From: http://bl.ocks.org/d3noob/b3ff6ae1c120eea654b5
// Define the line
var maxTempLine = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.maximum); });

var avTempLine = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.average); });

var minTempLine = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.minimum); });




// -----------------------LOAD EXTERNAL DATA -----------------------------------
queue()
	.defer(d3.json, 'temperatures240.json')
	.defer(d3.json, 'temperatures344.json')
  .defer(d3.json, 'temperatures370.json');


// Loads in external data
d3.json("temperatures240.json", function(error, data) {
  if (error) throw error;

  // parse date strings to dates
  data.forEach(function(d) {
    d.date = parseDate(d.date);
    });

  // Defines x domain as minimum to maximum of date
  x.domain(d3.extent(data, function(d) { return d.date; }));

  // Defines y domain as 0 to maximum of maximumt temperatures
  y.domain([0, d3.max(data, function(d) {return d.maximum;})]);

  // ----------CROSSHAIR-------------------------------------------------------

  // focus tracking. From: http://bl.ocks.org/mikehadlow/93b471e569e31af07cd3
  var focus = chart.append('g').style('display', 'none');
  // Adds vertical line to the crosshair
  focus.append('line')
      .attr('id', 'focusLineX')
      .attr('class', 'focusLine');

  // Adds horizontal line to the crosshair
  focus.append('line')
      .attr('id', 'focusLineY')
      .attr('class', 'focusLine');

  // Adds a central circle to the crosshair
  focus.append('circle')
      .attr('id', 'focusCircle')
      .attr('r', 5)
      .attr('class', 'circle focusCircle');

  // Adds an overlaying rectangle on which to show the crosshair
  chart.append('rect')
      .data(data)
      .attr('class', 'overlay')
      .attr('width', width)
      .attr('height', height)
      .on('mouseover', function() { focus.style('display', null); })
      .on('mouseout', function() { focus.style('display', 'none'); })
      .on('mousemove', function(d) {
          var mouse = d3.mouse(this);
          var mouseX = mouse[0];
          var mouseY = mouse[1];

          focus.select('#focusCircle')
              .attr('cx', mouseX)
              .attr('cy', mouseY);
          focus.select('#focusLineX')
              .attr('x1', mouseX)
              .attr('y1', y(0))
              .attr('x2', mouseX)
              .attr('y2', y(d3.max(data, function(d) {return d.maximum;})));
          focus.select('#focusLineY')
              .attr('x1', x(d3.extent(data, function(d) { return d.date; })[0]))
              .attr('y1', mouseY)
              .attr('x2', x(d3.extent(data, function(d) { return d.date; })[1]))
              .attr('y2', mouseY);
      });


  // ------------------PATH AND DOTS--------------------------------------------


  // Add line for maximum temperature.
  chart.append("path")
    .attr("class", "line")
    .attr("d", maxTempLine(data))
    .style("stroke", "orange");

  // Add line for average temperature
  chart.append("path")
    .attr("class", "line")
    .attr("d", avTempLine(data))
    .style("stroke", "grey");

  // Add line for minimum temperature
  chart.append("path")
    .attr("class", "line")
    .attr("d", minTempLine(data))
    .style("stroke", "steelblue");

  // Add dots for maximum temperature
  var dots = chart.append("g");
  dots.selectAll("lineDots")
    .data(data)
    .enter().append("circle")
      .attr("class", "lineDot")
      .attr("cx", function (d) { return x(d.date); } )
      .attr("cy", function (d) { return y(d.maximum); } )
      .attr("r", 5)
      .style("fill", "orange")
      // Shows and hides the tooltip
      .on("mouseover", tipMax.show)
      .on("mouseout", tipMax.hide);

  // Add dots for average temperature
  var dots2 = chart.append("g");
  dots2.selectAll("lineDots2")
    .data(data)
    .enter().append("circle")
      .attr("class", "lineDot")
      .attr("cx", function (d) { return x(d.date); } )
      .attr("cy", function (d) { return y(d.average); } )
      .attr("r", 5)
      .style("fill", "grey" )
      // Shows and hides the tooltip
      .on("mouseover", tipAv.show)
      .on("mouseout", tipAv.hide);

  // Add dots vor minimum temperature
  var dots3 = chart.append("g");
  dots3.selectAll("lineDots3")
    .data(data)
    .enter().append("circle")
      .attr("class", "lineDot")
      .attr("cx", function (d) { return x(d.date); } )
      .attr("cy", function (d) { return y(d.minimum); } )
      .attr("r", 5)
      .style("fill", "steelblue" )
      // Shows and hides the tooltip
      .on("mouseover", tipMin.show)
      .on("mouseout", tipMin.hide);




  //------------------------AXES------------------------------------------------

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
      .attr("y", -40)
      .attr("dy", ".71em")
      .style("font", "20px sans-serif")
      .style("text-anchor", "end")
      .text("Temperature (\xB0C)");
});

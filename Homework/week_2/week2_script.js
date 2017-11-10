
window.onload = function() {

var url = "https://raw.githubusercontent.com/Xlocsinjr/DataProcessing/master/Homework/week_2/KNMI_20161231.txt"
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


function main() {
// Splits the data into separate lines
var raw_data_split = raw_data.split("\n");


var dates = [];
var temperature = [];

var data_count = 0;

// Iterates through the lines to retrieve date and average temperature
for (var i = 0; i < raw_data_split.length; i++)
{
    // Retrieves a line of data
    var line = raw_data_split[i];

    // splits data at the ','
    var line_split = raw_data_split[i].split(",");

    // Turns the dates into javascript dates
    var date_raw = line_split[1];
    var date_string = [date_raw.slice(0, 4), date_raw.slice(4, 6), date_raw.slice(6)]
      .join("-");
    console.log(date_raw);
    date = new Date(date_string);

    // Turns the temperatures into floats with 1 decimal
    var temp_raw = line_split[2];
    var temp = parseInt(line_split[1]) * 0.1;
    temp = Math.round(temp * 10) / 10;

    // Stores the dates and temperature
    dates[data_count] = date;
    temperature[data_count] = temp;
    data_count++;
}
// console.log(dates);
// console.log(temperature);


// Set canvas and canvas size
var canvas = document.getElementById("canvas");
canvas.width = 1000;
canvas.height = 500;

// Magic numbers regarding pixel offset and scaling
var x_offset = 30;
var y_offset = 170;
var y_scale_factor = -5;
var days = 365;
var tick_arm = 2;

var context = canvas.getContext("2d");

// Universal scaling factor
context.scale(2.5, 2.5);

// Draws the graph line
context.beginPath();
context.strokeStyle = "blue"
context.moveTo(x_offset, temperature[0] * y_scale_factor + y_offset);
for (var i = 1; i < days; i++)
{
  context.lineTo(i + x_offset, temperature[i] * y_scale_factor + y_offset);
}
context.lineWidth = 0.5;
context.stroke();

// Draws the axes
context.beginPath();
context.strokeStyle = "black"
context.lineWidth = 1;
context.moveTo(x_offset, y_offset);
context.lineTo(days + x_offset, y_offset);

context.moveTo(x_offset, 30 * y_scale_factor + y_offset);
context.lineTo(x_offset, -5 * y_scale_factor + y_offset);
context.stroke();

// Draws lines through the graph for every 5 degrees celsius
context.beginPath();
context.strokeStyle = "gray"
context.lineWidth = 0.3;
for (var i = -1; i < 7; i++)
{
  context.moveTo(x_offset, 5 * i * y_scale_factor + y_offset);
  context.lineTo(days + x_offset, 5 * i * y_scale_factor + y_offset)
}
context.stroke();

// Labels Y-axis tick marks
for (var i = -1; i < 7; i++)
{
  context.font = '5pt "open sans", sans-serif';
  context.fillText(String(5 * i), x_offset - 10, 5 * i * y_scale_factor + y_offset);
}

// Labels Y-axis
context.fillText("Average temperature (degrees celsius)", x_offset - 20, y_offset - 160);

// Labels X-axis tick marks
context.beginPath();
for (var i = 0; i < days; i ++)
{
  var stringed_date = String(dates[i]);
  var split_date = stringed_date.split(" ");
  // Only labels the first days of the months
  if (split_date[2] == "01")
  {
    // Forms and draws a string for a date
    var text_string = [split_date[1], split_date[2], split_date[3]].join(" ");
    context.font = '3pt "open sans", sans-serif';
    context.fillText(text_string, x_offset + i, y_offset + 5)

    // Draws a tick
    context.moveTo(x_offset + i, y_offset - tick_arm);
    context.lineTo(x_offset + i, y_offset + tick_arm);
  }
}
// Line styling
context.strokeStyle = "black";
context.lineWidth = 0.8;

// Labels the X-axis
context.font = '5pt "open sans", sans-serif';
context.fillText("Date", x_offset + 340, y_offset + 12);
context.stroke();

// Adds title text
context.font = '7pt "open sans", sans-serif';
context.fillText("Average temperature in De Bilt", x_offset + 120, y_offset - 160);

}
}

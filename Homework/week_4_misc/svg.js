d3.xml("original_test.svg", "image/svg+xml", function(error, xml) {
    if (error) throw error;
    document.body.appendChild(xml.documentElement);
});

d3.select("body")
  .append("rect")
    .attr("x", 13)
    .attr("y", 138.7)
    .attr("width", 21)
    .attr("height", 29)

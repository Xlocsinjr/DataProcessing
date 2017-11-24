d3.xml("test.svg", "image/svg+xml", function(error, xml) {
    if (error) throw error;
    document.body.appendChild(xml.documentElement);

    // Fills in current colour boxes
    d3.select("#kleur1")
      .style("fill", "#ccece6");

    d3.select("#kleur2")
      .style("fill", "#99d8c9");

    d3.select("#kleur3")
      .style("fill", "#66c2a4");

    // Adds remaining colour boxes
    var colours = ["#41ae76", "#238b45", "#005824"];
    for (var i = 0; i < 3; i++) {
      d3.select("svg")
        .append("rect")
          .attr("x", 13)
          .attr("y", function() {return 138.7 + 40 * i;})
          .attr("width", 21)
          .attr("height", 29)
          .style("stroke", "#1E1E1C")
          .style("stroke-miterlimit", 10)
          .style("fill", colours[i]);
    }

    // Adds textboxes
    for (var i = 0; i < 2; i++) {
      d3.select("svg")
        .append("rect")
          .attr("x", 46.5)
          .attr("y", function() {return 178.7 + 40 * i;})
          .attr("width", 119.1)
          .attr("height", 29)
          .style("stroke", "#1E1E1C")
          .style("stroke-miterlimit", 10)
          .style("fill", "#FFFFFF");
    }

    // Adds text
    for (var i = 0; i < 6; i++) {
      d3.select("svg")
        .append("text")
          .attr("x", 50)
          .attr("y", function() {return 40 + 40 * i;})
          .text(String(Math.pow(10, i + 1)));
    }


});

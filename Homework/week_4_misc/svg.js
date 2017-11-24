d3.xml("test.svg", "image/svg+xml", function(error, xml) {
    if (error) throw error;
    document.body.appendChild(xml.documentElement);

    d3.select("#kleur1")
      .style("fill", "#ccece6");

    d3.select("#kleur2")
      .style("fill", "#99d8c9");

    d3.select("#kleur3")
      .style("fill", "#66c2a4");


    var kleur_count = 0;

    function y() {
      var y_val = 138.7 + 40 * kleur_count;
      kleur_count++;
      return y_val;
    };

    d3.select("svg")
      .append("rect")
        .attr("x", 13)
        .attr("y", y())
        .attr("width", 21)
        .attr("height", 29)
        .style("stroke", "#1E1E1C")
        .style("stroke-miterlimit", 10)
        .style("fill", "#41ae76")
      .append("rect")
        .attr("x", 13)
        .attr("y", y())
        .attr("width", 21)
        .attr("height", 29)
        .style("stroke", "#1E1E1C")
        .style("stroke-miterlimit", 10)
        .style("fill", "#41ae76")
      .append("rect")
        .attr("x", 13)
        .attr("y", y())
        .attr("width", 21)
        .attr("height", 29)
        .style("stroke", "#1E1E1C")
        .style("stroke-miterlimit", 10)
        .style("fill", "#41ae76");
});

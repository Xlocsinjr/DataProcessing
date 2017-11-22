d3.xml("original_test.svg", "image/svg+xml", function(error, xml) {
    if (error) throw error;
    document.body.appendChild(xml.documentElement);

    d3.select("svg")
      .append("rect")
        .attr
});

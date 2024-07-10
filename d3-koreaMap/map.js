$(document).ready(function() {
    
    const width = 800;
    const height = 1000;

    const svg = d3.select("#map").append("svg")
        .attr("width", width)
        .attr("height", height);

    const projection = d3.geoMercator()
        .center([127.7669, 35.9078])
        .scale(5000)
        .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    d3.json("./korea.json").then(function(data) {
        svg.selectAll("path")
            .data(data.features)
            .enter().append("path")
            .attr("class", "region")
            .attr("d", path)

            //지역 color 변경
            .on("mouseover", function(event, d) {
                d3.select(this).classed("highlighted", true);
            })
            .on("mouseout", function(event, d) {
                d3.select(this).classed("highlighted", false);
            })

            //click 시 경고창
            .on("click", function(event, d) {
                console.log(d.properties.name)
                alert(d.properties.name)
            });
    }).catch(function(error) {
        console.log(error);
    });
});
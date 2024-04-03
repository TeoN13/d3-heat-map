document.addEventListener("DOMContentLoaded", () => {
  fetch(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json").

  then(response => response.json()).
  then(data => {
    const minYear = d3.min(data["monthlyVariance"], d => d["year"]);
    const maxYear = d3.max(data["monthlyVariance"], d => d["year"]);
    const baseTemp = data["baseTemperature"];

    // Graph description
    d3.select("#description").html(
    `${minYear} - ${maxYear}: base temperature ${baseTemp}℃`);


    // Graph size
    const w = 1200;
    const h = 500;
    const padding = 50;

    const svg = d3.
    select("#container").
    append("svg").
    attr("id", "chart").
    attr("width", w).
    attr("height", h);

    // x axis will be years from data['monthlyVariance']['year'] -> it's type int
    // y axis will be month from data['monthlyVariance']['month'] -> it's type int

    const numYears = maxYear - minYear + 1;
    const rectangleWidth = w / numYears;

    const totalHeight = h - 2 * padding;
    const rectangleHeight = totalHeight / 12;
    /*
    const xScale = d3
      .scaleLinear()
      .domain([minYear, maxYear])
      .range([padding, w - padding]);
     const yScale = d3
      .scaleLinear()
      .domain([0, 12])
      .range([h - padding, padding]);
    */

    const xScale = d3.
    scaleBand().
    domain(
    Array.from({ length: maxYear - minYear + 1 }, (v, i) => minYear + i)).

    range([padding, w - padding]);

    const yScale = d3.
    scaleBand().
    domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]).
    range([h - padding, padding]);

    const months = {
      1: "January",
      2: "February",
      3: "March",
      4: "April",
      5: "May",
      6: "June",
      7: "July",
      8: "August",
      9: "September",
      10: "October",
      11: "November",
      12: "December" };


    function showTooltip(d) {
      d3.select("#tooltip") // position already set to absolute in css
      .style("display", "block") // show the #tooltip div
      .style("left", event.pageX + "px") // show it next to mouse
      .style("top", event.pageY + "px").
      attr("data-year", d["year"]).
      html(
      `${d["year"]} - ${months[d["month"]]}<br/>Temperature: ${
      baseTemp + d["variance"]
      }℃<br/>Variance: ${d["variance"]}℃`);

    }

    function hideTooltip() {
      d3.select("#tooltip").style("display", "none");
    }

    const xAxis = d3.
    axisBottom(xScale).
    tickValues(
    Array.from(
    { length: maxYear - minYear + 1 },
    (v, i) => minYear + i).
    filter(year => year % 10 === 0));


    const yAxis = d3.axisLeft(yScale).tickFormat(month => {
      if (month === 0) {
        return "";
      }
      return months[month];
    });

    svg.
    append("g").
    attr("id", "x-axis").
    attr("transform", `translate(0, ${h - padding})`).
    call(xAxis);

    svg.
    append("g").
    attr("id", "y-axis").
    attr("transform", `translate(${padding}, 0)`).
    call(yAxis);

    svg.
    selectAll("rect").
    data(data["monthlyVariance"]).
    enter().
    append("rect").
    attr("class", "cell").
    attr("data-month", d => d["month"] - 1).
    attr("data-year", d => d["year"]).
    attr("data-temp", d => baseTemp + d["variance"]).
    attr("x", d => xScale(d["year"])).
    attr("y", d => yScale(d["month"])).
    attr("height", rectangleHeight).
    attr("width", rectangleWidth).
    attr("fill", (d) =>
    baseTemp + d["variance"] >= baseTemp // 8.66
    ? ///////////////////////////
    // Is higher than base temp
    ///////////////////////////
    baseTemp + d["variance"] > 10 ?
    // Is higher than 10
    "#FFA726" :
    // Is lower than 10
    "#FFD54F" :
    //////////////////////////
    // Is lower than base temp
    //////////////////////////
    baseTemp + d["variance"] > 7 ?
    // Is higher than 7
    "#81C784" :
    // Is lower than 7
    "#29B6F6").

    on("mouseover", (event, d) => showTooltip(d)).
    on("mouseout", hideTooltip);

    ////////////////////////
    //        Legend       //
    ////////////////////////

    // also change fill attribute from .cell
    const legendDomain = ["<7℃", "< 8.66℃", ">= 8.66℃", "> 10℃"];
    const legendRange = ["#29B6F6", "#81C784", "#FFD54F", "#FFA726"];

    const legendColorHeight = 30;
    const legendWidth = 200;
    const legendHeight = 30;

    const legend = d3.
    select("#legend-container").
    append("svg").
    attr("id", "legend").
    attr("width", legendWidth).
    attr("height", legendHeight);

    legend.
    selectAll("rect").
    data(legendRange).
    enter().
    append("rect").
    attr("x", (d, i) => i * legendWidth / legendRange.length).
    attr("y", 0).
    attr("height", legendColorHeight).
    attr("width", legendWidth / legendRange.length).
    attr("fill", (d, i) => legendRange[i]);

    const legendScale = d3.
    scaleBand().
    domain(legendDomain).
    range([0, legendWidth]);

    const legendXAxis = d3.axisBottom(legendScale);
    legend.
    append("g").
    attr("id", "legend-x-axis").
    attr("transform", `translate(0, ${legendHeight})`).
    call(legendXAxis);
  });
});
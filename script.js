let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
let req = new XMLHttpRequest();

let baseTemperature;
let monthlyVariance;

// set up the dimension for the chart
const margin = { top: 60, right: 40, bottom: 60, left: 60}
const width = 1200 
const height = 600 

let canvas = d3.select("#canvas")
canvas.attr('width', width)
.attr('height', height)

let xScale;
let yScale;

let generateScales = () => {
    xScale = d3.scaleLinear()
                .range([margin.left, width - margin.left - margin.right])
    yScale = d3.scaleTime()
                .range([margin.left, height - margin.top - margin.bottom])            

}

let drawCells = () => {

    canvas.selectAll('rect')
            .data(monthlyVariance)
            .enter()
            .append('rect')
            .attr('class', 'cell')
            .attr('fill', (item) => {
                variance = item['variance']
                if (variance <= -1){
                    return 'SteelBlue'
                } else if (variance <= 0) {
                    return 'LightSteelBlue'
                } else if (variance <= 1) {
                    return 'Orange'
                }  else {
                    return 'Crimson'
                }
            })
            .attr('data-year', (item) => {
                return item
            })
            .attr('data-month', (item) => {
                return item
            })
            .attr('data-temp', (item) => {
                return item
            })

}

let drawAxes = () => {
    let xAxis = d3.axisBottom(xScale)
    let yAxis = d3.axisLeft(yScale)

    canvas.append('g')
            .call(xAxis)
            .attr('id', 'x-axis')
            .attr('transform', `translate(0, ${height - margin.top})`)

    canvas.append('g')
            .call(yAxis)
            .attr('id', 'y-axis')
            .attr('transform', `translate(${margin.left}, ${margin.top})`)

}


req.open('GET', url, true);
req.onload = () => {
    /*console.log(req.responseText);*/
    let object = JSON.parse(req.responseText); //turn json data into js data
    console.log(object);
    baseTemperature = object['baseTemperature'];
    monthlyVariance = object['monthlyVariance'];
    console.log(baseTemperature);
    console.log(monthlyVariance);

    generateScales();
    drawCells();
    drawAxes();
};
req.send();
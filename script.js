let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
let req = new XMLHttpRequest();

let baseTemperature;
let monthlyVariance =[];

// set up the dimension for the chart
const margin = { top: 60, right: 40, bottom: 60, left: 60}
const width = 1200 
const height = 600 

let canvas = d3.select("#canvas")
canvas.attr('width', width)
        .attr('height', height)

let tooltip = d3.select('#tooltip')


let xScale;
let yScale;

let minYear;
let maxYear;
let numerOfYears = maxYear - minYear;

let generateScales = () => {

    minYear=d3.min(monthlyVariance, (item) => {
        return item['year']
    })
    maxYear=d3.max(monthlyVariance, (item) => {
        return item['year']
    })
    xScale = d3.scaleLinear()
                .domain([minYear, maxYear + 1 ]) 
                .range([margin.left, width - margin.left - margin.right])
    yScale = d3.scaleTime()
                .domain([new Date(0, 0, 0), new Date(0 ,12 ,0)]) //from january to december
                .range([margin.left, height - margin.top])            

}

let drawCells = () => {

    canvas.selectAll('rect')
            .data(monthlyVariance)
            .enter()
            .append('rect')
            .attr('class', 'cell')
            .attr('fill', (item) => {
                variance = item['variance']
                if (variance <= -3){
                    return 'rgb(69, 117, 180)'
                } else if (variance <= -2) {
                    return 'rgb(116, 173, 209)'
                } else if (variance <= -1) {
                    return 'rgb(171, 217, 233)'
                }  else if (variance <= 0){
                    return 'rgb(224, 243, 248)'
                } else if (variance <= 1){
                    return 'rgb(255, 255, 191)'
                } else if (variance <= 2){
                    return 'rgb(254, 224, 144)'
                } else if (variance <= 3) {
                    return 'rgb(244, 109, 67)'
                } else{
                    return 'rgb(215, 48, 39)'
                }
            })
            .attr('data-year', (item) => {
                return item['year']
            })
            .attr('data-month', (item) => {
                return item['month'] - 1 //js month start from 0 to 11
            })
            .attr('data-temp', (item) => {
                return baseTemperature + item['variance']
            })
            .attr('height', (height - margin.top - margin.bottom)/12)
            .attr('y', (item) => {
                return yScale(new Date(0, item['month']-1, 0))
            })
            .attr('x', (item) => {
                return xScale(item['year'])
            })
            .attr('width', (item) => {
                numerOfYears = maxYear - minYear;
                return (width - margin.left - margin.right) / numerOfYears;
            })
            .on("mouseover", function() {
                //make sure item is properly bound to the event listener
                //use [0] to access the first (and in this case, the only) element in the array of data associated with the rect element.
                let item = d3.select(this).data()[0]; 
                console.log('year', item['year'])
               
                tooltip.transition()
                        .style('visibility', 'visible')

                let monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                tooltip.text(item['year'] + ' ' + monthName[item['month'] - 1 ] + ': ' + (baseTemperature + item['variance']) + '℃ ( variance of ' + item['variance'] + ')')
                tooltip.attr('data-year', item['year'])

                //highlight the rect when hovering on it
                d3.select(this)
                    .style("stroke", "black")
                    .style("stroke-width", 1);
            })
            .on("mouseout", function() {
                tooltip.transition()
                        .style('visibility', 'hidden')
                
                d3.select(this)
                        .style("stroke", "none")
            })

            
           
}

let drawAxes = () => {

    let xAxis = d3.axisBottom(xScale)
                    .tickFormat(d3.format('d')) //show the year as integer

    let yAxis = d3.axisLeft(yScale)
                    .tickFormat(d3.timeFormat('%B')) //display full month name

    canvas.append('g')
            .call(xAxis)
            .attr('id', 'x-axis')
            .attr('transform', `translate(0, ${height - margin.top})`)


    canvas.append('g')
            .call(yAxis)
            .attr('id', 'y-axis')
            .attr('transform', `translate(${margin.left}, 0)`)

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
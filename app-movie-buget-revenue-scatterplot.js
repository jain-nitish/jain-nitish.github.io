// Tooltip handler.
function mouseover_budget_revenue_scatterplot() {
   // Get data.
   const scatterData = d3.select(this).data()[0];

   const bodyData = [
     ['Budget', formatTicks(scatterData.budget)],
     ['Revenue', formatTicks(scatterData.revenue)],
     ['TMDb Popularity', Math.round(scatterData.popularity)],
     ['IMDb Rating', scatterData.vote_average],
     ['Profitability', formatTicks(scatterData.profitability)],
     ['Genre', scatterData.genre],
   ];
 
   // Build tip.
   const tip = d3.select('.tooltip');
 
   tip
     .style('left', `${d3.event.clientX + 15}px`)
     .style('top', `${d3.event.clientY}px`)
     .transition()
     .style('opacity', 0.98);
 
   tip.select('h3').html(`${scatterData.title}, ${scatterData.release_year}`);
   tip.select('h4').html(`${scatterData.tagline}, ${scatterData.runtime} min.`);
 
   d3.select('.tip-body')
     .selectAll('p')
     .data(bodyData)
     .join('p')
     .attr('class', 'tip-info')
     .html(d => `${d[0]}: ${d[1]}`);
  }
  
  function mousemove_budget_revenue_scatterplot() {
    d3.select('.tooltip')
      .style('left', `${d3.event.clientX + 15}px`)
      .style('top', `${d3.event.clientY}px`);
  }
  
  function mouseout_budget_revenue_scatterplot() {
    d3.select('.tooltip')
      .transition()
      .style('opacity', 0);
  }

function prepareScatterData(data) {
    return data.sort((a, b) => b.budget - a.budget).filter((d, i) => i < 100);
}

function addLabel(axis, label, x) {
    axis
        .select('.tick:last-of-type text')
        .clone()
        .text(label)
        .attr('x', x)
        .style('text-anchor', 'start')
        .style('font-weight', 'bold')
        .style('fill', '#555');
}

// Main function.
function render_bugdet_revenue_scatter(movies) {
    // Data prep.
    const moviesClean = filterData(movies);
    const scatterData = prepareScatterData(moviesClean);

    // Dimensions.
    const margin = { top: 80, right: 40, bottom: 40, left: 60 };
    const chartWidth = 720,
    chartHeight = 720;
  
    const width = chartWidth - margin.right - margin.left;
    const height = chartHeight - margin.top - margin.bottom;

    // Scales.
    const xExtent = d3
        .extent(scatterData, d => d.budget)
        .map((d, i) => (i === 0 ? d * 0.95 : d * 1.05));

    const xScale = d3
        .scaleLinear()
        .domain(xExtent)
        .range([0, width]);

    const yExtent = d3
        .extent(scatterData, d => d.revenue)
        .map((d, i) => (i === 0 ? d * 0.1 : d * 1.1));

    const yScale = d3
        .scaleLinear()
        .domain(yExtent)
        .range([height, 0]);

    var rScale = function (d) { return 3 + d.profitability; };

    // Draw base.
    const svg = d3
        .select('.scatter-plot-container')
        .append('svg')
        .attr('width', width + margin.right + margin.left)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Draw header.
    const header = svg
        .append('g')
        .attr('class', 'scatter-header')
        .attr('transform', `translate(0,${-margin.top * 0.6})`)
        .append('text');

    header.append('tspan').text('Budget vs. Revenue in $US');

    header
        .append('tspan')
        .attr('x', 0)
        .attr('dy', '1.5em')
        .style('font-size', '0.8em')
        .style('color','white')
        .style('fill', '#555')
        .text('Based on movies with revnue and budget(in $US) between 2007-2016');

    // Draw x axis.
    const xAxis = d3
        .axisBottom(xScale)
        .ticks(5)
        .tickFormat(formatTicks)
        .tickSizeInner(-height)
        .tickSizeOuter(0);

    const xAxisDraw = svg
        .append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0, ${height})`)
        .call(xAxis)
        .call(addLabel, 'Budget', 25);

    xAxisDraw.selectAll('text').attr('dy', '1em');

    // Draw y axis.
    const yAxis = d3
        .axisLeft(yScale)
        .ticks(5)
        .tickFormat(formatTicks)
        .tickSizeInner(-width)
        .tickSizeOuter(0);

    const yAxisDraw = svg
        .append('g')
        .attr('class', 'y axis')
        .call(yAxis)
        .call(addLabel, 'Revenue', 5);

    // Draw scatter.
    svg
        .append('g')
        .attr('class', 'scatter-points')
        .selectAll('.scatter')
        .data(scatterData)
        .enter()
        .append('circle')
        .attr('class', 'scatter')
        .attr('cx', d => xScale(d.budget))
        .attr('cy', d => yScale(d.revenue))
        .attr('r', function (d) { return rScale(d); })
        .style('fill', 'dodgerblue')
        .style('fill-opacity', 0.7)
        .on('mouseover', mouseover_budget_revenue_scatterplot)
        .on('mousemove', mousemove_budget_revenue_scatterplot)
        .on('mouseout', mouseout_budget_revenue_scatterplot);
}
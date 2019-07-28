// Tooltip handler.
function mouseover_budget_revenue_lc() {
  // Get data.
  const lineData = d3.select(this).data()[0];
  const tip = d3.select('.tooltip-lc');

  tip.style('left', `${d3.event.clientX + 15}px`)
      .style('top', `${d3.event.clientY}px`)
      .transition()
      .style('opacity', 0.98);

  tip.select('h3').html(`${lineData.date.getFullYear()}, ${formatTicks(lineData.value)}`);
}

function mousemove_budget_revenue_lc() {
  d3.select('.tooltip-lc')
    .style('left', `${d3.event.clientX + 15}px`)
    .style('top', `${d3.event.clientY}px`);
}

function mouseout_budget_revenue_lc() {
  d3.select('.tooltip-lc')
    .transition()
    .style('opacity', 0);
}


function prepareLineChartDataForGrossRevenueYearly(data) {
    // Group by year and extract revenue and budget.
    const revenueMap = d3.nest()
                        .key(d => d.release_year)
                        .rollup(v => d3.mean(v, leaf => leaf.revenue))
                        .entries(data);

    const budgetMap = d3.nest()
                        .key(d => d.release_year)
                        .rollup(v => d3.mean(v, leaf => leaf.budget))
                        .entries(data);

    // Convert rolled up maps to to arrays.
    const revenue = Array.from(revenueMap).sort((a, b) => a.key - b.key);
    const budget = Array.from(budgetMap).sort((a, b) => a.key - b.key);

    // Get an array of years our x scale and axis.
    const parseYear = d3.timeParse('%Y');
    const dates = revenue.map(d => parseYear(d.key));

    // get the maximum y value for the y scale and axis.
    // Combine the array
    const yValues = [
      ...Array.from(revenueMap.values()),
      ...Array.from(budgetMap.values())
    ];
    const yMax = d3.max(yValues, d=> d.value);

    // Produce final data object.
    const lineData = {
      series: [
        {
          name: 'Revenue',
          color: 'dodgerblue',
          values: revenue.map(d => ({ date: parseYear(d.key), value: d.value })),
        },
        {
          name: 'Budget',
          color: 'darkorange',
          values: budget.map(d => ({ date: parseYear(d.key), value: d.value })),
        }
      ],
      dates: dates,
      yMax: yMax,
    };

    return lineData;
}

// Main function.
function render_yearly_budget_revenue_linechart(movies) {
  // Data prep.
  const moviesClean = filterData(movies);
  const lineChartData = prepareLineChartDataForGrossRevenueYearly(moviesClean);

  // Dimensions.
  const chartWidth = 700,
  chartHeight = 600;

  const margin = { top: 80, right: 60, bottom: 40, left: 60 };
  const width = chartWidth - margin.right - margin.left;
  const height = chartHeight - margin.top - margin.bottom;

  // Scale data.
  const xScale = d3
    .scaleTime()
    .domain(d3.extent(lineChartData.dates))
    .range([0, width]);

  const yScale = d3
    .scaleLinear()
    .domain([0, lineChartData.yMax])
    .range([height, 0]);

  // Line generator.
  const lineGen = d3
    .line()
    .x(d => xScale(d.date))
    .y(d => yScale(d.value));

  // Draw base.
  const svg = d3
    .select('.yearly-bugdet-revenue-line-chart-container')
    .append('svg')
    .attr('width', width + margin.right + margin.left)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  // Draw x axis.
  const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);

  const xAxisDraw = svg
    .append('g')
    .attr('transform', `translate(0, ${height})`)
    .attr('class', 'x axis')
    .call(xAxis);

  // Draw y axis.
  const yAxis = d3
    .axisLeft(yScale)
    .ticks(5)
    .tickFormat(formatTicks)
    .tickSizeOuter(0)
    .tickSizeInner(-width);

  const yAxisDraw = svg
    .append('g')
    .attr('class', 'y axis')
    .call(yAxis);

  // Group chart elements.
  const chartGroup = svg.append('g').attr('class', 'line-chart');

  // Draw lines.
  chartGroup
    .selectAll('.line-series')
    .data(lineChartData.series)
    .enter()
    .append('path')
    .attr('class', d => `line-series ${d.name.toLowerCase()}`)
    .attr('d', d => lineGen(d.values))
    .style('fill', 'none')
    .style('stroke', d => d.color);

  // Add series label
  chartGroup
    .append('g')
    .attr('class', 'series-labels')
    .selectAll('.series-label')
    .data(lineChartData.series)
    .enter()
    .append('text')
    .attr('x', d => xScale(d.values[d.values.length - 1].date) + 5)
    .attr('y', d => yScale(d.values[d.values.length - 1].value))
    .text(d => d.name)
    .style('dominant-baseline', 'central')
    .style('font-size', '0.7em')
    .style('font-weight', 'bold')
    .style('fill', d => d.color);

    // Add tooltip interactions
  chartGroup
    .append('g')
    .attr('class', 'series-points revenue')
    .selectAll('.series-points')
    .data(lineChartData.series[0].values)
    .enter()
    .append('circle')
    .attr("r", 3.5)
    .attr('cx', (d,i) => xScale(d.date))
    .attr('cy', (d,i) => yScale(d.value))
    .style('fill', "orange")
    .on('mouseover', mouseover_budget_revenue_lc)
    .on('mousemove', mousemove_budget_revenue_lc)
    .on('mouseout', mouseout_budget_revenue_lc);

    chartGroup
    .append('g')
    .attr('class', 'series-points budget')
    .selectAll('.series-points')
    .data(lineChartData.series[1].values)
    .enter()
    .append('circle')
    .attr("r", 3.5)
    .attr('cx', (d,i) => xScale(d.date))
    .attr('cy', (d,i) => yScale(d.value))
    .style('fill', "orange")
    .on('mouseover', mouseover_budget_revenue_lc)
    .on('mousemove', mousemove_budget_revenue_lc)
    .on('mouseout', mouseout_budget_revenue_lc);

  // Draw header.
  const header = svg
    .append('g')
    .attr('class', 'line-chart-header')
    .attr('transform', `translate(0,${-margin.top * 0.6})`)
    .append('text');

  header.append('tspan').text('Budget and revenue over time in $US');

  header.append('tspan')
    .attr('x', 0)
    .attr('dy', '1.5em')
    .style('font-size', '0.8em')
    .style('fill', '#555')
    .text('Films w/ budget and revenue figures beween 2007-2016');

}
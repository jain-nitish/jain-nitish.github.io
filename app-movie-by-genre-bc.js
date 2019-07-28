// Tooltip handler.
function mouseover_movies_by_genre_bar() {
  // Get data.
  const barData = d3.select(this).data()[0];

  var bodyData;
  if(barData.movie_count_per_genre != null){
    bodyData = [
      ['#Movies', barData.movie_count_per_genre],
    ];  
  }else{
    bodyData = [
      ['Profitability', formatTicks(barData.mean_profitability_per_genre)],
    ];
  }

  // Build tip.
  const tip = d3.select('.tooltip');

  tip
    .style('left', `${d3.event.clientX + 15}px`)
    .style('top', `${d3.event.clientY}px`)
    .transition()
    .style('opacity', 0.98);

  tip.select('h3').html(`Genre: ${barData.genre}`);
  // tip.select('h4').html(`${barData.tagline}, ${barData.runtime} min.`);

  d3.select('.tip-body')
    .selectAll('p')
    .data(bodyData)
    .join('p')
    .attr('class', 'tip-info')
    .html(d => `${d[0]}: ${d[1]}`);
}

function mousemove_movies_by_genre_bar() {
  d3.select('.tooltip')
    .style('left', `${d3.event.clientX + 15}px`)
    .style('top', `${d3.event.clientY}px`);
}

function mouseout_movies_by_genre_bar() {
  d3.select('.tooltip')
    .transition()
    .style('opacity', 0);
}

function prepareMovieCountByGenreBarChartData1(data) {
  const dataMap = d3.nest()
    .key(d => d.genre)
    .rollup(v => +v.length)
    .entries(data);

  const dataArray = Array.from(dataMap, d => ({
    genre: d.key,
    movie_count_per_genre: d.value,
  }));

  const barChartData = dataArray.sort((a, b) => d3.descending(a.movie_count_per_genre, b.movie_count_per_genre));
  return barChartData;
}

function prepareMeanProfitabilityByGenreBarChartData1(data) {
  const dataMap = d3.nest()
  .key(d => d.genre)
  .rollup(v => d3.mean(v, leaf => leaf.profitability))
  .entries(data);

  const dataArray = Array.from(dataMap, d => ({
    genre: d.key,
    mean_profitability_per_genre: d.value,
  }));

  const barChartData = dataArray.sort((a, b) => d3.descending(a.mean_profitability_per_genre, b.mean_profitability_per_genre));
  return barChartData;
}

// Main function.
function render_moviecount_by_genre_bar_chart(movies) {
  let metric = 'movie_count_per_genre';

  // Data prep.
  const moviesClean = filterData(movies);

  // Click handler.
  function metric_by_genre_bc_click() {
    metric = this.dataset.name;

    d3.select("#btnProfitableGenres").classed("on", false);
    d3.select("#btnPopularGenres").classed("on", false);
    d3.select(this).classed("on", true);
  
    var barChartData;
    if (metric == 'movie_count_per_genre') {
      barChartData = prepareMovieCountByGenreBarChartData1(moviesClean);
    } 
    else if (metric == 'mean_profitability_per_genre') {
      barChartData = prepareMeanProfitabilityByGenreBarChartData1(moviesClean);
    }

    metric_by_genre_bc_update(barChartData);
  }

  // General Update Pattern.
  function metric_by_genre_bc_update(data) {
    // Update scales.
    const xMax = d3.max(data, d => d[metric]);
    xScale.domain([0, xMax]);
    yScale.domain(data.map(d => d.genre));

    // Set up transition.
    const dur = 1000;
    const t = d3.transition().duration(dur);

    // Update bars.
    bars
      .selectAll('.bar')
      .data(data, d => d.genre) // this is needed so d3 can compare one item from other
      .join(
        enter => { //inside a closure because the starting point is outside of axis range
          enter
            .append('rect')
            .attr('class', 'bar')
            .attr('y', d => yScale(d.genre))
            .attr('height', yScale.bandwidth())
            .style('fill', 'lightcyan')
            .transition(t)
            .delay((d, i) => i * 20) // transition between items have a lag
            .attr('width', d => xScale(d[metric]))
            .style('fill', 'dodgerblue');
        },

        update => {
          update
            .transition(t)
            .delay((d, i) => i * 20)
            .attr('y', d => yScale(d.genre))
            .attr('width', d => xScale(d[metric]));
        },

        exit => {
          exit
            .transition()
            .duration(dur / 2)
            .style('fill-opacity', 0) //opacity of 0 indicates item hiding
            .remove();
        }
      );

    // Update Axes.
    xAxisDraw.transition(t).call(xAxis.scale(xScale));
    yAxisDraw.transition(t).call(yAxis.scale(yScale));

    yAxisDraw.selectAll('text').attr('dx', '-0.6em');

    // Update header.
    headline.text(`${metric === 'movie_count_per_genre' ? '# Movies' : 'Profitability'} by Genre`);

    // Tooltip interaction.
    d3.select(".movie-by-genre-bar-chart-container").selectAll('.bar')
    .on('mouseover', mouseover_movies_by_genre_bar)
    .on('mousemove', mousemove_movies_by_genre_bar)
    .on('mouseout', mouseout_movies_by_genre_bar);
  }

  // Margin convention.
  const margin = { top: 80, right: 40, bottom: 40, left: 110 };
  const chartWidth = 760,
    chartHeight = 600;

  const width = chartWidth - margin.right - margin.left;
  const height = chartHeight - margin.top - margin.bottom;

  // Scales (Without domain, because they will change with update)
  const xScale = d3.scaleSymlog()
                    .range([0, width]);

  const yScale = d3.scaleBand()
                    .rangeRound([0, height])
                    .paddingInner(0.25);

  // Draw base.
  const svg = d3.select('.movie-by-genre-bar-chart-container')
                .append('svg')
                .attr('width', width + margin.right + margin.left)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', `translate(${margin.left}, ${margin.top})`);

  // Draw header.
  const header = svg.append('g')
                    .attr('class', 'bar-header')
                    .attr('transform', `translate(0,${-margin.top * 0.6})`)
                    .append('text');

  const headline = header.append('tspan');

  header.append('tspan')
        .attr('x', 0)
        .attr('dy', '1.5em')
        .style('font-size', '0.8em')
        .style('fill', '#555')
        .text('Based on movies between 2007-2016');

  // Draw Bars.
  const bars = svg.append('g').attr('class', 'bars');

  // Draw x axis.
  const xAxis = d3.axisTop(xScale)
                  .ticks(3)
                  .tickFormat(formatTicks)
                  .tickSizeInner(-height)
                  .tickSizeOuter(0);
  const xAxisDraw = svg.append('g').attr('class', 'x axis').call(xAxis);

  // Draw y axis.
  const yAxis = d3.axisLeft(yScale).tickSize(0);
  const yAxisDraw = svg.append('g')
                      .attr('class', 'y axis');

  // Initial bar render.
  const initialData = prepareMovieCountByGenreBarChartData1(moviesClean);
  metric_by_genre_bc_update(initialData);

  // Listen to click events.
  d3.select('#dvGenreCharts').selectAll('button').on('click', metric_by_genre_bc_click);
}


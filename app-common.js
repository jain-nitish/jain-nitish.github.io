// Type conversion
const parseDate = string => d3.utcParse('%Y-%m-%d')(string);
const parseNA = string => (string === 'NA' ? undefined : string);

function type(d) {
  const date = parseDate(d.release_date);
  const profitability = (d.revenue > 0 ? ((d.revenue - d.budget) / d.budget) : -1);
  const profitability_bucket = p => {
    if (p < 1) return "notprofitable";
    else if (p <= 3) return "profitable"
    else if (p <= 10) return "veryprofitable"
    else return "extremelyprofitable"
  };

  const budget_bucket = b => {
    if (b < 500000) return "0-5M";
    else if (b <= 5000000) return "5-50M"
    else if (b <= 15000000) return "50-150M"
    else return ">150M"
  };

  return {
    budget: +d.budget,
    genres: JSON.parse(d.genres.replace(/'/g, '"')).map(d => d.name),
    genre: JSON.parse(d.genres.replace(/'/g, '"')).map(d => d.name)[0],
    homepage: parseNA(d.homepage),
    id: +d.id,
    imdb_id: parseNA(d.imdb_id),
    original_language: parseNA(d.original_language),
    overview: parseNA(d.overview),
    popularity: +d.popularity,
    poster_path: parseNA(d.poster_path),
    //production_countries: JSON.parse(d.production_countries.replace(/'/g, '"')),
    release_date: date,
    release_year: date != null ? date.getFullYear() : 0000,
    revenue: +d.revenue,
    runtime: +d.runtime,
    tagline: parseNA(d.tagline),
    title: parseNA(d.title),
    vote_average: +d.vote_average,
    vote_count: +d.vote_count,
    profitability: profitability,
    profitability_bucket: profitability_bucket(profitability),
    budget_bucket: budget_bucket(d.budget)
  };
}


// Drawing utilities.
function formatTicks(d) {
  return d3
    .format('.2~s')(d)
    .replace('M', ' mil')
    .replace('G', ' bil')
    .replace('T', ' tril');
}

function cutText(string) {
  return string.length < 30 ? string : string.substring(0, 35) + '...';
}

// Data utilities,
function filterData(data) {
  return data.filter(d => {
    return (
      d.release_year >= 2007 &&
      d.release_year <= 2016 &&
      d.revenue > 0 &&
      d.budget > 0 &&
      d.genre &&
      d.title
    );
  });
}

// Load data (Move metadata loaded from the movies dataset)
// https://www.kaggle.com/rounakbanik/the-movies-dataset/version/7
d3.csv('data/movies_metadata.csv', type).then(res => {
  render_moviecount_by_genre_bar_chart(res);
  render_yearly_movies_profitability_linechart(res);
  render_yearly_budget_revenue_linechart(res);
  render_bugdet_revenue_scatter(res);
  render_top_movies_barchart(res);
});
# jain-nitish.github.io

Visit https://jain-nitish.github.io/index.html 

This narrative visualization uses the Interactive Slideshow approach to take you through a visual journey of the movie market from 2007 to 2016.

The Dataset
The movie metadata dataset was acquired from Kaggle. These dataset contains metadata for all 45,000 movies listed in the Full MovieLens Dataset. The dataset consists of movies released on or before July 2017. Data points include cast, crew, plot keywords, budget, revenue, posters, release dates, languages, production companies, countries, TMDB vote counts and vote averages. The dataset also has files containing 26 million ratings from 270,000 users for all 45,000 movies. Ratings are on a scale of 1-5 and have been obtained from the official GroupLens website.

Scenes
A consistent and cohensive template was built using CSS layout and FullPage.js to set up the scenes for this visual story. Scene transition follows an intuitive approach of sliding up and down via mouse wheel, touch or key-up/down. Slide navigator, along with tool-tip located at the right side of each slide provides a good navigation visual cue. It also acts as a trigger allowing readers to jump to a specific slide.

Annotations
Annotations were used to show the sku in profitability that happend because of a few externemly profitable movies. These call-outs effectively paint a concise picture of the profitability in the last many years.

Tooltips & Visual Aids
Readers can hover over the all line, bar and scatter plot charts to bring up the data-label tooltip to inspect the attributes specific to that data point. Axes of all line charts were clearly labeled and logarithmic scale was used whereever appropriate.

Parameters
Popularity, Profitability, Count of Movies, Budget and Reveue are used as parameter for filering and shaping the data within the charts. Visual aids such as transitioning are used to let user easily absorb data clues. For example, using transitions, it is easier for user to understand that most popular genre is not same as most profitable genre.

Triggers
As noted above, buttons were used on both set of bar charts to trigger the display of a proper chart. Data tooltips appear upon mouse over event on all the charts. The slide navigator also serves as the trigger allowing readers to jump to a specific slide.

// Selection
const searchForm = document.querySelector('#search-form');
const moviesContainer = document.querySelector('#movies-container > .row');
// URL
const moviesAPI = 'http://www.omdbapi.com/'

// EventListener
searchForm.addEventListener('submit', async function(evt) {
  // Prevent the default behavior
  evt.preventDefault();
  // Remove the previous search results
  removeAllChild(moviesContainer);
  // --- Get the movie title from the search form
  const movieTitle = searchForm.elements['movie-title'].value;
  // --- Get the movies response ---
  const res = await getMoviesData(moviesAPI, movieTitle);
  const moviesCount = parseInt(res.totalResults);
  console.log(moviesCount);
  const maxPagesCount = Math.floor(moviesCount / 10) + 1;
  const targetPagesCount = (maxPagesCount < 6) ? maxPagesCount : 6;
  // --- Get the movies data ---
  for (let page = 1; page <= targetPagesCount; page++) {
    const moviesData = (await getMoviesData(moviesAPI, movieTitle, page)).Search;
    // --- Display the data ---
    displayMovies(moviesData);
  }
})

async function getMoviesData(url, title, page) {
  config = {
    params: {
      apikey: 'thewdb',
      s: title,
      page: page
    }
  }
  const res = await axios.get(url, config);
  return res.data
}

function displayMovies(moviesData) {
  for (let movieData of moviesData) {
    const movieDiv = createMovieDiv(movieData);
    moviesContainer.append(movieDiv);
  }
}

function createMovieDiv(movieData) {
  // Get the properties
  const movie = {
    title: movieData.Title,
    year: movieData.Year,
    poster: movieData.Poster
  }
  // Create div.col
  const movieDiv = document.createElement('div');
  movieDiv.classList.add('col-6', 'col-md-3', 'col-xl-2');
  // Create div.card and append to the div.col
  const movieCard = document.createElement('div');
  movieCard.classList.add('card');
  movieDiv.append(movieCard);
  // Create the image and append to the div.card
  const img = document.createElement('img');
  img.src = movie.poster;
  img.classList.add('card-img-top');
  movieCard.append(img); 
  // Create the div.card-body and append to the div.card
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  movieCard.append(cardBody);
  // Create the h5.card-title/hr/p.card-text and append to the div.card-body
  const cardTitle = document.createElement('h5');
  cardTitle.classList.add('card-title');
  cardTitle.innerText = movie.title;
  cardBody.append(cardTitle)
  const hr = document.createElement('hr');
  cardBody.append(hr);
  const cardText = document.createElement('p');
  cardText.classList.add('card-text');
  cardText.innerText = movie.year;
  cardBody.append(cardText);

  return movieDiv
}

function removeAllChild(parentElement) {
  while (parentElement.firstChild) {
    parentElement.removeChild(parentElement.firstChild);
  }
}
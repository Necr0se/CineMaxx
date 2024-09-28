const KEY = "a63d6bbd95df92f98b90b62445b3160a";
const API_URL = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${KEY}&page=1`;
const IMG_PATH = "https://image.tmdb.org/t/p/w1280";
const SEARCH_API = `https://api.themoviedb.org/3/search/movie?api_key=${KEY}&query=`;

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");

const BASE_URL = `https://api.themoviedb.org/3/movie`;
const FILTER_URLS = {
    popular: `${BASE_URL}/popular?api_key=${KEY}`,
    now_playing: `${BASE_URL}/now_playing?api_key=${KEY}`,
    top_rated: `${BASE_URL}/top_rated?api_key=${KEY}`,
    upcoming: `${BASE_URL}/upcoming?api_key=${KEY}`
};

const movieFilter = document.getElementById("movieFilter");

movieFilter.addEventListener("change", () => {
    const selectedFilter = movieFilter.value;
    const filterURL = FILTER_URLS[selectedFilter];
    getMovies(filterURL);
});

const getClassByRate = (vote) => {
  if (vote >= 7.5) return "green";
  else if (vote >= 7) return "orange";
  else return "red";
};

const modal = document.getElementById("modal");
const modalBody = document.getElementById("modal-body");
const closeModal = document.getElementById("close");

const showMovieDetails = async (movieId) => {
  const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${KEY}`);
  const movie = await res.json();
  modalBody.innerHTML = `
    <h2>${movie.title}</h2>
    <p><strong>Release Date:</strong> ${movie.release_date}</p>
    <p><strong>Overview:</strong> ${movie.overview}</p>
    <p><strong>Genres:</strong> ${movie.genres.map(g => g.name).join(', ')}</p>
  `;
  modal.style.display = "block";
};

closeModal.onclick = () => modal.style.display = "none";
window.onclick = (event) => {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

const genreFilter = document.getElementById("genreFilter");

const getGenres = async () => {
  const res = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${KEY}`);
  const data = await res.json();
  data.genres.forEach(genre => {
    const option = document.createElement("option");
    option.value = genre.id;
    option.textContent = genre.name;
    genreFilter.appendChild(option);
  });
};

genreFilter.addEventListener("change", () => {
  const selectedGenre = genreFilter.value;
  const genreURL = selectedGenre
    ? `https://api.themoviedb.org/3/discover/movie?with_genres=${selectedGenre}&api_key=${KEY}&sort_by=popularity.desc`
    : API_URL;
  getMovies(genreURL);
});

getGenres();

const showMovies = (movies) => {
  main.innerHTML = "";
  movies.forEach((movie) => {
    const { title, poster_path, vote_average, overview, id } = movie;
    const movieElement = document.createElement("div");
    movieElement.classList.add("movie");
    movieElement.innerHTML = `
    <img src="${IMG_PATH + poster_path}" alt="${title}" />
    <div class="movie-info">
      <h3>${title}</h3>
      <span class="${getClassByRate(vote_average)}">${vote_average}</span>
    </div>
    <div class="overview">
      <h3>Overview</h3>
      ${overview}
    </div>
  `;
    movieElement.addEventListener('click', () => showMovieDetails(id));
    main.appendChild(movieElement);
  });
};


let currentPage = 1;
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const pageNum = document.getElementById("pageNum");

const getMovies = async (url, page = 1) => {
    const res = await fetch(`${url}&page=${page}`);
    const data = await res.json();
    showMovies(data.results);
    pageNum.textContent = `Page ${page}`;
};

prevButton.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    getMovies(API_URL, currentPage);
  }
});

nextButton.addEventListener("click", () => {
  currentPage++;
  getMovies(API_URL, currentPage);
});


getMovies(API_URL);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchTerm = search.value;
  if (searchTerm && searchTerm !== "") {
    getMovies(SEARCH_API + searchTerm);
    search.value = "";
  } else history.go(0);
});
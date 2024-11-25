const API_KEY = "3fd2be6f0c70a2a598f084ddfb75487c";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_PATH = "https://image.tmdb.org/t/p/w1280";

const movieDetails = document.getElementById("movie-details");

// Get movie ID from URL
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get("id");

// Gelen tüm veriyi getir fonksiyonu
async function getMovieDetails(id) {
  try {
    const res = await fetch(
      `${BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=videos,credits`
    );
    if (!res.ok) throw new Error("Film detayları alınamadı.");
    const movie = await res.json();
    console.log(movie); // Gelen tüm veriyi kontrol edin
    displayMovieDetails(movie);
  } catch (error) {
    console.error(error);
    movieDetails.innerHTML = `<p>Film detayları yüklenemedi. Lütfen tekrar deneyin.</p>`;
  }
}

// Fetch and display movie details
function displayMovieDetails(movie) {
  const {
    title,
    poster_path,
    overview,
    vote_average,
    release_date,
    genres,
    videos,
    credits,
  } = movie;

  // Türleri Listele
  const genresList = genres
    .map((genre) => `<span>${genre.name}</span>`)
    .join("");

  // Fragman URL'si (Varsa)
  const trailer = videos.results.find((video) => video.type === "Trailer");
  const trailerUrl = trailer
    ? `https://www.youtube.com/watch?v=${trailer.key}`
    : null;

  // Oyuncular (İlk 5)
  const castList = credits.cast
    .slice(0, 5)
    .map((cast) => cast.name)
    .join(", ");

  movieDetails.innerHTML = `
    <img src="${IMG_PATH + poster_path}" alt="${title}" />
    <div class="movie-info">
      <h2>${title}</h2>
      <p class="rating">⭐ ${vote_average}</p>
      <p class="release-date"><strong>Release Date:</strong> ${release_date}</p>
      <p class="genres"><strong>Genres:</strong> ${genresList}</p>
      <p>${overview}</p>
      ${
        trailerUrl
          ? `<a href="${trailerUrl}" target="_blank" class="trailer-btn">🎬 Watch Trailer</a>`
          : ""
      }
      <p class="cast"><strong>Cast:</strong> ${castList}</p>
    </div>
  `;
}

getMovieDetails(movieId);

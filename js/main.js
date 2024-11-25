/* Api url bağlantısı */
const API_URL =
  "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=3fd2be6f0c70a2a598f084ddfb75487c&page=1";

const IMG_PATH = "https://image.tmdb.org/t/p/w1280";
const SEARCH_API =
  'https://api.themoviedb.org/3/search/movie?api_key=3fd2be6f0c70a2a598f084ddfb75487c&query="';

const form = document.getElementById("form");
const search = document.getElementById("search");
const main = document.getElementById("main");

// Filmleri getirme fonksiyonu
getMovies(API_URL);
async function getMovies(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`API Hatası: ${res.status} - ${res.statusText}`);
    }
    const data = await res.json();
    console.log(data.results);
    showMovies(data.results);
  } catch (error) {
    console.error("Film verileri alınamadı:", error);
    main.innerHTML = `<p>Filmleri yüklerken bir hata oluştu. Daha sonra tekrar deneyin.</p>`;
  }
}

// Filmleri search etme fonksiyonu
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchTerm = search.value.trim();
  if (searchTerm && searchTerm !== "") {
    getMovies(SEARCH_API + searchTerm);
    search.value = "";
  } else {
    window.location.reload();
  }
});

// Filmleri htmlde gösterme fonksiyonu
function showMovies(movies) {
  main.innerHTML = "";
  movies.forEach((movie) => {
    const { id, title, poster_path, vote_average, overview } = movie;
    // Eğer id yoksa hata önlemek için kontrol ekleyin
    if (!id) {
      console.error(`ID bulunamadı: ${title}`);
      return; // Bu filmi atla
    }

    // Film kartı oluşturma
    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");
    movieEl.innerHTML = `
     <img
    src="${IMG_PATH + poster_path}" alt="${title}"
  />
  <div class="movie-info">
    <h3>${title}</h3>
    <span class="${getClassByRate(vote_average)}">${vote_average}</span>
  </div>
  <div class="overview">
    <h3> ${title}  <small> Overview </small> </h3>
    <p>
     ${overview}
    </p>
  </div>
    `;
    // Filme tıklanıldığında detay sayfasına yönlendir
    movieEl.addEventListener("click", () => {
      window.location.href = `details.html?id=${id}`;
    });

    // Film kartını ana bölüme ekle
    main.appendChild(movieEl);
  });
}

// Vote Average renk belirleme fonksiyonu
function getClassByRate(vote) {
  if (vote >= 8) {
    return "gree";
  } else if (vote >= 5) {
    return "orange";
  } else {
    return "red";
  }
}

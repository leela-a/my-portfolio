const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const resultsDiv = document.getElementById("results");

let currentPage = 1;
let totalPages = 1;
let currentFilter = "all";

const TMDB_API_KEY = "4cd2565afaedc7b7a994f3f27c2bac2c";

async function fetchStreamingResults(query, page = 1) {
  const searchUrl =
    `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}`;

  const searchResponse = await fetch(searchUrl);
  const searchData = await searchResponse.json();

  const results = [];

  for (const item of searchData.results) {
    if (!item.id || (item.media_type !== "movie" && item.media_type !== "tv")) {
      continue;
    }

    const providersUrl =
      `https://api.themoviedb.org/3/${item.media_type}/${item.id}/watch/providers?api_key=${TMDB_API_KEY}`;

    const providerResponse = await fetch(providersUrl);
    const providerData = await providerResponse.json();

    const countryData = providerData.results?.[currentCountry];
    const providers = [];

	if (countryData?.flatrate) {
	  providers.push(
		...countryData.flatrate.map(p => ({
		  name: p.provider_name,
		  type: "subscription"
		}))
	  );
	}

	if (countryData?.ads) {
	  providers.push(
		...countryData.ads.map(p => ({
		  name: p.provider_name,
		  type: "free"
		}))
	  );
	}

	if (countryData?.rent) {
	  providers.push(
		...countryData.rent.map(p => ({
		  name: p.provider_name,
		  type: "rent"
		}))
	  );
	}

	if (countryData?.buy) {
	  providers.push(
		...countryData.buy.map(p => ({
		  name: p.provider_name,
		  type: "buy"
		}))
	  );
	}

	const date =
	  item.media_type === "movie" ? item.release_date: item.first_air_date;

	const year = date ? date.split("-")[0] : "N/A";

	results.push({
	  title: item.title || item.name,
	  type: item.media_type === "movie" ? "Movie" : "TV Show", year,
	  posterPath: item.poster_path,
	  providers
	});

  }

  return {
	  results,
	  totalPages: searchData.total_pages
	};
}

const countryMenu = document.getElementById("countryMenu");
const countryLabel = document.getElementById("countryLabel");
const countryPicker = document.getElementById("countryPicker");
const countrySearch = document.getElementById("countrySearch");

let currentCountry = "CA";
let countries = [];



async function loadCountries() {
  const response = await fetch("https://restcountries.com/v3.1/all?fields=name,cca2");
  const data = await response.json();

  countries = data
    .filter(country => country.cca2) // ensure valid ISO code
    .map(country => ({
      name: country.name.common,
      code: country.cca2
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  buildCountryMenu();
  updateCountryLabel(currentCountry);
}

countryPicker.addEventListener("click", () => {
  console.log("Country picker clicked");
  countryMenu.classList.toggle("hidden");
  
  countrySearch.value = "";
  buildCountryMenu()

});

countryMenu.addEventListener("click", (event) => {
  const selected = event.target.dataset.country;
  if (!selected) return;

  currentCountry = selected;
  updateCountryLabel(selected);
  countryMenu.classList.add("hidden");
  displayResults();
});

countrySearch.addEventListener("input", () => {
  buildCountryMenu(countrySearch.value);
});

searchButton.addEventListener("click", () => {
  currentPage = 1;
  displayResults();
});

searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
	currentPage = 1;  
    displayResults();
  }
});

document.getElementById("filterAll").addEventListener("click", () => {
	currentFilter = "all";
	displayResults();
});

document.getElementById("filterMovies").addEventListener("click", () => {
	currentFilter = "movie";
	displayResults();
});

document.getElementById("filterTV").addEventListener("click", () => {
	currentFilter = "tv";
	displayResults();
});	

document.addEventListener("click", (event) => {
  if (
    !countryPicker.contains(event.target) &&
    !countryMenu.contains(event.target)
  ) {
    countryMenu.classList.add("hidden");
  }
});

const filterButtons = document.querySelectorAll(".filter-btn");

	filterButtons.forEach(btn => {
	  btn.addEventListener("click", () => {
		filterButtons.forEach(b => b.classList.remove("active"));
		btn.classList.add("active");
	  });
});

async function displayResults() {
  const imageBaseUrl = "https://image.tmdb.org/t/p/w342";
  const query = searchInput.value.trim().toLowerCase();
  if (!query) return;

  resultsDiv.innerHTML = "Loading...";

 
const { results: apiResults, totalPages: pages } =
  await fetchStreamingResults(query, currentPage);
  
  // update total pages
  totalPages = pages;
	
	let scannedResults = apiResults;
	let scannedPage = currentPage;
	let pageLimit = Math.min(totalPages, currentPage + 5); // safety cap

	while (scannedResults.length === 0 && scannedPage < pageLimit) {
	  scannedPage++;
	  const next = await fetchStreamingResults(query, scannedPage);
	  scannedResults = next.results;
	  totalPages = next.totalPages;
	}
	
	// handle empty results
	if (scannedResults.length === 0) {
	  resultsDiv.innerHTML = `<p class="no-results">No results found.</p>`;
	  
	  // hide pagination when there are no results
	  document.getElementById("pagination").classList.add("hidden");
	  
	  return;
	}

  resultsDiv.innerHTML = "";
  
  const MAX_AUTO_SKIP = 3; // prevents infinite loops
	let attempts = 0;

	let response;
	do {
	  response = await fetchStreamingResults(query, currentPage);
	  attempts++;

	  if (response.results.length === 0 && currentPage < response.totalPages) {
		currentPage++;
	  } else {
		break;
	  }
	} while (attempts < MAX_AUTO_SKIP);


  apiResults.forEach(item => {
	
	// Search filter (case-insensitive)
    /*if (!item.title.toLowerCase().includes(query)) {
      return;
    }*/
  
	// Type filter  
	if (
	  currentFilter !== "all" &&
	  !item.type.toLowerCase().startsWith(currentFilter)
	) {
	  return;
	}

    const itemDiv = document.createElement("div");
	itemDiv.classList.add("result-card");

    const title = document.createElement("h3");
    title.textContent = item.title;

    const type = document.createElement("p");
    type.textContent = `${item.type}: ${item.year}`;

    const availability = document.createElement("p");
	
    if (item.providers.length === 0) {availability.textContent = "Not available for streaming.";
	} else {
		const providerText = item.providers
		.map(p => {
		  if (p.type === "free") return `${p.name} (Free)`;
		  if (p.type === "rent") return `${p.name} (Rent)`;
		  if (p.type === "buy") return `${p.name} (Buy)`;
		  return p.name;
		})
		.join(", ");

	  availability.textContent = `Available on: ${providerText}`;
	}
	
	const img = document.createElement("img");
	img.alt = item.title;
	img.style.width = "150px";
	img.style.borderRadius = "6px";

	if (item.posterPath) {
	  img.src = imageBaseUrl + item.posterPath;
	} else {
	  img.src = "https://via.placeholder.com/150x225?text=No+Image";
	}

	itemDiv.appendChild(img);
    itemDiv.appendChild(title);
    itemDiv.appendChild(type);
    itemDiv.appendChild(availability);

    resultsDiv.appendChild(itemDiv);
  });
  
    const pagination = document.getElementById("pagination");
	const pageIndicator = document.getElementById("pageIndicator");
	const prevBtn = document.getElementById("prevPage");
	const nextBtn = document.getElementById("nextPage");

	pagination.classList.remove("hidden");
	pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;

	prevBtn.disabled = currentPage <= 1;
	nextBtn.disabled = currentPage >= totalPages;
}

document.getElementById("prevPage").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    displayResults();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

document.getElementById("nextPage").addEventListener("click", () => {
  currentPage++;
  displayResults();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

function updateCountryLabel(code) {
  const country = countries.find(c => c.code === code);
  if (!country) return;

  countryLabel.textContent = `📍 ${country.name}`;
}

function buildCountryMenu(filterText = "") {
  countryMenu.querySelectorAll("div[data-country]").forEach(el => el.remove());

  countries.forEach(country => {
    if (
      !country.name.toLowerCase().includes(filterText.toLowerCase())
    ) {
      return;
    }

    const option = document.createElement("div");
    option.textContent = country.name;
    option.dataset.country = country.code;
    countryMenu.appendChild(option);
  });
}

loadCountries();
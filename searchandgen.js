const API_KEY = "fed86956458f19fb45cdd382b6e6de83";
    const IMG = "https://image.tmdb.org/t/p";

    let selectedMovie = null;
    let selectedPoster = "";
    let selectedBackdrop = "";
    let selectedBackdrops = [];
    let searchTimeout = null;

    // Live search implementation
    document.getElementById('query').addEventListener('input', function() {
      clearTimeout(searchTimeout);
      const query = this.value.trim();
      
      if (query.length < 2) {
        document.getElementById('results').innerHTML = '';
        document.getElementById('searchStatus').innerHTML = '';
        return;
      }
      
      document.getElementById('searchStatus').innerHTML = '<div class="loading"></div> Searching...';
      
      searchTimeout = setTimeout(() => {
        searchMovie(query);
      }, 500);
    });

    async function searchMovie(query) {
      try {
        const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
        const data = await res.json();
        const results = document.getElementById('results');
        const searchStatus = document.getElementById('searchStatus');
        
        if (!res.ok) {
          throw new Error(data.status_message || 'Search failed');
        }
        
        if (data.results.length === 0) {
          searchStatus.innerHTML = '<div class="error">No movies found. Try a different search term.</div>';
          results.innerHTML = '';
          return;
        }
        
        searchStatus.innerHTML = `<div class="success">Found ${data.results.length} results</div>`;
        results.innerHTML = '';
        
        data.results.slice(0, 5).forEach(movie => {
          const div = document.createElement('div');
          div.className = 'search-result';
          const posterUrl = movie.poster_path ? `${IMG}/w92${movie.poster_path}` : 'https://via.placeholder.com/50x75/333/fff?text=No+Image';
          div.innerHTML = `
            <img class="search-poster" src="${posterUrl}" alt="${movie.title}">
            <div>
              <div><strong>${movie.title}</strong> (${movie.release_date ? movie.release_date.split("-")[0] : "N/A"})</div>
              <div style="font-size: 0.9em; opacity: 0.7;">${movie.overview ? movie.overview.substring(0, 100) + '...' : 'No description available'}</div>
            </div>
          `;
          div.addEventListener('click', () => loadMovie(movie.id));
          results.appendChild(div);
        });
      } catch (error) {
        document.getElementById('searchStatus').innerHTML = `<div class="error">Error: ${error.message}</div>`;
        console.error('Search error:', error);
      }
    }

    async function loadMovie(id) {
      try {
        document.getElementById('searchStatus').innerHTML = '<div class="loading"></div> Loading movie details...';
        
        const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&append_to_response=credits,videos,images`);
        const movie = await res.json();
        
        if (!res.ok) {
          throw new Error(movie.status_message || 'Failed to load movie');
        }
        
        selectedMovie = movie;
        document.getElementById('searchStatus').innerHTML = `<div class="success">Loaded: ${movie.title}</div>`;
        document.getElementById('results').innerHTML = '';
        
        const cast = movie.credits.cast.slice(0, 10) || [];
        const director = movie.credits.crew.find(person => person.job === "Director");
        const writer = movie.credits.crew.find(person => person.department === "Writing");
        
        // Reset selected images
        selectedPoster = "";
        selectedBackdrop = "";
        selectedBackdrops = [];
        
        // Fix for posters and backdrops - check if they exist
        const posters = (movie.images && movie.images.posters) ? movie.images.posters.slice(0, 5) : [];
        const backdrops = (movie.images && movie.images.backdrops) ? movie.images.backdrops.slice(0, 6) : [];
        
        const postersHtml = posters.map(poster => {
          const isSelected = selectedPoster === `${IMG}/w500${poster.file_path}` ? 'selected' : '';
          return `<img class="poster ${isSelected}" src="${IMG}/w185${poster.file_path}" 
                  onclick="selectImage('poster', '${IMG}/w500${poster.file_path}')">`;
        }).join("");
        
        const backdropsHtml = backdrops.map(backdrop => {
          const isSelected = selectedBackdrop === `${IMG}/w1280${backdrop.file_path}` ? 'selected' : '';
          return `<img class="backdrop ${isSelected}" src="${IMG}/w300${backdrop.file_path}" 
                  onclick="selectImage('backdrop', '${IMG}/w1280${backdrop.file_path}')">`;
        }).join("");
        
        // Create cast list HTML
        let castListHtml = '';
        if (cast.length > 0) {
          castListHtml = `
            <div class="cast-list">
              <strong>Cast:</strong>
              <ul>
                ${cast.slice(0, 8).map(actor => `<li>${actor.name}</li>`).join('')}
              </ul>
            </div>
          `;
        }
        
        document.getElementById('movieDetails').innerHTML = `
          <div class="card">
            <div class="card-title">
              <span class="material-icons">movie_filter</span>
              <h3>Selected Movie: ${movie.title}</h3>
            </div>
            <div class="movie-details">
              <div>
                <img src="${movie.poster_path ? `${IMG}/w500${movie.poster_path}` : 'https://via.placeholder.com/300x450/333/fff?text=No+Poster'}" style="width: 100%; border-radius: 8px;" alt="${movie.title} poster">
                <div class="form-field">
                  <label>Choose Poster:</label>
                  <div class="poster-grid">${postersHtml || '<p>No posters available</p>'}</div>
                </div>
              </div>
              <div>
                <p><b>Overview:</b> ${movie.overview || 'No overview available'}</p>
                <p><b>Rating:</b> <a href="https://www.imdb.com/title/${movie.imdb_id}" target="_blank" style="color: var(--primary-light);">${movie.vote_average}/10</a></p>
                <p><b>Runtime:</b> ${movie.runtime || 'N/A'} min</p>
                <p><b>Director:</b> ${director ? director.name : "N/A"}</p>
                <div class="form-field">
                  <label>Genres:</label>
                  <div>${movie.genres ? movie.genres.map(genre => `<span class="chip">${genre.name}</span>`).join('') : 'N/A'}</div>
                </div>
                <div class="form-field">
                  <label>Choose Backdrop:</label>
                  <div class="backdrop-grid">${backdropsHtml || '<p>No backdrops available</p>'}</div>
                </div>
                <div class="form-field">
                  <label>Select Multiple Backdrops for Screenshots:</label>
                  <div class="backdrop-selector">
                    ${backdrops.map(backdrop => `
                      <img class="backdrop-thumb" src="${IMG}/w300${backdrop.file_path}" 
                           onclick="toggleBackdropSelection('${IMG}/w1280${backdrop.file_path}')">
                    `).join('')}
                  </div>
                  <button class="btn btn-small btn-secondary" onclick="addSelectedBackdrops()">
                    <span class="material-icons">add</span>
                    Add Selected to Screenshots
                  </button>
                </div>
                ${castListHtml}
              </div>
            </div>
          </div>
        `;
        
      } catch (error) {
        document.getElementById('searchStatus').innerHTML = `<div class="error">Error loading movie: ${error.message}</div>`;
        console.error('Movie loading error:', error);
      }
    }

    function selectImage(type, url) {
      if (type === 'poster') {
        selectedPoster = url;
        // Update UI to show selected poster
        document.querySelectorAll('.poster').forEach(img => {
          img.classList.remove('selected');
          if (img.src.includes(url.replace('/w500', '/w185'))) {
            img.classList.add('selected');
          }
        });
      } else if (type === 'backdrop') {
        selectedBackdrop = url;
        // Update UI to show selected backdrop
        document.querySelectorAll('.backdrop').forEach(img => {
          img.classList.remove('selected');
          if (img.src.includes(url.replace('/w1280', '/w300'))) {
            img.classList.add('selected');
          }
        });
      }
    }

    function toggleBackdropSelection(url) {
      const thumbnails = document.querySelectorAll('.backdrop-thumb');
      const index = selectedBackdrops.indexOf(url);
      
      if (index === -1) {
        selectedBackdrops.push(url);
      } else {
        selectedBackdrops.splice(index, 1);
      }
      
      // Update UI
      thumbnails.forEach(thumb => {
        if (thumb.src.includes(url.replace('/w1280', '/w300'))) {
          thumb.classList.toggle('selected');
        }
      });
    }

    function addSelectedBackdrops() {
      const ssBox = document.getElementById('ssBox');
      selectedBackdrops.forEach(url => {
        const existing = [...document.querySelectorAll('.ss-url')].some(input => input.value === url);
        if (!existing) {
          addScreenshotWithUrl(url);
        }
      });
      
      // Show success message
      const status = document.getElementById('searchStatus');
      status.innerHTML = `<div class="success">Added ${selectedBackdrops.length} backdrop(s) to screenshots</div>`;
      
      // Clear selection
      selectedBackdrops = [];
      document.querySelectorAll('.backdrop-thumb').forEach(thumb => {
        thumb.classList.remove('selected');
      });
    }

    function addDownload() {
      const div = document.createElement('div');
      div.className = 'download-item';
      div.innerHTML = `
        <input type="text" placeholder="Label (e.g., 480p, 720p)" class="dl-label">
        <input type="url" placeholder="https://download-link.com" class="dl-url">
        <button class="remove-btn" onclick="this.parentElement.remove()">
          <span class="material-icons" style="font-size: 18px;">close</span>
        </button>
      `;
      document.getElementById('downloadBox').appendChild(div);
    }

    function addScreenshot() {
      addScreenshotWithUrl('');
    }

    function addScreenshotWithUrl(url) {
      const div = document.createElement('div');
      div.className = 'screenshot-item';
      div.innerHTML = `
        <input type="url" placeholder="https://screenshot-image-url.com" class="ss-url" value="${url}">
        <button class="remove-btn" onclick="this.parentElement.remove()">
          <span class="material-icons" style="font-size: 18px;">close</span>
        </button>
      `;
      document.getElementById('ssBox').appendChild(div);
    }

    function generatePost() {
      if (!selectedMovie) {
        alert("Please select a movie first");
        return;
      }

      const movie = selectedMovie;
      const cast = movie.credits.cast.slice(0, 8).map(person => person.name).join(", ");
      const director = movie.credits.crew.find(person => person.job === "Director");
      const trailer = movie.videos && movie.videos.results ? movie.videos.results.find(video => video.type === "Trailer") : null;
      const trailerUrl = trailer ? `https://www.youtube.com/embed/${trailer.key}` : "";

      const downloads = [...document.querySelectorAll("#downloadBox .download-item")].map(item => {
        const label = item.querySelector(".dl-label").value;
        const url = item.querySelector(".dl-url").value;
        return label && url ? `<a class="dbtn" href="${url}" target="_blank">Download [${label}]</a>` : '';
      }).filter(Boolean).join("");

      const screenshots = [...document.querySelectorAll(".ss-url")].map(input => {
        return input.value ? `<img src="${input.value}" alt="screenshot">` : '';
      }).filter(Boolean).join("");

      const note = document.getElementById("customNote").value || "";
      
      // Get selected formats and qualities
      const formatCheckboxes = document.querySelectorAll('.format-option input[type="checkbox"]:checked');
      const formats = Array.from(formatCheckboxes).map(cb => cb.value).join(", ") || "WebDL";

      const includeVanXPlayer = document.getElementById("includeVanXPlayer").checked;

      const html = `
<link rel="stylesheet" href="https://dhanjeerider.github.io/pj/stylemv2.css">
<div class="backdrop">
  <img class="backdrop-image" src="${selectedBackdrop || (movie.backdrop_path ? IMG + "/w1280" + movie.backdrop_path : '')}" loading="lazy" alt="${movie.title} cover">
  <img class="poster" src="${selectedPoster || (movie.poster_path ? IMG + "/w500" + movie.poster_path : '')}" loading="lazy" alt="${movie.title} poster">
</div>

<div class="section-title">Summary</div>
<hr>
<p>${movie.overview || 'No overview available'}</p>
<hr>

<div class="movie-widget"><div class="movie-info">
  <p class="movie-title">💳 Full Name: ${movie.title} [<span style="color:#fdd835;">${movie.release_date ? movie.release_date.split("-")[0] : 'N/A'}</span>]</p>
  <p class="movie-summary">⭐ Rating: <a href="https://www.imdb.com/title/${movie.imdb_id}" target="_blank">${movie.vote_average}</a></p>
  <p class="movie-summary">🗓 Released: ${movie.release_date || 'N/A'}</p>
  <p class="movie-summary">🕒 Runtime: ${movie.runtime || 'N/A'} min</p>
  <p class="movie-summary">🕵️ Starcast: ${cast}</p>
  <p class="movie-summary">🎭 Genre: ${movie.genres ? movie.genres.map(genre => genre.name).join(", ") : 'N/A'}</p>
  <p class="movie-summary">🎬 Director: ${director ? director.name : "N/A"}</p>
  <p class="movie-summary">💽 Format: ${formats}</p>
  <p class="movie-summary">${note}</p>
</div></div>

<div class="mt-box color-4">👇Screenshots</div>
<hr>
<center class="pics">${screenshots || `<img src="${selectedBackdrop || (movie.backdrop_path ? IMG + "/w1280" + movie.backdrop_path : '')}" alt="screenshot">`}</center>
<hr>

<div class="mt-box color-6">Download ${movie.title} ${formats}</div>
<hr>
<div id="downloadLinks">${downloads || 'No download links added'}</div>
<hr>

${trailerUrl ? `
<div class="mt-box color-7">📺 TRAILER</div>
<hr>
<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
  <iframe title="trailer" src="${trailerUrl}" frameborder="0" allowfullscreen style="position: absolute; top:0; left:0; width:100%; height:100%;"></iframe>
</div>
<hr>
` : ''}

${includeVanXPlayer ? `
<div class="mt-box color-3">🎬 Watch this movie online</div>
<hr>
<script src='https://dktczn.github.io/Dk/cdn/plyrimbd.js'/>
<div id="dkplyr"></div>
<hr>
` : ''}
`;

      document.getElementById("output").value = html;
      document.getElementById("preview").innerHTML = html;
      
      // Scroll to output
      document.getElementById("output").scrollIntoView({ behavior: 'smooth' });
    }

    function copyToClipboard() {
      const output = document.getElementById("output");
      output.select();
      document.execCommand("copy");
      
      // Show feedback
      const status = document.getElementById("searchStatus");
      status.innerHTML = `<div class="success">Post code copied to clipboard!</div>`;
    }

    function clearAll() {
      if (confirm("Are you sure you want to clear all fields?")) {
        document.getElementById("query").value = "";
        document.getElementById("results").innerHTML = "";
        document.getElementById("movieDetails").innerHTML = "";
        document.getElementById("customNote").value = "";
        document.getElementById("downloadBox").innerHTML = "";
        document.getElementById("ssBox").innerHTML = "";
        document.getElementById("output").value = "";
        document.getElementById("preview").innerHTML = "<p style='text-align: center; color: #666;'>Generated post will appear here</p>";
        
        // Clear checkboxes
        document.querySelectorAll('.format-option input[type="checkbox"]').forEach(cb => {
          cb.checked = false;
        });
        
        document.getElementById("includeVanXPlayer").checked = false;
        
        // Reinitialize with one download and screenshot field
        addDownload();
        addScreenshot();
        
        selectedMovie = null;
        selectedPoster = "";
        selectedBackdrop = "";
        selectedBackdrops = [];
      }
    }

    // Initialize with one download and screenshot field
    window.onload = function() {
      addDownload();
      addScreenshot();
    };
  

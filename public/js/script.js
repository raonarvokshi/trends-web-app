
if (window.location.href === "http://localhost:3000/popular/movies") {
  // POPULAR MOVIES (AJAX)
  const popularInput = document.getElementById("popularSearchInput");
  const popularResults = document.getElementById("popularResults");

  popularInput.addEventListener("input", async () => {
    const keyword = popularInput.value.trim();
    const genre = document.getElementById("genre-select").value;

    if (keyword.length === 0) {
      const res = await fetch(`/popular/movies/search?q=a&genre=${encodeURIComponent(genre)}`);
      const results = await res.json();
      return renderResults(results);
    }

    const res = await fetch(`/popular/movies/search?q=${encodeURIComponent(keyword)}&genre=${encodeURIComponent(genre)}`);
    const results = await res.json();
    renderResults(results);
  });

  function renderResults(results) {
    popularResults.innerHTML = results.map(movie => `
          <div class="col-lg-3 col-md-6 mt-4">
            <div class="card h-100">
              <img src="https://image.tmdb.org/t/p/w500${movie.backdrop_path || ''}" class="card-img-top" style="object-fit: cover; height: 180px;">
              <div class="card-body d-flex flex-column">
                <a href="/movie/${movie.id}" class="text-dark">
                  <h5 class="card-title">${movie.title.length > 60 ? movie.title.substring(0, 57) + "..." : movie.title}</h5>
                </a>
                <p class="card-text">${movie.overview ? (movie.overview.length > 80 ? movie.overview.substring(0, 77) + "..." : movie.overview) : "No Description"}</p>
                <p class="mb-2"><small class="text-secondary">Release Date: ${movie.release_date || "Unknown"}</small></p>
                <a href="#" class="btn btn-primary mb-3 mt-auto">Add to favorites</a>
                <a href="#" class="btn btn-outline-primary">Add to watched list</a>
              </div>
            </div>
          </div>
        `).join("");
  }
}

if (window.location.href === "http://localhost:3000/top-rated/movies") {
  // TOP RATED MOVIES (AJAX)
  const topRatedInput = document.getElementById("topRatedSearchInput");
  const topRatedResults = document.getElementById("topRatedResults");

  topRatedInput.addEventListener("input", async () => {
    const keyword = topRatedInput.value.trim();
    const genre = document.getElementById("genre-select").value;

    const query = keyword.length === 0 ? "a" : keyword;
    const res = await fetch(`/top-rated/movies/search?q=${encodeURIComponent(query)}&genre=${encodeURIComponent(genre)}`);
    const results = await res.json();

    topRatedResults.innerHTML = results.map(movie => `
          <div class="col-lg-3 col-md-6 mt-4">
            <div class="card h-100">
              <img src="https://image.tmdb.org/t/p/w500${movie.backdrop_path || ''}" class="card-img-top" style="object-fit: cover; height: 180px;">
              <div class="card-body d-flex flex-column">
                <a href="/movie/${movie.id}" class="text-dark">
                  <h5 class="card-title">${movie.title.length > 60 ? movie.title.substring(0, 57) + "..." : movie.title}</h5>
                </a>
                <p class="card-text">${movie.overview ? (movie.overview.length > 80 ? movie.overview.substring(0, 77) + "..." : movie.overview) : "No Description"}</p>
                <p class="mb-2"><small class="text-secondary">Release Date: ${movie.release_date || "Unknown"}</small></p>
                <a href="#" class="btn btn-primary mb-3 mt-auto">Add to favorites</a>
                <a href="#" class="btn btn-outline-primary">Add to watched list</a>
              </div>
            </div>
          </div>
        `).join("");
  });
}




if (window.location.href === "http://localhost:3000/upcoming/movies") {
  // UPCOMING MOVIES (AJAX)
  const input = document.getElementById("movieSearchInput");
  const movieResults = document.getElementById("movieResults");

  input.addEventListener("input", async () => {
    const keyword = input.value.trim();
    const genre = document.getElementById("genre-select").value;

    const query = keyword.length === 0 ? "a" : keyword;
    const res = await fetch(`/upcoming/movies/search?q=${encodeURIComponent(query)}&genre=${encodeURIComponent(genre)}`);
    const results = await res.json();

    movieResults.innerHTML = results.map(movie => `
          <div class="col-lg-3 col-md-6 mt-4">
            <div class="card h-100">
              <img src="https://image.tmdb.org/t/p/w500${movie.backdrop_path || ''}" class="card-img-top" style="object-fit: cover; height: 180px;">
              <div class="card-body d-flex flex-column">
                <a href="/movie/${movie.id}" class="text-dark">
                  <h5 class="card-title">${movie.title.length > 60 ? movie.title.substring(0, 57) + "..." : movie.title}</h5>
                </a>
                <p class="card-text">${movie.overview ? (movie.overview.length > 80 ? movie.overview.substring(0, 77) + "..." : movie.overview) : "No Description"}</p>
                <p class="mb-2"><small class="text-secondary">Release Date: ${movie.release_date || "Unknown"}</small></p>
                <a href="#" class="btn btn-primary mb-3 mt-auto">Add to favorites</a>
                <a href="#" class="btn btn-outline-primary">Add to watched list</a>
              </div>
            </div>
          </div>
        `).join("");
  });
}





if (window.location.href === "http://localhost:3000/crypto") {
  $('#cryptoTable').DataTable({
    dom: 'PBfrtip',
    pageLength: 5,
    responsive: true,
    stateSave: true,
    "lengthMenu": [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]],

    buttons: [
      {
        extend: 'excel',
        text: "<i class='fa-solid fa-file-excel text-white'></i>",
      },
      {
        extend: 'pdf',
        text: "<i class='fa-solid fa-file-pdf text-white'></i>",
        customize: function (doc) {
          doc.styles.tableHeader.alignment = "center"; // HEADER POSITION
          doc.styles.tableBodyOdd.alignment = "center"; // BODY POSITION 1 (grey color)
          doc.styles.tableBodyEven.alignment = "center"; // BODY POSITION 2 (white color)
          doc.styles.tableHeader.fontSize = 7; // HEADER FONT SIZE
          doc.defaultStyle.fontSize = 6; // BODY FONT SIZE
          // GET THE 100% WIDTH OF THE TABLE
          doc.content[1].table.widths = Array(doc.content[1].table.body[1].length + 1).join("*").split("");
          // doc.styles.tableBodyEven.fillColor = "red"; // CHANGE COLOR TO RED 
          // doc.styles.tableBodyEven.color = "#fff"; // CHANGE COLOR TO RED 
        }
      },
      {
        extend: 'print',
        text: "<i class='fa-solid fa-print text-white'></i>",
      },
      {
        extend: 'colvis',
        text: "Column Visibility",
        titleAttr: "Column Visibility",
      },
      {
        extend: 'pageLength',
      },
    ],

    searchPanes: {
      initCollapsed: true
    },

    columnDefs: [
      { searchPanes: { show: true }, targets: [1, 2, 3] },
      { searchPanes: { show: false }, targets: [0, 4, 5, 6, 7, 8, 9] }
    ],

    language: {
      searchPlaceholder: "Search here...",
      search: ""
    },

    responsive: {
      details: {
        display: DataTable.Responsive.display.modal({
          header: function (row) {
            const data = row.data();
            return 'Details for ' + data[0] + ' ' + data[1];
          }
        }),
        renderer: DataTable.Responsive.renderer.tableAll({
          tableClass: 'table'
        })
      }
    }
  });
}
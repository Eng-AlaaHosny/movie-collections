const apiKey = 'c4adc8a9';



// Navigation functions

function navigateToUserPage() {

  window.location.href = 'user.html';

}



function navigateToHomePage() {

  window.location.href = 'index.html';

}



// Modal functions

function openNewListModal() {

  document.getElementById('listModal').style.display = 'block';

}



function closeModal() {

  document.getElementById('listModal').style.display = 'none';

}



// List management functions

function createNewList() {

  const listName = document.getElementById('listNameInput').value.trim();

  if (!listName) {

    alert('Please enter a list name');

    return;

  }



  const userLists = JSON.parse(localStorage.getItem('movieLists')) || [];

  userLists.push({

    name: listName,

    movies: []

  });

  

  localStorage.setItem('movieLists', JSON.stringify(userLists));

  closeModal();

  

  // Reload lists if we're on the user page

    

    if (window.location.pathname.includes('user.html')) {

      loadUserLists();

    }

  }

    loadUserLists();

  





function deleteList(index) {

  if (confirm('Are you sure you want to delete this list?')) {

    const userLists = JSON.parse(localStorage.getItem('movieLists')) || [];

    userLists.splice(index, 1);

    localStorage.setItem('movieLists', JSON.stringify(userLists));

    loadUserLists();

  }

}



// Movie search functions

async function searchMovie() {

  const input = document.getElementById('searchInput').value.trim();

  const resultsDiv = document.getElementById('results');



  if (!input) {

    resultsDiv.innerHTML = "<p>Please enter a movie title.</p>";

    return;

  }



  const url = `https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(input)}`;



  try {

    const response = await fetch(url);

    const data = await response.json();



    console.log("API URL:", url);

    console.log("API Response:", data);



    if (data.Response === "True") {

      displayMovies(data.Search);

    } else {

      resultsDiv.innerHTML = `<p>${data.Error || "No movies found."}</p>`;

    }

  } catch (error) {

    console.error('Error fetching movie data:', error);

    resultsDiv.innerHTML = `<p>Error loading data.</p>`;

  }

}



function displayMovies(movies) {

  const resultsDiv = document.getElementById('results');

  resultsDiv.innerHTML = '';



  movies.forEach(movie => {

    const movieEl = document.createElement('div');

    movieEl.className = 'movie-result';

    movieEl.innerHTML = `

      <div class="movie-info">

        <h3>${movie.Title} (${movie.Year})</h3>

        <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/150'}" alt="${movie.Title}" width="150"/>

      </div>

      <button onclick="showAddToListOptions('${movie.imdbID}')">Add to List</button>

    `;

    resultsDiv.appendChild(movieEl);

  });

}



function showAddToListOptions(imdbID) {

  const url = `https://www.omdbapi.com/?apikey=${apiKey}&i=${imdbID}`;

  

  fetch(url)

    .then(response => response.json())

    .then(movie => {

      const userLists = JSON.parse(localStorage.getItem('movieLists')) || [];

      

      if (userLists.length === 0) {

        alert('You have no lists. Please create a list first.');

        openNewListModal();

        return;

      }

      

      let listOptions = 'Select a list to add this movie:\n\n';

      userLists.forEach((list, index) => {

        listOptions += `${index + 1}. ${list.name}\n`;

      });

      

      const listChoice = prompt(listOptions);

      if (listChoice && !isNaN(listChoice)) {

        const listIndex = parseInt(listChoice) - 1;

        if (listIndex >= 0 && listIndex < userLists.length) {

          const exists = userLists[listIndex].movies.some(m => m.imdbID === movie.imdbID);

          if (exists) {

            alert('This movie is already in the selected list.');

          } else {

            userLists[listIndex].movies.push({

              Title: movie.Title,

              Year: movie.Year,

              Poster: movie.Poster,

              imdbID: movie.imdbID

            });

            localStorage.setItem('movieLists', JSON.stringify(userLists));

            alert(`"${movie.Title}" added to "${userLists[listIndex].name}"`);

          }

        }

      }

    })

    .catch(error => {

      console.error('Error fetching movie details:', error);

      alert('Error adding movie to list');

    });

}



// User page functions (only used in user.html)

function loadUserLists() {

  if (!document.getElementById('userLists')) return;



  const userLists = JSON.parse(localStorage.getItem('movieLists')) || [];

  const listsContainer = document.getElementById('userLists');

  listsContainer.innerHTML = '';



  if (userLists.length === 0) {

    listsContainer.innerHTML = '<p>You have no lists yet. Create one!</p>';

    return;

  }



  userLists.forEach((list, index) => {

    const listElement = document.createElement('div');

    listElement.className = 'list-container';

    

    listElement.innerHTML = `

      <div class="list-title">

        <span>${list.name}</span>

        <span onclick="deleteList(${index})" style="cursor:pointer;color:red;">✕</span>

      </div>

      <div id="list-${index}-movies"></div>

    `;

    

    listsContainer.appendChild(listElement);

    

    const moviesContainer = document.getElementById(`list-${index}-movies`);

    if (list.movies.length === 0) {

      moviesContainer.innerHTML = '<p>No movies in this list yet.</p>';

    } else {

      list.movies.forEach(movie => {

        const movieElement = document.createElement('div');

        movieElement.className = 'movie-item';

        movieElement.innerHTML = `

          <img src="${movie.Poster}" alt="${movie.Title}" width="50">

          <span>${movie.Title} (${movie.Year})</span>

        `;

        moviesContainer.appendChild(movieElement);

      });

    }

  });

}



// Initialize user lists if on user page

if (window.location.pathname.includes('user.html')) {

  document.addEventListener('DOMContentLoaded', loadUserLists);

}

// Add these new modal functions

function openSelectListModal(imdbID) {

  document.getElementById('selectListModal').style.display = 'block';

  populateListOptions(imdbID);

}



function closeSelectListModal() {

  document.getElementById('selectListModal').style.display = 'none';

}



function populateListOptions(imdbID) {

  const userLists = JSON.parse(localStorage.getItem('movieLists')) || [];

  const container = document.getElementById('listOptionsContainer');

  container.innerHTML = '';

  

  if (userLists.length === 0) {

    container.innerHTML = '<p>You have no lists. Please create a list first.</p>';

    const createBtn = document.createElement('button');

    createBtn.textContent = 'Create New List';

    createBtn.onclick = function() {

      closeSelectListModal();

      openNewListModal();

    };

    container.appendChild(createBtn);

    return;

  }

  

  userLists.forEach((list, index) => {

    const listOption = document.createElement('div');

    listOption.className = 'list-option';

    listOption.innerHTML = `

      <div class="list-option-name">${list.name}</div>

      <div class="list-movie-count">${list.movies.length} movies</div>

    `;

    

    listOption.onclick = function() {

      addMovieToList(index, imdbID);

    };

    

    container.appendChild(listOption);

  });

}



async function addMovieToList(listIndex, imdbID) {

  const url = `https://www.omdbapi.com/?apikey=${apiKey}&i=${imdbID}`;

  

  try {

    const response = await fetch(url);

    const movie = await response.json();

    

    const userLists = JSON.parse(localStorage.getItem('movieLists')) || [];

    if (listIndex >= 0 && listIndex < userLists.length) {

      const exists = userLists[listIndex].movies.some(m => m.imdbID === movie.imdbID);

      if (exists) {

        alert('This movie is already in the selected list.');

      } else {

        userLists[listIndex].movies.push({

          Title: movie.Title,

          Year: movie.Year,

          Poster: movie.Poster,

          imdbID: movie.imdbID

        });

        localStorage.setItem('movieLists', JSON.stringify(userLists));

        alert(`"${movie.Title}" added to "${userLists[listIndex].name}"`);

        closeSelectListModal();

      }

    }

  } catch (error) {

    console.error('Error fetching movie details:', error);

    alert('Error adding movie to list');

  }

}



// Update the showAddToListOptions function

function showAddToListOptions(imdbID) {

  openSelectListModal(imdbID);

}
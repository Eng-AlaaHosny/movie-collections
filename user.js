// This will handle the user page functionality

document.addEventListener('DOMContentLoaded', function() {

    loadUserLists();

  });

  

  function loadUserLists() {

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

  

  function openNewListModal() {

    document.getElementById('listModal').style.display = 'block';

  }

  

  function closeModal() {

    document.getElementById('listModal').style.display = 'none';

  }

  

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

    loadUserLists();

  }

  

  function deleteList(index) {

    if (confirm('Are you sure you want to delete this list?')) {

      const userLists = JSON.parse(localStorage.getItem('movieLists')) || [];

      userLists.splice(index, 1);

      localStorage.setItem('movieLists', JSON.stringify(userLists));

      loadUserLists();

    }

  }

  

  function navigateToHomePage() {

    window.location.href = 'index.html';

  }

  // Add this function to user.js

function deleteMovieFromList(listIndex, movieIndex) {

    if (confirm('Are you sure you want to remove this movie from the list?')) {

      const userLists = JSON.parse(localStorage.getItem('movieLists')) || [];

      if (userLists[listIndex] && userLists[listIndex].movies[movieIndex]) {

        userLists[listIndex].movies.splice(movieIndex, 1);

        localStorage.setItem('movieLists', JSON.stringify(userLists));

        loadUserLists(); // Refresh the display

      }

    }

  }

  

  // Modify the loadUserLists function to include delete buttons

  function loadUserLists() {

    const userLists = JSON.parse(localStorage.getItem('movieLists')) || [];

    const listsContainer = document.getElementById('userLists');

    listsContainer.innerHTML = '';

  

    if (userLists.length === 0) {

      listsContainer.innerHTML = '<p>You have no lists yet. Create one!</p>';

      return;

    }

  

    userLists.forEach((list, listIndex) => {

      const listElement = document.createElement('div');

      listElement.className = 'list-container';

      

      listElement.innerHTML = `

        <div class="list-title">

          <span>${list.name}</span>

          <span onclick="deleteList(${listIndex})" style="cursor:pointer;color:red;">✕</span>

        </div>

        <div id="list-${listIndex}-movies"></div>

      `;

      

      listsContainer.appendChild(listElement);

      

      const moviesContainer = document.getElementById(`list-${listIndex}-movies`);

      if (list.movies.length === 0) {

        moviesContainer.innerHTML = '<p>No movies in this list yet.</p>';

      } else {

        list.movies.forEach((movie, movieIndex) => {

          const movieElement = document.createElement('div');

          movieElement.className = 'movie-item';

          movieElement.innerHTML = `

            <img src="${movie.Poster}" alt="${movie.Title}" width="50">

            <span>${movie.Title} (${movie.Year})</span>

            <span onclick="deleteMovieFromList(${listIndex}, ${movieIndex})" 

                  style="cursor:pointer;color:red;margin-left:auto;">✕</span>

          `;

          moviesContainer.appendChild(movieElement);

        });

      }

    });

  }
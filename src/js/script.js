const mealContainer = document.getElementById('meals');
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');

const favoritesSection = document.getElementById('favoritesSection');
const favoritesContainer = document.getElementById('favoritesContainer');
const viewFavoritesBtn = document.getElementById('viewFavoritesBtn');

const API = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';

// ---------------------------
// Intersection Observer
// ---------------------------
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

// ---------------------------
// Fetch Meals
// ---------------------------
async function fetchMeals(query = '') {
    try {
        const res = await fetch(API + query);
        const data = await res.json();

        mealContainer.innerHTML = '';

        if (!data.meals) {
            mealContainer.innerHTML = '<p>No meals found. Try another search!</p>';
            return;
        }

        data.meals.forEach(meal => createMealCard(meal, mealContainer));

    } catch {
        mealContainer.innerHTML = '<p>Something went wrong. Try again.</p>';
    }
}

// ---------------------------
// Create Meal Card
// ---------------------------
function createMealCard(meal, parent) {
    const div = document.createElement('div');
    div.classList.add('meal-card');

    div.innerHTML = `
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" loading="lazy">
        <h3>${meal.strMeal}</h3>
        <p>Category: ${meal.strCategory}</p>
        <p>${meal.strInstructions.substring(0, 100)}...</p>
        <button class="fav-btn" data-id="${meal.idMeal}">❤ Save to Favorites</button>
    `;

    parent.appendChild(div);
    observer.observe(div);

    // favorite button
    div.querySelector('.fav-btn').addEventListener('click', () => addFavorite(meal));
}

// ---------------------------
// Favorites Handling
// ---------------------------
function getFavorites() {
    return JSON.parse(localStorage.getItem('favorites')) || [];
}

function saveFavorites(list) {
    localStorage.setItem('favorites', JSON.stringify(list));
}

function addFavorite(meal) {
    const list = getFavorites();

    if (!list.some(item => item.idMeal === meal.idMeal)) {
        list.push(meal);
        saveFavorites(list);
        loadFavorites();
        alert('Added to favorites!');
    }
}

function removeFavorite(idMeal) {
    const list = getFavorites().filter(meal => meal.idMeal !== idMeal);
    saveFavorites(list);
    loadFavorites();
}

// ---------------------------
// Load Favorites
// ---------------------------
function loadFavorites() {
    const list = getFavorites();
    favoritesContainer.innerHTML = '';

    if (list.length === 0) {
        favoritesContainer.innerHTML = '<p>No favorites yet.</p>';
        return;
    }

    list.forEach(meal => {
        const div = document.createElement('div');
        div.classList.add('meal-card');

        div.innerHTML = `
            <img src="${meal.strMealThumb}">
            <h3>${meal.strMeal}</h3>
            <button class="fav-btn" data-id="${meal.idMeal}">Remove</button>
        `;

        favoritesContainer.appendChild(div);

        div.querySelector('.fav-btn').addEventListener('click', () =>
            removeFavorite(meal.idMeal)
        );
    });
}

// ---------------------------
// Toggle Favorites Section
// ---------------------------
viewFavoritesBtn.addEventListener('click', () => {
    const isHidden = favoritesSection.classList.contains('hidden');

    if (isHidden) {
        favoritesSection.classList.remove('hidden');
        loadFavorites();
        viewFavoritesBtn.textContent = "Hide Favorites";
    } else {
        favoritesSection.classList.add('hidden');
        viewFavoritesBtn.textContent = "View Favorites";
    }
});


// ---------------------------
// Search Handler
// ---------------------------
searchForm.addEventListener('submit', e => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) fetchMeals(query);
});

// Initial load
fetchMeals();

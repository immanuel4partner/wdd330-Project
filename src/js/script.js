// Elements
const mealContainer = document.getElementById('meals');
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const loadingIndicator = document.getElementById('loadingIndicator');

const favoritesSection = document.getElementById('favoritesSection');
const favoritesContainer = document.getElementById('favoritesContainer');
const viewFavoritesBtn = document.getElementById('viewFavoritesBtn');

const mealModal = document.getElementById('mealModal');
const closeModal = document.getElementById('closeModal');
const modalBody = document.getElementById('modalBody');

const API = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';

// Fetch Meals
async function fetchMeals(query = '') {
    mealContainer.innerHTML = '';
    showLoading(true);

    try {
        const res = await fetch(API + query);
        const data = await res.json();
        showLoading(false);

        if (!data.meals) {
            mealContainer.innerHTML = '<p>No meals found. Try another search!</p>';
            return;
        }

        data.meals.forEach(meal => createMealCard(meal, mealContainer));
    } catch {
        showLoading(false);
        mealContainer.innerHTML = '<p>Something went wrong. Try again.</p>';
    }
}

// Create Meal Card
function createMealCard(meal, parent, isFavoriteView = false) {
    const div = document.createElement('div');
    div.classList.add('meal-card');

    const favoriteList = getFavorites();
    const isSaved = favoriteList.some(item => item.idMeal === meal.idMeal);

    div.innerHTML = `
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" loading="lazy">
        <h3>${meal.strMeal}</h3>
        <p>${meal.strCategory || ''}</p>
        <button class="fav-btn ${isSaved ? 'saved' : ''}" data-id="${meal.idMeal}">
            ${isSaved ? 'Remove Favorite' : 'Save to Favorites'}
        </button>
    `;

    parent.appendChild(div);

    // Show Details on click
    div.addEventListener('click', (e) => {
        if (!e.target.classList.contains('fav-btn')) {
            showMealDetails(meal);
        }
    });

    // Favorite button
    div.querySelector('.fav-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFavorite(meal);
    });
}

// Loading indicator
function showLoading(show) {
    loadingIndicator.classList.toggle('hidden', !show);
}

// Favorites handling
function getFavorites() {
    return JSON.parse(localStorage.getItem('favorites')) || [];
}

function saveFavorites(list) {
    localStorage.setItem('favorites', JSON.stringify(list));
}

function toggleFavorite(meal) {
    const list = getFavorites();
    const exists = list.some(item => item.idMeal === meal.idMeal);

    if (exists) {
        removeFavorite(meal.idMeal);
    } else {
        list.push(meal);
        saveFavorites(list);
    }
    refreshUI();
}

function removeFavorite(idMeal) {
    const list = getFavorites().filter(m => m.idMeal !== idMeal);
    saveFavorites(list);
    refreshUI();
}

function refreshUI() {
    mealContainer.innerHTML = '';
    fetchMeals(searchInput.value.trim());
    if (!favoritesSection.classList.contains('hidden')) {
        loadFavorites();
    }
}

// Load favorites
function loadFavorites() {
    const list = getFavorites();
    favoritesContainer.innerHTML = '';

    if (list.length === 0) {
        favoritesContainer.innerHTML = '<p>No favorites yet.</p>';
        return;
    }

    list.forEach(meal => createMealCard(meal, favoritesContainer, true));
}

// Toggle favorites section
viewFavoritesBtn.addEventListener('click', () => {
    const isHidden = favoritesSection.classList.toggle('hidden');
    viewFavoritesBtn.textContent = isHidden ? "View Favorites" : "Hide Favorites";
    if (!isHidden) loadFavorites();
});

// random button handler

const randomMealBtn = document.getElementById("randomMealBtn");

async function fetchRandomMeal() {
    try {
        const res = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
        const data = await res.json();

        if (data.meals && data.meals.length > 0) {
            showMealDetails(data.meals[0]);
        }
    } catch (err) {
        console.error("Random meal fetch failed", err);
    }
}

randomMealBtn.addEventListener("click", fetchRandomMeal);


// Search handler
searchForm.addEventListener('submit', e => {
    e.preventDefault();
    fetchMeals(searchInput.value.trim());
});

// Modal
// // Show meal details with framed modal and clickable shrink feature
function showMealDetails(meal) {
    mealModal.classList.remove('hidden');

    modalBody.innerHTML = `
        <h2>${meal.strMeal}</h2>
        <img id="modalImage" class="modal-img" src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <p><strong>Category:</strong> ${meal.strCategory}</p>
        <p>${meal.strInstructions}</p>
    `;

    const modalImg = document.getElementById("modalImage");

    // Shrink the image when clicked so instructions are easier to see
    modalImg.addEventListener("click", (e) => {
        e.stopPropagation();
        modalImg.classList.toggle("modal-img-small");
    });
}

// Click outside the image + content closes modal and resets image size
mealModal.addEventListener("click", () => {
    const modalImg = document.getElementById("modalImage");
    if (modalImg) modalImg.classList.remove("modal-img-small");
    mealModal.classList.add("hidden");
});

closeModal.addEventListener('click', (e) => {
    e.stopPropagation();
    mealModal.classList.add('hidden');
});

const mealContainer = document.getElementById('meals');
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const API = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';

// Intersection Observer for lazy animation
const observer = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.1
    }
);

// Fetch and display meals
async function fetchMeals(query = '') {
    try {
        const res = await fetch(API + query);
        const data = await res.json();

        mealContainer.innerHTML = '';

        if (!data.meals) {
            mealContainer.innerHTML = '<p>No meals found. Try another search!</p>';
            return;
        }

        data.meals.forEach(meal => {
            const div = document.createElement('div');
            div.classList.add('meal-card', 'hidden'); // Start hidden

            div.innerHTML = `
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" loading="lazy">
                <h3>${meal.strMeal}</h3>
                <p>Category: ${meal.strCategory}</p>
                <p>${meal.strInstructions.substring(0, 120)}...</p>
            `;

            mealContainer.appendChild(div);
            observer.observe(div); // Observe card for lazy animation
        });
    } catch (err) {
        console.error(err);
        mealContainer.innerHTML = '<p>Something went wrong. Please try again later.</p>';
    }
}

// Initial load
fetchMeals();

// Handle search
searchForm.addEventListener('submit', e => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) fetchMeals(query);
});

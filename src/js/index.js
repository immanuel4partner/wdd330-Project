const mealContainer = document.getElementById('section');
const API = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';

fetch(API)
    .then(res => res.json())
    .then(info => {
        if (!info.meals) return;

        info.meals.foEach(meal => {
            // Create a card for each meal
            const div = document.createElement('div');
            div.classList.add('meal-card');

            // Meal image
            const img = document.createElement('img');
            img.src = meal.strMealThumb;
            img.alt = meal.strMeal;

            // Meal title
            const title = document.createElement('h3');
            title.textContent = meal.strMeal;

            // Category
            const category = document.createElement('p');
            category.textContent = `Category: ${meal.strCategory}`;

            // Instructions (shortened)
            const instructions = document.createElement('p');
            instructions.textContent = meal.strInstructions.substring(0, 150) + '...';

            // Append elements
            div.appendChild(img);
            div.appendChild(title);
            div.appendChild(category);
            div.appendChild(instructions);

            mealContainer.appendChild(div);
        });
    })
    .catch(err => console.error(err));

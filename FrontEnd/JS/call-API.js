// Authenticate user and return token
export async function authenticateUser(credentials) {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
  
    if (!response.ok) throw new Error("Authentication error");
    
    return response.json();
  }

// Fetch data from API and return JSON
async function fetchData(url) {
    const response = await fetch(url);
  
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
  
    return response.json();
  }

  // Render works in the gallery
function renderWorks(works) {
    gallery.innerHTML = works
  
      .map(
        (work) => `
      <figure data-category-id="${work.categoryId}">
        <img src="${work.imageUrl}" alt="${work.title}">
        <figcaption>${work.title}</figcaption>
      </figure>
    `
      )
      .join("");
  }
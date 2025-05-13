// Select the gallery container in the DOM
const gallery = document.querySelector(".gallery");

// Select the portfolio section to add filter buttons
const portfolioSection = document.getElementById("portfolio");
const portfolioTitle = portfolioSection.querySelector("h2");

// Function to create and render filter buttons
const renderFilterButtons = (categories) => {
  // Create a container for filter buttons
  const filtersContainer = document.createElement("div");
  filtersContainer.classList.add("filters");

  // Add CSS to style the filters container
  filtersContainer.style.display = "flex";
  filtersContainer.style.justifyContent = "center";
  filtersContainer.style.gap = "10px";
  filtersContainer.style.marginBottom = "50px";

  // Create "All" button first
  const allButton = document.createElement("button");
  allButton.textContent = "Tous";
  allButton.classList.add("filter-btn", "active");
  allButton.dataset.categoryId = "all";

  // Add CSS to style the "All" button (same as category buttons)
  allButton.style.borderRadius = "60px";
  allButton.style.color = "#1D6154";
  allButton.style.border = "1px solid #1D6154";
  allButton.style.backgroundColor = "white";
  allButton.style.fontFamily = "Syne";
  allButton.style.fontWeight = "700";
  allButton.style.padding = "9px";

  filtersContainer.appendChild(allButton);

  // Create a button for each category
  categories.forEach((category) => {
    const button = document.createElement("button");
    button.textContent = category.name;
    button.classList.add("filter-btn");
    button.dataset.categoryId = category.id;

    //Add CSS to style button
    button.style.borderRadius = "60px";
    button.style.color = "#1D6154";
    button.style.border = "1px solid #1D6154";
    button.style.backgroundColor = "white";
    button.style.fontFamily = "Syne";
    button.style.fontWeight = "700";
    button.style.padding = "9px";

    filtersContainer.appendChild(button);
  });

  // Insert the filters container after the title
  portfolioTitle.after(filtersContainer);

  // Add event listeners to filter buttons
  addFilterEventListeners();
};

// Function to add event listeners to filter buttons
const addFilterEventListeners = () => {
  const filterButtons = document.querySelectorAll(".filter-btn");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove active class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove("active"));

      // Add active class to clicked button
      button.classList.add("active");

      // Get the category ID to filter by
      const categoryId = button.dataset.categoryId;

      // Filter works by category ID
      filterWorksByCategory(categoryId);
    });
  });
};

// Function to filter works by category ID
const filterWorksByCategory = (categoryId) => {
  // Get all work items
  const workItems = document.querySelectorAll(".gallery figure");

  workItems.forEach((work) => {
    // If categoryId is 'all' or matches the work's category, show it
    if (categoryId === "all" || work.dataset.categoryId === categoryId) {
      work.style.display = "block";
    } else {
      work.style.display = "none";
    }
  });
};

// Function to create and display works in the gallery
const renderWorks = (works) => {
  // Remove all existing content in the gallery
  gallery.innerHTML = "";

  // Loop through each work and create the corresponding HTML structure
  works.forEach((work) => {
    // Create a figure element for each work
    const figure = document.createElement("figure");
    // Store the category ID as a data attribute for filtering
    figure.dataset.categoryId = work.categoryId.toString();

    // Create the image element and set its attributes
    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    // Create the figcaption element for the project title
    const figcaption = document.createElement("figcaption");
    figcaption.textContent = work.title;

    // Append image and caption to the figure
    figure.appendChild(img);
    figure.appendChild(figcaption);

    // Append the figure to the gallery
    gallery.appendChild(figure);
  });
};

// Function to fetch categories from the API
const fetchCategories = async () => {
  try {
    const response = await fetch("http://localhost:5678/api/categories");

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const categories = await response.json();
    return categories;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
};

// Function to fetch works from the API and render them
const fetchWorks = async () => {
  try {
    const response = await fetch("http://localhost:5678/api/works");

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    // Parse the response as JSON
    const works = await response.json();

    // Render the works in the gallery
    renderWorks(works);

    // Fetch categories and create filter buttons
    const categories = await fetchCategories();
    renderFilterButtons(categories);
  } catch (error) {
    console.error("Fetch error:", error);
    // Optionally display an error message in the gallery
    gallery.innerHTML = "<p>Failed to load projects.</p>";
  }
};

// Call the fetch function when the page loads
fetchWorks();

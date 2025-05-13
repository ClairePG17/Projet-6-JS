// Select the gallery container in the DOM
const gallery = document.querySelector(".gallery");

// Function to create and display works in the gallery
const renderWorks = (works) => {
  // Remove all existing content in the gallery
  gallery.innerHTML = "";

  // Loop through each work and create the corresponding HTML structure
  works.forEach((work) => {
    // Create a figure element for each work
    const figure = document.createElement("figure");

    // Create the image element and set its attributes
    const img = document.createElement("img");
    img.src = work.imageUrl; // Adapt property name if needed
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

// Function to fetch works from the API and render them
const fetchWorks = async () => {
  try {
    const response = await fetch("http://localhost:5678/api/works", {
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc0NzEzODAyMSwiZXhwIjoxNzQ3MjI0NDIxfQ.aEW0U41-XZdS5TpGgpZVRAHlMCjI_9PxYAUkjAfIsDI",
      },
    });

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    // Parse the response as JSON
    const works = await response.json();

    // Render the works in the gallery
    renderWorks(works);
  } catch (error) {
    console.error("Fetch error:", error);
    // Optionally display an error message in the gallery
    gallery.innerHTML = "<p>Failed to load projects.</p>";
  }
};

// Call the fetch function when the page loads
fetchWorks();

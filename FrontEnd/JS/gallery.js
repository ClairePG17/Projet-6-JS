export let worksData = [];

export const gallery = document.querySelector(".gallery");
export const portfolioSection = document.getElementById("portfolio");
export const portfolioTitle = portfolioSection?.querySelector("h2");



(async function () {
    try {
      const [works, categories] = await Promise.all([
        fetchData(`${API_BASE_URL}/works`),
        fetchData(`${API_BASE_URL}/categories`),
      ]);
  
      worksData = works;
      renderWorks(worksData);
      renderFilterButtons(categories);
      setupFilters();
  
    } catch (error) {
      handleFetchError(error);
    }
  })();
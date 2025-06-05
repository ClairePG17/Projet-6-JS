import { fetchData } from "./call-api.js";
import { API_BASE_URL } from "./login.js";
import {
  renderWorks,
  renderFilterButtons,
  handleFetchError,
} from "./utility-fonctions.js";

export let worksData = [];

export const gallery = document.querySelector(".gallery");
export const portfolioSection = document.getElementById("portfolio");
export const portfolioTitle = portfolioSection?.querySelector("h2");

export async function initGallery() {
  try {
    const [works, categories] = await Promise.all([
      fetchData(`${API_BASE_URL}/works`),
      fetchData(`${API_BASE_URL}/categories`),
    ]);

    worksData = works;

    renderWorks(worksData);
    renderFilterButtons(categories);

  } catch (error) {
    handleFetchError(error);
  }
}

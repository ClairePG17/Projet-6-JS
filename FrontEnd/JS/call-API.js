export async function fetchData(url, options = {}) {
  const response = await fetch(url, options);

  if (!response.ok) {
    if (response.status === 401 || response.status === 404) {
      throw new Error("Authentication error");
    }
    throw new Error(`HTTP error: ${response.status}`);
  }

  if (response.status === 204) return {};

  return response.json();
}

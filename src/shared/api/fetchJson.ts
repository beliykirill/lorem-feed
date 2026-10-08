export const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

// GET a JSON resource. The result is unknown: callers validate it.
export async function fetchJson(url: string): Promise<unknown> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`GET ${url} failed with HTTP ${response.status}`);
  }
  return response.json();
}

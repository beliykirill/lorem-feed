export const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

export async function fetchJson(url: string): Promise<unknown> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`GET ${url} failed with HTTP ${response.status}`);
  }

  return response.json();
}

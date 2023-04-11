const HN_API_BASE = "https://hacker-news.firebaseio.com/v0/item";

export type ItemV0 = {
  id: number;
  time: number;
  title: string;
  type: string;
  parent?: number;
  kids?: number[];
  by: string;
  score?: number;
  descendants?: number;
  text?: string;
};

/**
 * Fetches an item from the Hacker News API given an ID
 * @param id The ID of the item to fetch
 * @returns A promise that resolves to the fetched item
 */
export async function fetchItem(id: number): Promise<ItemV0> {
  try {
    const response = await fetch(`${HN_API_BASE}/${id}.json`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${id}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return Promise.reject(error);
  }
}

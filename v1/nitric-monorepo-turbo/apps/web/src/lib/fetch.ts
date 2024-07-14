if (process.env.BASE_URL === undefined) {
  throw new Error("BASE_URL is not defined");
}

// a wrapper for fetch that automatically adds the base URL and JSON headers
export default async function <T>(url: string, init?: RequestInit): Promise<T> {
  const response = (await fetch(process.env.BASE_URL + url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  })) as Response;

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json();
}

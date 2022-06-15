export const fetcher = (url, data) =>
  fetch(process.env.NEXT_PUBLIC_BASE_URL + url, {
    method: data ? "POST" : "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: data ? JSON.stringify(data) : null,
  }).then((r) => {
    return r.json();
  });

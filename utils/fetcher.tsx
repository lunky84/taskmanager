export const fetcher = (url, data) =>
  fetch(window.location.origin + url, {
    method: data ? "POST" : "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: data ? JSON.stringify(data) : null,
  }).then((r) => {
    return r.json();
  });

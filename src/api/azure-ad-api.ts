import fetch from "node-fetch"

function api <T>(url: string, params: URLSearchParams): Promise<T> {
  return fetch(url, {method: "POST", body: params})
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      return response.json<T>()
    })
}

export default api

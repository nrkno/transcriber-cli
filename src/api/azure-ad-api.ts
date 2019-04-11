import fetch from "node-fetch"

export interface IAzureAdTokens {
  idToken: string,
  accessToken: string,
  refreshToken: string
}
function api <T>(url: string, params: URLSearchParams): Promise<T> {
  return fetch(url, {method: "POST", body: params})
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      const responseJson = response.json<T>()
      //console.log("Response from ", url, ", is: ", responseJson)
      return responseJson
    })
}

export default api

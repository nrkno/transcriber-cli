import fetch from "node-fetch"

export interface IFirebaseTokens {
  idToken: string,
  accessToken: string,
  refreshToken: string
}
function firebaseApi <T>(url: string, params: URLSearchParams, headers: any): Promise<T> {
  return fetch(url, {method: "POST", body: params, headers})
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      const responseJson = response.json<T>()
      console.log("Response from ", url, ", is: ", responseJson)
      return responseJson
    })
    .catch(error => {
      console.log("Failed to POST to firebaseAPI. url: ", url, ". Headers: ", headers, ". Error: ", error)
      throw new Error("Failed to POST to url: " + url + ". Reson: " + error)
    })
}
/*
function fetchTokens(url: string, params: URLSearchParams): IAzureAdTokens {
  const adTokens = fetch(url, {method: "POST", body: params})
    .then(async response => {
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      const responseJson = await response.json()
      console.log("Response from ", url, ", is: ", responseJson)
      const tokens = {
        idToken: responseJson.id_token,
        accessToken: responseJson.access_token,
        refreshToken: responseJson.refresh_token
      }
      return tokens
    })
  return adTokens
}


export default {api, fetchTokens}
*/
export default firebaseApi

import {Command, flags} from "@oclif/command"
import open from "open"

import api, {IAzureAdTokens} from "../../api/azure-ad-api"
import firebaseApi from "../../api/firebase-api"
import {saveTokenToLocalConfig} from "../../config/config"
import {Constants} from "../../config/constants"

export default class Azure extends Command {
  static description = "Login using Azure Ad"

  static examples = [
    "$ transcribe login:azure -c client_id -o tennant_organization_name -p firebase_project_name",
  ]
  static flags = {
    help: flags.help({char: "h"}),
    // flag with a value (-n, --name=VALUE)
    clientId: flags.string({char: "c", description: "Azure Ad clientId"}),
    orgname: flags.string({char: "o", description: "Azure Ad tennant organization name"}),
    firebaseProjectName: flags.string({char: "p", description: "Firebase project name"})
  }

  async run() {
    const {flags} = this.parse(Azure)

    if (flags.clientId && flags.orgname) {
      const adUri = "https://login.microsoftonline.com/" + flags.orgname + ".onmicrosoft.com/oauth2/devicecode" //flags.adUri

      const params = new URLSearchParams()
      params.append("client_id", flags.clientId)
      params.append("scope", "user.read openid profile")
      const devicecode = await api<{ user_code: string; device_code: string }>(adUri, params)
        .then(({user_code, device_code}) => {
          this.log("Please add this code to the Chrome window popping up: ", user_code)
          // this.log(user_code, device_code)
          return device_code
        })
        .catch(error => {
          this.log(error)
        })
      if (devicecode) {
        await open("https://microsoft.com/devicelogin")
        this.log("Waiting 60 seconds for You to enter the code, and accept connection request.")
        //TODO repeat request every x seconds until user has accepted.
        setTimeout(() => {
          this.log("Try to fetch the Azure Ad Id token.")
          const tokens = this.fetchIdToken(flags, devicecode)
          tokens
            .then(values => {
              this.log("Tokens: ", values)
              const firebaseTokens = this.validateAzureAdTokens(flags, values)
              firebaseTokens
                .then(fbValues => {
                  this.log("Custom token from firebase: ", fbValues)
                  saveTokenToLocalConfig(Constants.FIREBASE_CUSTOM_TOKEN, fbValues.firebaseCustomToken)
                })
                .catch(error => {
                  this.log("Failed to fetch customToken from Firebase. Reason: ", error)
                  throw error
                })
            })
            .catch(error => {
              this.log("Failed to fetch userToken from AzureAd. Reason: ", error)
            })
        }, 60000)
      }
    } else {
      this.log("Missing required parameters -c azure_ad_client_id and -o azure_ad_organization_name")
    }
  }
  private async fetchIdToken(flags: any, devicecode: any): Promise<IAzureAdTokens> {
    const validateTokenParams = new URLSearchParams()
    validateTokenParams.append("grant_type", "urn:ietf:params:oauth:grant-type:device_code")
    validateTokenParams.append("client_id", flags.clientId)
    validateTokenParams.append("device_code", devicecode)
    const tokenUri = "https://login.microsoftonline.com/" + flags.orgname + ".onmicrosoft.com/oauth2/v2.0/token"
    const tokens = await api<{ id_token: string; access_token: string; refresh_token: string }>(tokenUri, validateTokenParams)
      .then(({id_token, access_token, refresh_token}) => {
        // this.log("IdToken: ", id_token, " at: ", access_token, " rt: ", refresh_token)
        const asureIdTokens: IAzureAdTokens = {
          idToken: id_token,
          accessToken: access_token,
          refreshToken: refresh_token
        }
        return asureIdTokens
      })
      .catch(error => {
        this.log(error)
        return {}
      })
    this.log("Received azureIdTooken: ", tokens.idToken)
    return tokens
  }
  /*
  const adTokens = await fetchTokens(tokenUri, validateTokenParams)

    .then((adTokens: IAzureAdTokens) => {
      // this.log("IdToken: ", id_token, " at: ", access_token, " rt: ", refresh_token)
      const tokens = {
        azureIdToken: adTokens.idToken,
        azureAccessToken: adTokens.accessToken,
        azureRefreshToken: adTokens.refreshToken
      }
      return tokens
    })
    .catch(error => {
      this.log(error)
      throw error
    })
  this.log("Received azureIdTooken: ", tokens.azureIdToken)

  const tokens = {
    azureIdToken: adTokens.idToken,
    azureAccessToken: adTokens.accessToken,
    azureRefreshToken: adTokens.refreshToken
  }
  this.log("Received azureIdTooken: ", tokens.azureIdToken)
  return tokens

}
 */

  private async validateAzureAdTokens(flags: any, tokens: IAzureAdTokens) {
    if (flags.projectname && tokens.idToken) {
      const validateAdTokenParams = new URLSearchParams()
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + tokens.accessToken
      }
      const tokenUri = "https://europe-west1-" + flags.projectname + ".cloudfunctions.net/jwttoken"
      const firebaseTokens = await firebaseApi<{ token: string }>(tokenUri, validateAdTokenParams, headers)
        .then(({token}) => {
          // this.log("IdToken: ", id_token, " at: ", access_token, " rt: ", refresh_token)
          const fbTokens = {
            firebaseCustomToken: token
          }
          return fbTokens
        })
        .catch(error => {
          this.log(error)
          throw error
        })
      this.log("Received firebaseCustomToken: ", firebaseTokens.firebaseCustomToken)
      return firebaseTokens

    } else {
      throw new Error("Missing parameters. firebaseProjectName: " + flags.projectname + ". azureIdToken: " + tokens.idToken)
    }
  }
}

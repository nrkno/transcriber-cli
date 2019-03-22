import {Command, flags} from "@oclif/command"
// @ts-ignore
import firebase from "firebase/app"
import "firebase/auth"

export default class Login extends Command {
  static description = "describe the command here"

  static examples = [
    `$ transcribe login
login -u user_name -p password
`,
  ]
  static flags = {
    help: flags.help({char: "h"}),
    // flag with a value (-n, --name=VALUE)
    username: flags.string({char: "u", description: "email to use for login"}),
    password: flags.string({char: "p", description: "password"}),
    // flag with no value (-f, --force)
  }

  static args = [{name: "file"}]

  firebaseConfig = {
    apiKey: "TODO",
    authDomain: "<project-id>.firebaseapp.com",
    databaseURL: "https://<project-id>.firebaseio.com",
    projectId: "<firebase-project-id>",
    storageBucket: "<project-id>.appspot.com",
    messagingSenderId: "TODO"
  }

  async run() {
    const {flags} = this.parse(Login)

    const username = flags.username
    const password = flags.password
    this.log(`login ${username} `)
    if (flags.username && flags.password) {
      this.log(`attempt to login using username: ${username}`)
      this.log("config: ", this.firebaseConfig)
      firebase.initializeApp(this.firebaseConfig)
      // let auth = firebase.auth()
      // console.log("Auth:", auth)

      await firebase.auth().signInWithEmailAndPassword(username, password)
      const token = await firebase.auth().currentUser.getIdToken(true)

      this.log("firebaseIdToken: ", token)


      // credentials = firebase.auth().signInWithEmailAndPassword(username, password).then((credentials: any) => {
      //   this.log("Loged in")
      //   firebase.auth().currentUser.getIdToken(true).then((token: any) => {
      //     this.log("usertoken: ", token)
      //   })
      //   return credentials
      // }).catch((error: any) => {
      //   const errorCode = error.code
      //   const errorMessage = error.message
      //   this.log(errorCode, errorMessage)
      // })
      //
      // if (credentials) {
      //   firebase.auth().currentUser.getIdToken(true).then((token: any) => {
      //     this.log("usertoken outside: ", token)
      //   })
      // }
      /*
      this.log("current user: ", firebase.auth())
      firebase.auth().currentUser.getIdToken(true).then((idToken: string) => {
        this.log("idToken: ", idToken)
      }).catch((error: any) => {
        const errorCode = error.code
        const errorMessage = error.message
        this.log(errorCode, errorMessage)
      })
      */
      this.log("Done")
    }
  }
}

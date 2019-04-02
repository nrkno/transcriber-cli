import Configstore from "configstore"

const pakageName = "transcriber"

function saveTokenToLocalConfig(tokenName: string, token: string) {
  const conf = new Configstore(pakageName)
  conf.set(tokenName, token)
}

function setParameter(key: string, value: string) {
  const conf = new Configstore(pakageName)
  return conf.set(key, value)
}

function getParameter(key: string) {
  const conf = new Configstore(pakageName)
  return conf.get(key)
}

export {saveTokenToLocalConfig, getParameter, setParameter}

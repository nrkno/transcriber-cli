transcribe-cli
==============

Transcribe an audio file.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/transcribe-cli.svg)](https://npmjs.org/package/transcribe-cli)
[![Downloads/week](https://img.shields.io/npm/dw/transcribe-cli.svg)](https://npmjs.org/package/transcribe-cli)
[![License](https://img.shields.io/npm/l/transcribe-cli.svg)](https://github.com/nrkno/transcriber-cli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g transcribe-cli
$ transcribe COMMAND
running command...
$ transcribe (-v|--version|version)
transcribe-cli/0.0.1 darwin-x64 node-v11.8.0
$ transcribe --help [COMMAND]
USAGE
  $ transcribe COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`transcribe login -u email -p password`](#transcribe-login)
* [`transcribe help [COMMAND]`](#transcribe-help-command)

## `transcribe login`

describe the command here

```
USAGE
  $ transcribe login -u email -p password 

OPTIONS
  -h, --help               show CLI help
  -u, --username=email     users email used on firebase 
  -p, --password=password  users password on firebase

EXAMPLE
  $ transcribe login -u <user-email> -p <user-password>
  Logged in, idToken is: <token>
```

_See code: [src/commands/login.ts](https://github.com/nrkno/transcriber-cli/blob/v0.0.1/src/commands/login.ts)_

## `transcribe help [COMMAND]`

display help for transcribe

```
USAGE
  $ transcribe help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.6/src/commands/help.ts)_
<!-- commandsstop -->

# Developer? 
Read here [Readme for Developers](README_DEVELOPER.md)

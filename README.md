# sstorer

Written in TypeScript, this module sstorer (or session storer), allows you to store variables separate for separate sessions effectively and efficiently... The storage is simply a JSON, with a sessionID as key (any pass key that differentiates two containers of storage), and another JSON that contains the variables, as the respective value. This module can be used in JavaScript and TypeScript projects

## Some points

Here, we do not keep checking async whether the sessions have expired. Instead whenever a call comes to the storage, a check is done whether the session has expired or not. So, its extremely efficient. At the same time, you have to keep refreshing the session whenever you deem fit

### Prerequisites

Have nodeJS and NPM installed in your machine

## Getting Started

Install the library from NPM and use it! The examples shown below will help get you started

```powershell
npm i sstorer
```

```ts
import sstorer = require("sstorer");
/*
or import * as sstorer from "sstorer";
*/

// Create the object that contains everything needed
// param 'duration' is the lifetime of each session in minutes
let store = sstorer.init(duration: number)

// Should you choose to change in between
store.setDuration(duration: number)

// Refreshes the timestamp on the session
store.refreshSession(sessionid: string): boolean

// Starts a new sesssion storage with the sessionid given
store.spawnSession(sessionid: string): void

// Kills the sesssion storage with the sessionid given
store.killSession(sessionid: string): void

// Tells you whether the session is active or not
store.isSessionActive(sessionid): boolean

// Inserts/Modifies a variable under the sessionid given, under the name paramName and the value paramValue
store.putVar(sessionid, paramName, paramVal): boolean

// Returns the value of the variable in the session storage
store.getVar(sessionid, paramName): any 

// These are for saving and retrieving the data from files
store.dump(fname: string): boolean
store.load(fname: string): boolean
```

## Authors

* **Hari.R** - [haricane8133](https://github.com/haricane8133)

## License

This project is licensed under the GNU LGPL V3  License - see the [LICENSE.md](LICENSE.md) file for details

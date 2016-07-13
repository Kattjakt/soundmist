<img style="float: right; width: 200px" src="http://i.imgur.com/8r6wXYS.png">

# Soundmist
A Soundcloud desktop client for Windows, Linux and Mac OS X. Built with Electron and AngularJS.

### Prerequisites
The first step is to register an SC app [here](http://soundcloud.com/you/apps). The Client ID and Client Secret will be automatically generated, but you'll have to enter `http://127.0.0.1:3000/callback` in the _Redirect URL_-field so we can fetch the token later on.

To authenticate we need to set up our own backend. The one I'm using can be found [here](https://github.com/Kattjakt/soundmist-auth) and is started by running `npm install && node index.js` in the root directory.

### Running and Building
Running the application is done through either `npm run watch-linux` or `npm run watch-windows` which will start a _livereload_-session and watch the working directory for changes.

Building is done with `electron-packager` and is initiated with `npm run build` which will build packages for Windows (_32/64 bit_), Linux (_x86/x86-64_) and Darwin. Generated packages can be found in the `dist`-folder.

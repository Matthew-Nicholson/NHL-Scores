Desktop widget that shows today's NHL scores around the league.

[![NHL-Scores-Expanded.png](https://i.postimg.cc/QCVkY29y/NHL-Scores-Expanded.png)](https://postimg.cc/hQWdf30L)

### Installing
Runs with Electron.js. Electron is not fully compatable with Node 18 yet, so Node version 16 should be preferred. You will also need the Vue CLI installed.

To get a working copy clone the repository and then run:

```npm install```

Then:
```npm run electron:serve```

This will run a demo version of the app. You will also need to run the NHL-Scores API to get live scores rather than a demo.

To build for production: 
```npm run electron:build```

### Using NHL-Scores
Click and drag to move the app around the window.
App can be closed from the taskbar, or right click and close.
Double click a game to focus on that game and hide the rest.

### Contact
matthewn1991@gmail.com
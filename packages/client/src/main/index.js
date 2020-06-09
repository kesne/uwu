import path from 'path';
import url from 'url';
import { app } from 'electron';
import is from 'electron-is';
import { menubar } from 'menubar';
import { autoUpdater } from 'electron-updater';

autoUpdater.checkForUpdatesAndNotify();

let mb;

app.commandLine.appendSwitch('ignore-certificate-errors');

console.log(menubar);

app.on('ready', () => {
    mb = menubar({
        index: is.dev()
            ? `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`
            : url.format({
                  pathname: path.join(__dirname, 'index.html'),
                  protocol: 'file:',
                  slashes: true,
              }),
        // icon: path.resolve(__dirname, 'IconTemplate.png'),
        tooltip: 'UwU',
        width: 350,
        height: 460,
        fullscreenable: false,
        resizable: false,
        transparent: true,
        browserWindow: {
            webPreferences: {
                nodeIntegration: true,
            },
        },
        alwaysOnTop: true,
        showOnAllWorkspaces: false,
        // preloadWindow: true,
    });

    mb.on('after-create-window', () => {
        // if (is.dev()) {
        mb.window.webContents.openDevTools({ mode: 'undocked' });
        // }
    });
});

app.on('window-all-closed', (event) => {
    app.dock.hide();
    event.preventDefault();
});

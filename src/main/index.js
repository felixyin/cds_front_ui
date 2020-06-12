import {app, Menu, shell, BrowserWindow, ipcMain} from 'electron'

// require('electron-debug')({ showDevTools: true })
// require('electron').app.on('ready', () => {
//     let installExtension = require('electron-devtools-installer')
//     installExtension.default(installExtension.VUEJS_DEVTOOLS)
//         .then(() => {})
//         .catch(err => {
//             alert('Unable to install `vue-devtools`: \n', err)
//         })
// })

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
let winURL = process.env.NODE_ENV === 'development'
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`

// winURL = `http://127.0.0.1:61433/index.html`;


function createWindow() {
    /**
     * Initial window options
     */
    mainWindow = new BrowserWindow({
        frame: false,
        title:'晟时科技',
        titleBarStyle: 'hidden',
        transparent: true,
        height: 760,
        useContentSize: true,
        minHeight: 750,
        width: 1280,
        minWidth: 1200,
        webPreferences: {
            webSecurity: false,
            allowRunningInsecureContent: true,
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
        }
    })

    // mainWindow.webContents.openDevTools();

    mainWindow.loadURL(winURL)


    ipcMain.on('min', e => mainWindow.minimize());

    global.__isMaximized = false;
    ipcMain.on('max', e => {
        if (global.__isMaximized) {
            mainWindow.unmaximize()
            global.__isMaximized = false;
        } else {
            mainWindow.maximize()
            global.__isMaximized = true;
        }
    });

    ipcMain.on('close', e => {
        mainWindow.close();
    });


    function my() {
        shell.openExternal('http://www.yinbin.ink');
    }

    let template = [
        {
            label: '刷新',
            click: function () {
                mainWindow.reload();
            }
        }, {
            label: '关于',
            submenu: [
                {
                    label: '技术支持：青岛前途软件技术有限公司',
                    click: my
                },
                {
                    label: '联系人：尹彬',
                    click: my
                },
                {
                    label: '电话：17554153785',
                    click: my
                },
            ],
        }
    ];

    // 隐藏菜单
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
    // mainWindow.setMenu(menu);
    mainWindow.setMenuBarVisibility(false);

    mainWindow.on('closed', () => {
        mainWindow = null
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
});

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */

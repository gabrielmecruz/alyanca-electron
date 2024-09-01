import { app, BrowserWindow, shell, ipcMain } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import os from 'node:os'
import { update } from './update'
import { resolve } from 'path'
import axios from "axios"
import fs from 'fs'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

process.env.APP_ROOT = path.join(__dirname, '../..')

export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')
export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST

// Disable GPU Acceleration for Windows 7
if (os.release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

let win: BrowserWindow | null = null
const preload = path.join(__dirname, '../preload/index.mjs')
const indexHtml = path.join(RENDERER_DIST, 'index.html')

async function createWindow() {
  const appIcon = resolve(__dirname, '../..', 'public', 'appIcon2.png')
  win = new BrowserWindow({
    title: 'Sistema Gerenciador de Recibos Alyança Contabilidade v1',
    icon: appIcon,
    webPreferences: {
      preload,
      contextIsolation: true,
      nodeIntegration: false
    },
    width: 600,
    height: 500
  })

  win.setMinimumSize(600, 600)
  win.setMaximumSize(1920, 1080)

  if (VITE_DEV_SERVER_URL) { // #298
    win.loadURL(VITE_DEV_SERVER_URL)
    // Open devTool if the app is not packaged
    // win.webContents.openDevTools()
  } else {
    win.loadFile(indexHtml)
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })

  // Auto update
  update(win)
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${VITE_DEV_SERVER_URL}#${arg}`)
  } else {
    childWindow.loadFile(indexHtml, { hash: arg })
  }
})

ipcMain.on('close', () => {
  win?.close()
  win = null
})

//Requisicoes Servidor
const urlServer = 'http://127.0.0.1:3000/api';
mainRequestsHandle(urlServer)

function mainRequestsHandle(urlServer: string) {
  //Clientes
  ipcMain.handle("get-clientes-response", async () => {
    const response = await axios.get(`${urlServer}/Clientes`)
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return (error)
      });
    return response;
  })

  ipcMain.handle("get-cliente-response", async (event: any, id: any) => {
    const response = await axios.get(`${urlServer}/Clientes/${id}`)
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return (error)
      });
    return response;
  })

  ipcMain.handle("add-cliente-response", async (event: any, cliente: any) => {
    const response = await axios.post(`${urlServer}/Clientes`, cliente)
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return (error)
      });
    return response;
  })

  ipcMain.handle("update-cliente-response", async (event: any, { id, cliente }) => {
    const response = await axios.put(`${urlServer}/Clientes/${id}`, cliente)
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return (error)
      });
    return response;
  })

  ipcMain.handle("delete-cliente-response", async (event: any, id: any) => {
    const response = await axios.delete(`${urlServer}/Clientes/${id}`)
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return (error)
      });
    return response;
  })

  //Recibos
  ipcMain.handle("get-recibos-response", async () => {
    const response = await axios.get(`${urlServer}/recibo`)
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return (error)
      });
    return response;
  })

  ipcMain.handle("get-recibo-response", async (event: any, id: any) => {
    const response = await axios.get(`${urlServer}/recibo/${id}`)
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return (error)
      });
    return response;
  })

  ipcMain.handle("add-recibo-response", async (event: any, recibo: any) => {
    const response = await axios.post(`${urlServer}/recibo`, recibo)
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return (error)
      });
    return response;
  })

  ipcMain.handle("update-recibo-response", async (event: any, { id, recibo }) => {
    const response = await axios.put(`${urlServer}/recibo/${id}`, recibo)
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return (error)
      });
    return response;
  })

  ipcMain.handle("delete-recibo-response", async (event: any, id: any) => {
    const response = await axios.delete(`${urlServer}/recibo/${id}`)
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return (error)
      });
    return response;
  })

  //Descricoes
  ipcMain.handle("get-descricoes-response", async () => {
    const response = await axios.get(`${urlServer}/descricoes`)
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return (error)
      });
    return response;
  })

  ipcMain.handle("add-descricao-response", async (event: any, desc: any) => {
    const response = await axios.post(`${urlServer}/descricoes`, desc)
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return (error)
      });
    return response;
  })

  ipcMain.handle("update-descricao-response", async (event: any, { id, desc }) => {
    const response = await axios.put(`${urlServer}/descricoes/${id}`, desc)
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return (error)
      });
    return response;
  })

  ipcMain.handle("delete-descricao-response", async (event: any, id: any) => {
    const response = await axios.delete(`${urlServer}/descricoes/${id}`)
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return (error)
      });
    return response;
  })

  //Corpo do Recibo
  ipcMain.handle("get-corpo-recibos-response", async () => {
    const response = await axios.get(`${urlServer}/corpoRecibo`)
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return (error)
      });
    return response;
  })

  ipcMain.handle("add-corpo-recibo-response", async (event: any, recibo: any) => {
    const response = await axios.post(`${urlServer}/corpoRecibo`, recibo)
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return (error)
      });
    return response;
  })

  ipcMain.handle("update-corpo-recibo-response", async (event: any, { id, recibo }) => {
    const response = await axios.put(`${urlServer}/corpoRecibo/${id}`, recibo)
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return (error)
      });
    return response;
  })

  ipcMain.handle("delete-corpo-recibo-response", async (event: any, id: any) => {
    const response = await axios.delete(`${urlServer}/recibo/${id}`)
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        return (error)
      });
    return response;
  })
}

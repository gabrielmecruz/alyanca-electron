import { ipcRenderer, contextBridge } from 'electron';

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },
})

// Bridges das requisicoes do Servidor
let requestsRenderer = {
  // Clientes
  getClientes: async () => {
    var result = await ipcRenderer.invoke("get-clientes-response")
    return JSON.parse(JSON.stringify(result));
  },

  getCliente: async (id: any) => {
    var result = await ipcRenderer.invoke("get-cliente-response", id)
    return JSON.parse(JSON.stringify(result));
  },

  addCliente: async (cliente: any) => {
    var result = await ipcRenderer.invoke("add-cliente-response", cliente)
    return JSON.parse(JSON.stringify(result));
  },

  updateCliente: async (id: any, cliente: any) => {
    var result = await ipcRenderer.invoke("update-cliente-response", { id, cliente })
    return JSON.parse(JSON.stringify(result));
  },

  deleteCliente: async (id: any) => {
    var result = await ipcRenderer.invoke("delete-cliente-response", id)
    return JSON.parse(JSON.stringify(result));
  },

  // Recibos
  getRecibos: async () => {
    var result = await ipcRenderer.invoke("get-recibos-response")
    return JSON.parse(JSON.stringify(result));
  },

  getRecibo: async (id: any) => {
    var result = await ipcRenderer.invoke("get-recibo-response", id)
    return JSON.parse(JSON.stringify(result));
  },

  addRecibo: async (recibo: any) => {
    var result = await ipcRenderer.invoke("add-recibo-response", recibo)
    return JSON.parse(JSON.stringify(result));
  },

  updateRecibo: async (id: any, recibo: any) => {
    var result = await ipcRenderer.invoke("update-recibo-response", { id, recibo })
    return JSON.parse(JSON.stringify(result));
  },

  deleteRecibo: async (id: any) => {
    var result = await ipcRenderer.invoke("delete-recibo-response", id)
    return JSON.parse(JSON.stringify(result));
  },

  // Descrições
  getDescricoes: async () => {
    var result = await ipcRenderer.invoke("get-descricoes-response")
    return JSON.parse(JSON.stringify(result));
  },

  addDescricao: async (desc: any) => {
    var result = await ipcRenderer.invoke("add-descricao-response", desc)
    return JSON.parse(JSON.stringify(result));
  },

  updateDescricao: async (id: any, desc: any) => {
    var result = await ipcRenderer.invoke("update-descricao-response", { id, desc })
    return JSON.parse(JSON.stringify(result));
  },

  deleteDescricao: async (id: any) => {
    var result = await ipcRenderer.invoke("delete-descricao-response", id)
    return JSON.parse(JSON.stringify(result));
  },

  // Corpo do Recibo
  getCorpoRecibos: async () => {
    var result = await ipcRenderer.invoke("get-corpo-recibos-response")
    return JSON.parse(JSON.stringify(result));
  },

  // getCorpoRecibo: async (id: any) => {
  //   var result = await ipcRenderer.invoke("get-corpo-recibo-response", id)
  //   return JSON.parse(JSON.stringify(result));
  // },

  addCorpoRecibo: async (recibo: any) => {
    var result = await ipcRenderer.invoke("add-corpo-recibo-response", recibo)
    return JSON.parse(JSON.stringify(result));
  },

  updateCorpoRecibo: async (id: any, recibo: any) => {
    var result = await ipcRenderer.invoke("update-corpo-recibo-response", { id, recibo })
    return JSON.parse(JSON.stringify(result));
  },

  deleteCorpoRecibo: async (id: any) => {
    var result = await ipcRenderer.invoke("delete-corpo-recibo-response", id)
    return JSON.parse(JSON.stringify(result));
  },
}
contextBridge.exposeInMainWorld('api', requestsRenderer)

// --------- Preload scripts loading ---------
function domReady(condition: DocumentReadyState[] = ['complete', 'interactive']) {
  return new Promise(resolve => {
    if (condition.includes(document.readyState)) {
      resolve(true)
    } else {
      document.addEventListener('readystatechange', () => {
        if (condition.includes(document.readyState)) {
          resolve(true)
        }
      })
    }
  })
}

const safeDOM = {
  append(parent: HTMLElement, child: HTMLElement) {
    if (!Array.from(parent.children).find(e => e === child)) {
      return parent.appendChild(child)
    }
  },
  remove(parent: HTMLElement, child: HTMLElement) {
    if (Array.from(parent.children).find(e => e === child)) {
      return parent.removeChild(child)
    }
  },
}

/**
 * https://tobiasahlin.com/spinkit
 * https://connoratherton.com/loaders
 * https://projects.lukehaas.me/css-loaders
 * https://matejkustec.github.io/SpinThatShit
 */
function useLoading() {
  const className = `loaders-css__square-spin`
  const styleContent = `
@keyframes square-spin {
  25% { transform: perspective(100px) rotateX(180deg) rotateY(0); }
  50% { transform: perspective(100px) rotateX(180deg) rotateY(180deg); }
  75% { transform: perspective(100px) rotateX(0) rotateY(180deg); }
  100% { transform: perspective(100px) rotateX(0) rotateY(0); }
}
.${className} > div {
  animation-fill-mode: both;
  width: 50px;
  height: 50px;
  background: #fff;
  animation: square-spin 3s 0s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
}
.app-loading-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #282c34;
  z-index: 9;
}
    `
  const oStyle = document.createElement('style')
  const oDiv = document.createElement('div')

  oStyle.id = 'app-loading-style'
  oStyle.innerHTML = styleContent
  oDiv.className = 'app-loading-wrap'
  oDiv.innerHTML = `<div class="${className}"><div></div></div>`

  return {
    appendLoading() {
      safeDOM.append(document.head, oStyle)
      safeDOM.append(document.body, oDiv)
    },
    removeLoading() {
      safeDOM.remove(document.head, oStyle)
      safeDOM.remove(document.body, oDiv)
    },
  }
}

// ----------------------------------------------------------------------

const { appendLoading, removeLoading } = useLoading()
domReady().then(appendLoading)

window.onmessage = (ev) => {
  ev.data.payload === 'removeLoading' && removeLoading()
}

setTimeout(removeLoading, 4999)
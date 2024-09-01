import { ipcRenderer } from "electron";

const ClientesService = {

  async getClientes() {
    let response = await window.api.getClientes();
    return response;
  },

  async getCliente(id: any) {
    let response = await window.api.getCliente(id);
    return response;
  },

  async addCliente(cliente: any) {
    let response = await window.api.addCliente(cliente);
    return response;
  },

  async updateCliente(id: any, cliente: any) {
    let response = await window.api.updateCliente(id, cliente);
    return response;
  },

  async deleteCliente(idCliente: any) {
    let response = await window.api.deleteCliente(idCliente);
    return response;
  }
}

export default ClientesService;


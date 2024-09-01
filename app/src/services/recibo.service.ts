const RecibosService = {

  async getRecibos() {
    let response = await window.api.getRecibos();
    return response;
  },

  async getRecibo(id: any) {
    let response = await window.api.getRecibo(id);
    return response;
  },

  async addRecibo(recibo: any) {
    let response = await window.api.addRecibo(recibo);
    return response;
  },

  async updateRecibo(id: any, recibo: any) {
    let response = await window.api.updateRecibo(id, recibo);
    return response;
  },

  async deleteRecibo(recibo: any) {
    let response = await window.api.deleteRecibo(recibo);
    return response;
  }
}

export default RecibosService;


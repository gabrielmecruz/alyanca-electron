const CorpoRecibosService = {

  async getCorpoRecibos() {
    let response = await window.api.getCorpoRecibos();
    return response;
  },

  // async getCorpoRecibo(id: any) {
  //   let response = await window.api.getCorpoRecibo(id);
  //   return response;
  // },

  async addCorpoRecibo(corporecibo: any) {
    let response = await window.api.addCorpoRecibo(corporecibo);
    return response;
  },

  async updateCorpoRecibo(id: any, corporecibo: any) {
    let response = await window.api.updateCorpoRecibo(id, corporecibo);
    return response;
  },

  async deleteCorpoRecibo(corporecibo: any) {
    let response = await window.api.deleteCorpoRecibo(corporecibo);
    return response;
  }
}

export default CorpoRecibosService;


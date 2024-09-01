const DescricoesService = {

  async getDescricoes() {
    let response = await window.api.getDescricoes();
    return response;
  },

  async getDescricao(id: any) {
    let response = await window.api.getDescricao(id);
    return response;
  },

  async addDescricao(descricao: any) {
    let response = await window.api.addDescricao(descricao);
    return response;
  },

  async updateDescricao(id: any, descricao: any) {
    let response = await window.api.updateDescricao(id, descricao);
    return response;
  },

  async deleteDescricao(descricao: any) {
    let response = await window.api.deleteDescricao(descricao);
    return response;
  }
}

export default DescricoesService;


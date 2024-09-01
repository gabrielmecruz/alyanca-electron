export function createCorpoReciboRows(data: any, descricoes: any) {
  const rows = [];
  for (let i = 0; i < data.length; i++) {
    let desc = descricoes.find((item: any) => item.id == data[i].CodDaDescrição);
    let currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
    rows.push({
      id: i,
      descricao: desc.text,
      competencia: data[i].Competência,
      valor: currency.format(data[i].ValorAPagar)
    });
  }
  return rows;
}

export function createClienteRows(data: any) {
  const rows = [];
  for (let i = 0; i < data.length; i++) {
    rows.push({
      id: i,
      codCliente: data[i].Código_Cliente,
      razaoSocial: data[i].Razão_Social,
      cnpj: data[i].CNPJ,
      acoes: 'Editar / Exclur'
    });
  }
  return rows;
}

export function createReciboRows(data: any) {
  const rows = [];
  for (let i = 0; i < data.length; i++) {
    rows.push({
      id: i,
      codRecibo: data[i].Código_Recibo,
      emissao: data[i].Emissão,
      baixa: data[i].Baixa,
      dataBaixa: data[i].Data_Baixa,
      fechado: data[i].Fechado,
      acoes: 'Editar'
    });
  }
  return rows;
}
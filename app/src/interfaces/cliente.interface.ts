type Cliente = {
  codCliente: number;
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  ie: string;
  im: string;
  contatos: [contatoPrim: string, contatoSec: string];
  telefones: [telefonePrim: string, telefoneSec: string];
  emails: [emailPrim: string, emailSec: string];
  fax: string;
  site: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cep: string;
  uf: string;
};
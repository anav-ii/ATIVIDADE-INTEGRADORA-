export interface Endereco {
    IdEndereco?: number;
    IdPessoa?: number;
    CEP: string;
    Numero: string;
    Complemento?: string;
  }
  
  export interface Pessoa {
    IdPessoa?: number;
    Nome: string;
    CPF: number;
    DataNascimento: string;
    Sexo: string;
    Email: string;
    Telefone: number;
    AtivoPessoa: string;
    Enderecos: Endereco[];
  }
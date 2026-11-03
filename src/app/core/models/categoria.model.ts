// Interface que representa a Categoria no banco de dados.
// Usamos o ponto de interrogação (?) para indicar que as propriedades são opcionais.
export interface Categoria {
  // ID da categoria (pode vir como Idcategoria ou idcategoria do C#)
  Idcategoria?: number;
  
  // Nome da categoria.
  // O C# pode enviar como 'Categoriacol' (maiúsculo) ou 'categoriacol' (minúsculo).
  // Deixamos as duas opções para o Angular não quebrar em nenhum dos casos.
  Categoriacol?: string;
  categoriacol?: string;
}
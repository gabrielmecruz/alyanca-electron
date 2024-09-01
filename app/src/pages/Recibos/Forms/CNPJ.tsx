// import React from 'react';

interface ICNPJProps {
  cnpj: string;
  disabled?: boolean;
}

function CNPJInput({ cnpj, disabled = false }: ICNPJProps) {
  function mascaraCNPJ(valor: string) {
    return valor
      .replace(/\D/g, "") // Remove tudo o que não é dígito
      .replace(/^(\d{2})(\d)/, "$1.$2") // Coloca ponto entre o segundo e o terceiro dígitos
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3") // Coloca ponto entre o quinto e o sexto dígitos
      .replace(/\.(\d{3})(\d)/, ".$1/$2") // Coloca uma barra entre o oitavo e o nono dígitos
      .replace(/(\d{4})(\d)/, "$1-$2"); // Coloca um hífen depois do bloco de quatro dígitos
  }
  return (
    <input
      type="text"
      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      placeholder="CNPJ"
      maxLength={18}
      disabled={disabled}
      value={cnpj}
      onChange={(e) => {
        e.persist();
        mascaraCNPJ(e.target.value);
      }}
    />
  );
}

export default CNPJInput;

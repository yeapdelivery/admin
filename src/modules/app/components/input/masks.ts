export function currencyFormation(e: React.ChangeEvent<HTMLInputElement>) {
  let value = e.currentTarget.value;

  value = value.replace(/\D/g, "");
  value = value.replace(/(\d)(\d{2})$/, "$1,$2");
  value = value.replace(/(?=(\d{3})+(\D))\B/g, ".");

  e.currentTarget.value = `R$ ${value}`;

  return e;
}

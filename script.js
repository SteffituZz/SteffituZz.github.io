function toggleDarkMode() {
  document.body.classList.toggle("dark");
}

function oppdaterKlokke() {
  const nå = new Date();
  const timer = String(nå.getHours()).padStart(2, '0');
  const minutter = String(nå.getMinutes()).padStart(2, '0');
  const sekunder = String(nå.getSeconds()).padStart(2, '0');

  document.getElementById("klokke").textContent = `${timer}:${minutter}:${sekunder}`;
}

oppdaterKlokke();
setInterval(oppdaterKlokke, 1000);

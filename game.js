// Lokal lagring
function saveProgress() {
  localStorage.setItem('xp', document.getElementById('xp').textContent);
  localStorage.setItem('gold', document.getElementById('gold').textContent);
}

function loadProgress() {
  const savedXP = localStorage.getItem('xp');
  const savedGold = localStorage.getItem('gold');
  if (savedXP !== null) document.getElementById('xp').textContent = savedXP;
  if (savedGold !== null) document.getElementById('gold').textContent = savedGold;
}

window.onload = loadProgress;


const contentBox = document.getElementById('content');
let isBusy = false;

function log(message) {
  const time = new Date().toLocaleTimeString();
  contentBox.innerHTML = `<p>[${time}] ${message}</p>` + contentBox.innerHTML;
}

function wait(seconds) {
  isBusy = true;
  setTimeout(() => {
    isBusy = false;
  }, seconds * 1000);
}

function chance(percent) {
  return Math.random() < percent / 100;
}

function clearContent() {
  contentBox.innerHTML = '';
}

function showContent(type) {
  clearContent();

  if (isBusy) {
    log('⏳ Du er opptatt. Vent litt før du gjør en ny handling.');
    return;
  }

  switch (type) {
    case 'reise':
      contentBox.innerHTML = `
        <p>Velg landsby å reise til:</p>
        <button onclick="startReise('Eldhavn')">Eldhavn</button>
        <button onclick="startReise('Tåkefjell')">Tåkefjell</button>
        <button onclick="startReise('Skogrand')">Skogrand</button>
        <button onclick="startReise('Dypmyr')">Dypmyr</button>
        <button onclick="startReise('Stjernedal')">Stjernedal</button>
      `;
      break;

    case 'smajobber':
      contentBox.innerHTML = `
        <p>Velg småjobb:</p>
        <button onclick="doSmajobb(1)">Lett</button>
        <button onclick="doSmajobb(2)">Lettere</button>
        <button onclick="doSmajobb(3)">Medium</button>
        <button onclick="doSmajobb(4)">Vanskelig</button>
        <button onclick="doSmajobb(5)">Veldig vanskelig</button>
      `;
      break;

    case 'kriminalitet':
      contentBox.innerHTML = `
        <p>Velg kriminell handling:</p>
        <button onclick="doKrim(1)">Lett</button>
        <button onclick="doKrim(2)">Lettere</button>
        <button onclick="doKrim(3)">Medium</button>
        <button onclick="doKrim(4)">Vanskelig</button>
        <button onclick="doKrim(5)">Veldig vanskelig</button>
      `;
      break;

  }
}

// Eksempel: funksjon for reise
function startReise(landsby) {
  log(`🧭 Du starter reisen til ${landsby}... (5 sekunder)`);
  wait(5);
  setTimeout(() => {
    log(`🏰 Du har ankommet ${landsby}!`);
    document.querySelector('.profile-info p:nth-child(3)').innerHTML = `<strong>Landsby:</strong> ${landsby}`;
  }, 5000);
}


function doSmajobb(level) {
  const chances = [90, 80, 70, 60, 50];
  const payouts = [10, 20, 30, 40, 50];
  const waitTime = 120; // 2 minutter

  log(`💼 Du utfører en småjobb (nivå ${level})... Ventetid: 2 minutter`);
  
  const jobResultTime = Date.now() + waitTime * 1000;

  const interval = setInterval(() => {
    const remaining = Math.max(0, Math.ceil((jobResultTime - Date.now()) / 1000));
    document.getElementById('content').querySelector('p').innerText = `Tid igjen: ${remaining} sekunder`;
    if (remaining <= 0) {
      clearInterval(interval);
      const success = chance(chances[level - 1]);
      if (success) {
        const gold = payouts[level - 1];
        const xp = level * 3;
        updateStat('gold', gold);
        updateStat('xp', xp);
        log(`✅ Du fullførte jobben og fikk ${gold} gull og ${xp} XP!`);
      } else {
        log('❌ Du mislyktes med jobben.');
      }
      saveProgress();
    }
  }, 1000);
}


function doKrim(level) {
  const chances = [60, 50, 40, 30, 20];
  const payouts = [60, 70, 80, 90, 100];
  const jailTimes = [90, 130, 170, 210, 250]; // sekunder

  log(`🕵️ Du forsøker kriminalitet nivå ${level}...`);
	simulateJailTime(jailTimes[level - 1]);
  setTimeout(() => {
    const success = chance(chances[level - 1]);
    if (success) {
      const gold = payouts[level - 1];
      updateStat('gold', gold);
      log(`💰 Du lyktes og fikk ${gold} gull!`);
    } else {
      const jail = jailTimes[level - 1];
      log(`🚨 Du ble tatt! Fengsel i ${jail} sekunder.`);
      simulateJailTime(jail);
    }
    saveProgress();
  }, 2000);
}

// Dummy-funksjoner for nå:

function updateStat(stat, amount) {
  const el = document.getElementById(stat);
  el.textContent = parseInt(el.textContent) + amount;
}
let playersData = [];

// Helper to parse streak info
function parseStreak(streakString) {
  const streakArray = streakString.split(",").map(s => s.trim());
  const latest = streakArray[streakArray.length - 1];
  const wins = streakArray.filter(s => s === "W").length;
  const losses = streakArray.filter(s => s === "L").length;
  const latestClass = latest === "W" ? "streak-win" : "streak-loss";

  return { streakArray, latest, latestClass, wins, losses };
}

// Load players.json and display players
fetch("players.json")
  .then(res => res.json())
  .then(players => {
    // Convert number-like fields to numbers
    playersData = players.map(p => ({
      ...p,
      goals: Number(p.goals),
      motm: Number(p.motm),
      cleanSheets: Number(p.cleanSheets)
    }));
    displayPlayers(playersData);
  })
  .catch(err => console.error("Error loading players:", err));

// Display players
function displayPlayers(players) {
  const container = document.getElementById("player-list");
  container.innerHTML = "";

  if (!players.length) {
    container.innerHTML = "<p>No players found.</p>";
    return;
  }

  players.forEach(player => {
    const card = document.createElement("div");
    card.className = "player-card";

    const { latestClass, latest, wins, losses } = parseStreak(player.streak);

    // Badge
    const streakBadge = document.createElement("div");
    streakBadge.className = `streak-badge ${latestClass}`;
    streakBadge.textContent = latest === "W" ? "Win" : "Loss";

    // Card content
    card.innerHTML = `
      <img src="${player.photo}" alt="Photo of ${player.name}">
      <h3>${player.name}</h3>
      <div class="stats">
        <p class="${latestClass}">🏆 Streak: ${player.streak}</p>
        <p>✅ Wins: ${wins}</p>
        <p>❌ Losses: ${losses}</p>
        <p>⚽ Goals: ${player.goals}</p>
        <p>🏅 MOTM: ${player.motm}</p>
        <p>🧤 Clean Sheets: ${player.cleanSheets}</p>
      </div>
    `;

    card.prepend(streakBadge);
    card.addEventListener("click", () => openModal(player));
    container.appendChild(card);
  });
}

// Search filter
document.getElementById("searchInput").addEventListener("input", function () {
  const search = this.value.toLowerCase();
  const filtered = playersData.filter(p => p.name.toLowerCase().includes(search));
  displayPlayers(filtered);
});

// Sorting helpers
function sortByField(field) {
  const sorted = [...playersData].sort((a, b) => b[field] - a[field]);
  displayPlayers(sorted);
}

// Sort buttons
document.getElementById("sortWins").addEventListener("click", () => {
  const sorted = [...playersData].sort(
    (a, b) => parseStreak(b.streak).wins - parseStreak(a.streak).wins
  );
  displayPlayers(sorted);
});

document.getElementById("sortLosses").addEventListener("click", () => {
  const sorted = [...playersData].sort(
    (a, b) => parseStreak(b.streak).losses - parseStreak(a.streak).losses
  );
  displayPlayers(sorted);
});

document.getElementById("sortGoals").addEventListener("click", () => sortByField("goals"));
document.getElementById("sortMotm").addEventListener("click", () => sortByField("motm"));

// Modal logic
const modal = document.getElementById("playerModal");
const closeModalBtn = document.getElementById("closeModal");
const modalPhoto = document.getElementById("modalPhoto");
const modalName = document.getElementById("modalName");
const modalGoals = document.getElementById("modalGoals");
const modalStreak = document.getElementById("modalStreak");
const modalWins = document.getElementById("modalWins");
const modalLosses = document.getElementById("modalLosses");
const modalCleanSheets = document.getElementById("modalCleanSheets");
const modalMotm = document.getElementById("modalMotm");

function openModal(player) {
  modal.style.display = "block";

  modalPhoto.src = player.photo;
  modalName.textContent = player.name;
  modalGoals.textContent = "⚽ Goals: " + player.goals;

  const { latestClass, wins, losses } = parseStreak(player.streak);

  modalStreak.textContent = "🏆 Streak: " + player.streak;
  modalStreak.className = latestClass;
  modalWins.textContent = "Wins: " + wins;
  modalLosses.textContent = "Losses: " + losses;
  modalCleanSheets.textContent = "🧤 Clean Sheets: " + player.cleanSheets;
  modalMotm.textContent = "🏅 MOTM: " + player.motm;

  modal.classList.add("show");
}

function closeModal() {
  modal.classList.remove("show");
  setTimeout(() => { modal.style.display = "none"; }, 300);
}

closeModalBtn.onclick = closeModal;
window.onclick = (e) => { if (e.target === modal) closeModal(); };

let playersData = [];

// Load players.json and display players
fetch("players.json")
  .then(response => response.json())
  .then(players => {
    playersData = players;
    displayPlayers(playersData);
  })
  .catch(err => console.error("Error loading players:", err));

// Display players function
function displayPlayers(players) {
  const container = document.getElementById("player-list");
  container.innerHTML = ""; // Clear old results

  if (players.length === 0) {
    container.innerHTML = "<p>No players found.</p>";
    return;
  }

  players.forEach(player => {
    const card = document.createElement("div");
    card.className = "player-card";

    // Parse streak
    const streakArray = player.streak.split(",").map(s => s.trim());
    const latestStreak = streakArray[streakArray.length - 1];
    const streakClass = latestStreak === "W" ? "streak-win" : "streak-loss";

    // Count wins and losses
    const wins = streakArray.filter(s => s === "W").length;
    const losses = streakArray.filter(s => s === "L").length;

    // Add streak badge
    const streakBadge = document.createElement("div");
    streakBadge.className = `streak-badge ${streakClass}`;
    streakBadge.textContent = latestStreak === "W" ? "Win" : "Loss";
    card.appendChild(streakBadge);

    card.innerHTML += `
      <img src="${player.photo}" alt="${player.name}">
      <h3>${player.name}</h3>
      <div class="stats">
        <p>⚽ Goals: ${player.goals}</p>
        <p class="${streakClass}">🏆 Streak: ${player.streak}</p>
        <p>Wins: ${wins}</p>
        <p>Losses: ${losses}</p>
        <p>🧤 Clean Sheets: ${player.cleanSheets}</p>
      </div>
    `;

    // Add click listener to open modal
    card.addEventListener("click", () => openModal(player));

    container.appendChild(card);
  });
}

// Search filter
document.getElementById("searchInput").addEventListener("input", function () {
  const searchValue = this.value.toLowerCase();
  const filteredPlayers = playersData.filter(player =>
    player.name.toLowerCase().includes(searchValue)
  );
  displayPlayers(filteredPlayers);
});

// Sorting helpers
function countWins(streak) {
  return streak.split(",").filter(s => s.trim() === "W").length;
}

function countLosses(streak) {
  return streak.split(",").filter(s => s.trim() === "L").length;
}

// Sort buttons
document.getElementById("sortWins").addEventListener("click", () => {
  const sorted = [...playersData].sort((a, b) => countWins(b.streak) - countWins(a.streak));
  displayPlayers(sorted);
});

document.getElementById("sortLosses").addEventListener("click", () => {
  const sorted = [...playersData].sort((a, b) => countLosses(b.streak) - countLosses(a.streak));
  displayPlayers(sorted);
});

document.getElementById("sortGoals").addEventListener("click", () => {
  const sorted = [...playersData].sort((a, b) => b.goals - a.goals);
  displayPlayers(sorted);
});

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

function openModal(player) {
  modal.style.display = "block";

  modalPhoto.src = player.photo;
  modalName.textContent = player.name;
  modalGoals.textContent = "⚽ Goals: " + player.goals;

  // Parse streak
  const streakArray = player.streak.split(",").map(s => s.trim());
  const latestStreak = streakArray[streakArray.length - 1];
  const streakClass = latestStreak === "W" ? "streak-win" : "streak-loss";

  // Count wins and losses
  const wins = streakArray.filter(s => s === "W").length;
  const losses = streakArray.filter(s => s === "L").length;

  modalStreak.textContent = "🏆 Streak: " + player.streak;
  modalStreak.className = streakClass;
  modalWins.textContent = "Wins: " + wins;
  modalLosses.textContent = "Losses: " + losses;
  modalCleanSheets.textContent = "🧤 Clean Sheets: " + player.cleanSheets;

  modal.classList.add("show"); // trigger slide-up animation
}

function closeModal() {
  modal.classList.remove("show");
  setTimeout(() => {
    modal.style.display = "none";
  }, 300);
}

closeModalBtn.onclick = closeModal;

window.onclick = (event) => {
  if (event.target === modal) closeModal();
};

"use strict";

/* =====================================================
   CTM PLAYER MANAGEMENT v2.0
===================================================== */

const PLAYERS_KEY = "ctm_players";
const TOURNAMENT_KEY = "ctm_tournament";

let players = [];

let deleteIndex = -1;

/* =====================================================
   LOAD TOURNAMENT INFORMATION
===================================================== */

function loadTournamentInfo() {

    const tournament =
        JSON.parse(localStorage.getItem(TOURNAMENT_KEY)) || {};

    document.getElementById("tournamentTitle").textContent =
        tournament.name || "-";

    document.getElementById("tournamentDate").textContent =
        tournament.date || "-";

    document.getElementById("tournamentCategory").textContent =
        tournament.category || "-";

    document.getElementById("tournamentBoards").textContent =
        tournament.boards || 0;

}

/* =====================================================
   LOAD PLAYERS
===================================================== */

function loadPlayers() {

    players =
        JSON.parse(localStorage.getItem(PLAYERS_KEY)) || [];

}

/* =====================================================
   SAVE PLAYERS
===================================================== */

function savePlayers() {

    localStorage.setItem(
        PLAYERS_KEY,
        JSON.stringify(players)
    );

}

/* =====================================================
   UPDATE STATISTICS
===================================================== */

function updateStatistics() {

    document.getElementById("totalPlayers").textContent =
        players.length;

    let male = players.filter(
        p => p.gender === "Male"
    ).length;

    let female = players.filter(
        p => p.gender === "Female"
    ).length;

    document.getElementById("malePlayers").textContent =
        male;

    document.getElementById("femalePlayers").textContent =
        female;

    let avg = 0;

    if (players.length > 0) {

        avg =
            players.reduce(
                (sum, p) => sum + Number(p.rating || 0),
                0
            ) / players.length;

    }

    document.getElementById("averageRating").textContent =
        Math.round(avg);

}
/* =====================================================
   ADD PLAYER
===================================================== */

function addPlayer(event) {

    event.preventDefault();

    const name = document.getElementById("playerName").value.trim();

    if (name === "") {

        alert("Please enter player name.");

        return;

    }

    const player = {

        id: Date.now(),

        name: name,

        gender: document.getElementById("playerGender").value,

        category: document.getElementById("playerCategory").value,

        school: document.getElementById("playerSchool").value,

        rating: Number(document.getElementById("playerRating").value) || 1000,

        score: 0,

        win: 0,

        draw: 0,

        loss: 0

    };

    players.push(player);

    savePlayers();

    renderPlayers();

    updateStatistics();

    clearForm();

}

/* =====================================================
   CLEAR FORM
===================================================== */

function clearForm() {

    document.getElementById("playerName").value = "";

    document.getElementById("playerGender").value = "Male";

    document.getElementById("playerCategory").value = "";

    document.getElementById("playerSchool").value = "";

    document.getElementById("playerRating").value = 1000;

}

/* =====================================================
   RENDER PLAYERS
===================================================== */

function renderPlayers(list = players) {

    const tbody = document.getElementById("playersTable");

    tbody.innerHTML = "";

    if (list.length === 0) {

        tbody.innerHTML = `

        <tr>

            <td colspan="8" class="text-center text-muted">

                No players registered.

            </td>

        </tr>

        `;

        return;

    }

    list.forEach((player, index) => {

        tbody.innerHTML += `

        <tr>

            <td>${index + 1}</td>

            <td>${player.name}</td>

            <td>${player.gender}</td>

            <td>${player.category}</td>

            <td>${player.school}</td>

            <td>${player.rating}</td>

            <td>${player.score}</td>

            <td>

                <button
                    class="btn btn-warning btn-sm"
                    onclick="editPlayer(${index})">

                    <i class="bi bi-pencil"></i>

                </button>

                <button
                    class="btn btn-danger btn-sm"
                    onclick="deletePlayer(${index})">

                    <i class="bi bi-trash"></i>

                </button>

            </td>

        </tr>

        `;

    });

}

/* =====================================================
   SEARCH PLAYER
===================================================== */

function searchPlayer() {

    const keyword =
        document.getElementById("searchPlayer")
        .value
        .toLowerCase();

    const filtered = players.filter(player =>

        player.name.toLowerCase().includes(keyword) ||

        player.school.toLowerCase().includes(keyword) ||

        player.category.toLowerCase().includes(keyword)

    );

    renderPlayers(filtered);

}
/* =====================================================
   EDIT PLAYER
===================================================== */

function editPlayer(index) {

    const player = players[index];

    if (!player) return;

    document.getElementById("editPlayerIndex").value = index;
    document.getElementById("editPlayerName").value = player.name;
    document.getElementById("editPlayerGender").value = player.gender;
    document.getElementById("editPlayerCategory").value = player.category;
    document.getElementById("editPlayerSchool").value = player.school;
    document.getElementById("editPlayerRating").value = player.rating;

    const modal = new bootstrap.Modal(
        document.getElementById("editPlayerModal")
    );

    modal.show();

}

/* =====================================================
   SAVE EDIT PLAYER
===================================================== */

function saveEditPlayer() {

    const index = Number(
        document.getElementById("editPlayerIndex").value
    );

    if (index < 0 || index >= players.length) return;

    players[index].name =
        document.getElementById("editPlayerName").value.trim();

    players[index].gender =
        document.getElementById("editPlayerGender").value;

    players[index].category =
        document.getElementById("editPlayerCategory").value;

    players[index].school =
        document.getElementById("editPlayerSchool").value;

    players[index].rating =
        Number(document.getElementById("editPlayerRating").value);

    savePlayers();

    renderPlayers();

    updateStatistics();

    bootstrap.Modal.getInstance(
        document.getElementById("editPlayerModal")
    ).hide();

}

/* =====================================================
   DELETE PLAYER
===================================================== */

function deletePlayer(index) {

    deleteIndex = index;

    const modal = new bootstrap.Modal(
        document.getElementById("deleteModal")
    );

    modal.show();

}

/* =====================================================
   CONFIRM DELETE
===================================================== */

function confirmDeletePlayer() {

    if (deleteIndex < 0) return;

    players.splice(deleteIndex, 1);

    deleteIndex = -1;

    savePlayers();

    renderPlayers();

    updateStatistics();

    bootstrap.Modal.getInstance(
        document.getElementById("deleteModal")
    ).hide();

}

/* =====================================================
   DELETE ALL PLAYERS
===================================================== */

function deleteAllPlayers() {

    if (!confirm("Delete ALL players?")) return;

    players = [];

    savePlayers();

    renderPlayers();

    updateStatistics();

}

/* =====================================================
   INITIALIZE
===================================================== */

function initializePlayers() {

    loadTournamentInfo();

    loadPlayers();

    renderPlayers();

    updateStatistics();

}

/* =====================================================
   EVENT LISTENERS
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    initializePlayers();

    document
        .getElementById("playerForm")
        .addEventListener("submit", addPlayer);

    document
        .getElementById("searchPlayer")
        .addEventListener("keyup", searchPlayer);

    document
        .getElementById("btnSaveEdit")
        .addEventListener("click", saveEditPlayer);

    document
        .getElementById("confirmDelete")
        .addEventListener("click", confirmDeletePlayer);

    document
        .getElementById("btnDeleteAll")
        .addEventListener("click", deleteAllPlayers);

    document
        .getElementById("btnExportPlayers")
        .addEventListener("click", exportPlayersCSV);

    document
        .getElementById("btnImportPlayers")
        .addEventListener("click", () => {

            document
                .getElementById("importFile")
                .click();

        });

    document
        .getElementById("importFile")
        .addEventListener("change", importPlayersCSV);

});

/* =====================================================
   EXPORT PLAYERS (CSV)
===================================================== */

function exportPlayersCSV() {

    if (players.length === 0) {

        alert("No players to export.");

        return;

    }

    let csv =
        "Name,Gender,Category,School,Rating\n";

    players.forEach(player => {

        csv += `"${player.name}","${player.gender}","${player.category}","${player.school}",${player.rating}\n`;

    });

    const blob = new Blob(
        [csv],
        {
            type: "text/csv;charset=utf-8;"
        }
    );

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = "CTM_Players.csv";

    link.click();

}

/* =====================================================
   DOWNLOAD CSV TEMPLATE
===================================================== */

function downloadPlayerTemplate() {

    const csv =
`Name,Gender,Category,School,Rating
Ahmad,Male,U12,SK Lingkabau,1200
Siti,Female,U12,SK Lingkabau,1100`;

    const blob = new Blob(
        [csv],
        {
            type: "text/csv;charset=utf-8;"
        }
    );

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = "CTM_Player_Template.csv";

    link.click();

}

/* =====================================================
   IMPORT CSV
===================================================== */

function importPlayersCSV(event) {

    const file = event.target.files[0];

    if (!file)
        return;

    const reader = new FileReader();

    reader.onload = function(e) {

        const lines =
            e.target.result.trim().split("\n");

        if (lines.length <= 1) {

            alert("CSV is empty.");

            return;

        }

        let imported = 0;

        for (let i = 1; i < lines.length; i++) {

            const row =
                lines[i]
                .split(",")
                .map(item =>
                    item.replace(/"/g, "").trim()
                );

            if (row.length < 5)
                continue;

            const exists = players.find(p =>

                p.name.toLowerCase() === row[0].toLowerCase()

            );

            if (exists)
                continue;

            players.push({

                id: Date.now() + i,

                name: row[0],

                gender: row[1],

                category: row[2],

                school: row[3],

                rating: Number(row[4]),

                score: 0,

                win: 0,

                draw: 0,

                loss: 0,

                buchholz: 0,

                colorBalance: 0,

                hadBye: false,

                opponents: []

            });

            imported++;

        }

        savePlayers();

        renderPlayers();

        updateStatistics();

        alert(imported + " players imported.");

    };

    reader.readAsText(file);

}
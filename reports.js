"use strict";

/* ==========================================================
   CTM REPORT MODULE v1.0
========================================================== */

/* ==========================================================
   LOAD REPORT
========================================================== */

function loadReport() {

    loadTournamentInformation();

    const players = getSortedReportPlayers();

    renderPodium(players);

    renderReportTable(players);

}

/* ==========================================================
   SORT PLAYERS
========================================================== */

function getSortedReportPlayers() {

    const players = getPlayers();

    players.sort((a, b) => {

        if ((b.score || 0) !== (a.score || 0))
            return (b.score || 0) - (a.score || 0);

        if ((b.win || 0) !== (a.win || 0))
            return (b.win || 0) - (a.win || 0);

        if ((a.loss || 0) !== (b.loss || 0))
            return (a.loss || 0) - (b.loss || 0);

        return (b.rating || 1000) - (a.rating || 1000);

    });

    return players;

}

/* ==========================================================
   LOAD TOURNAMENT INFO
========================================================== */

function loadTournamentInformation() {

    const tournament = getTournament();

    const players = getPlayers();

    if (!tournament)
        return;

    document.getElementById("reportTournamentName").textContent =
        tournament.name || "-";

    document.getElementById("reportTournamentDate").textContent =
        tournament.date || "-";

    document.getElementById("reportTournamentLocation").textContent =
        tournament.location || "-";

    document.getElementById("reportCategory").textContent =
        tournament.category || "-";

    document.getElementById("reportRounds").textContent =
        tournament.rounds || 0;

    document.getElementById("reportPlayers").textContent =
        players.length;

}

/* ==========================================================
   RENDER PODIUM
========================================================== */

function renderPodium(players) {

    if (players.length > 0) {

        document.getElementById("championName").textContent =
            players[0].name;

        document.getElementById("championSchool").textContent =
            players[0].school || "-";

        document.getElementById("championScore").textContent =
            (players[0].score || 0).toFixed(1) + " pts";

    }

    if (players.length > 1) {

        document.getElementById("runnerName").textContent =
            players[1].name;

        document.getElementById("runnerSchool").textContent =
            players[1].school || "-";

        document.getElementById("runnerScore").textContent =
            (players[1].score || 0).toFixed(1) + " pts";

    }

    if (players.length > 2) {

        document.getElementById("thirdName").textContent =
            players[2].name;

        document.getElementById("thirdSchool").textContent =
            players[2].school || "-";

        document.getElementById("thirdScore").textContent =
            (players[2].score || 0).toFixed(1) + " pts";

    }

}

/* ==========================================================
   RENDER FINAL STANDINGS
========================================================== */

function renderReportTable(players) {

    const tbody =
        document.getElementById("reportTable");

    if (!tbody)
        return;

    tbody.innerHTML = "";

    if (players.length === 0) {

        tbody.innerHTML = `

        <tr>

            <td colspan="7"
                class="text-center text-muted">

                No tournament data available.

            </td>

        </tr>

        `;

        return;

    }

    players.forEach((player, index) => {

        tbody.innerHTML += `

        <tr>

            <td>${index + 1}</td>

            <td>
                <strong>${player.name}</strong>
            </td>

            <td>${player.school || "-"}</td>

            <td>${(player.score || 0).toFixed(1)}</td>

            <td>${player.win || 0}</td>

            <td>${player.draw || 0}</td>

            <td>${player.loss || 0}</td>

        </tr>

        `;

    });

}

/* ==========================================================
   REFRESH REPORT
========================================================== */

function refreshReport() {

    loadReport();

}

/* ==========================================================
   PRINT REPORT
========================================================== */

function printReport() {

    window.print();

}

/* ==========================================================
   INITIALIZE REPORT MODULE
========================================================== */

function initializeReport() {

    refreshReport();

}

/* ==========================================================
   AUTO INIT
========================================================== */

document.addEventListener(

    "DOMContentLoaded",

    initializeReport

);

document
    .getElementById("btnFinishTournament")
    ?.addEventListener(
        "click",
        finishTournamentAction
    );

/* =====================================================
   FINISH TOURNAMENT
===================================================== */

function finishTournamentAction() {

    if (isTournamentFinished()) {

        alert("Tournament has already been finished.");

        return;

    }

    const confirmFinish = confirm(

        "Finish this tournament?\n\n" +
        "This will lock the tournament."

    );

    if (!confirmFinish)
        return;

    finishTournament();

    alert("Tournament finished successfully.");

    location.reload();

}
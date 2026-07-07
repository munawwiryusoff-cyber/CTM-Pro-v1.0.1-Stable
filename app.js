"use strict";

/* ==========================================================
   CTM v1.0 Stable
   APP CORE ENGINE
========================================================== */

/* ==========================================================
   GLOBAL OBJECT
========================================================== */

const CTM = {

    tournament: null,

    players: [],

    round: 1

};

/* ==========================================================
   LOAD DATA
========================================================== */

function loadData() {

    CTM.tournament = getTournament();

    CTM.players = getPlayers();

    CTM.round = getRound();

}

/* ==========================================================
   SAVE DATA
========================================================== */

function saveData() {

    saveTournament(CTM.tournament);

    savePlayers(CTM.players);

    setRound(CTM.round);

}

/* ==========================================================
   UPDATE DASHBOARD
========================================================== */

function updateDashboard() {

    const tournament = document.getElementById("dashboardTournament");

    const players = document.getElementById("dashboardPlayers");

    const boards = document.getElementById("dashboardBoards");

    const round = document.getElementById("dashboardRound");

    if (tournament) {

        tournament.textContent =
            CTM.tournament
                ? CTM.tournament.name
                : "None";

    }

    if (players) {

        players.textContent = CTM.players.length;

    }

    if (boards) {

        boards.textContent =
            CTM.tournament
                ? CTM.tournament.boards
                : 0;

    }

    if (round) {

        round.textContent = CTM.round;

    }

}

/* ==========================================================
   CREATE TOURNAMENT
========================================================== */

function createTournament() {

    const name =
        document.getElementById("tournamentName")?.value.trim();

    if (!name) {

        alert("Please enter tournament name.");

        return;

    }

    CTM.tournament = {

        name: name,

        date:
            document.getElementById("tournamentDate")?.value || "",

        location:
            document.getElementById("tournamentLocation")?.value || "",

        rounds:
            parseInt(
                document.getElementById("rounds")?.value || 5
            ),

        boards:
            parseInt(
                document.getElementById("boards")?.value || 8
            ),

        time:
            document.getElementById("time")?.value || "",

        category:
            document.getElementById("category")?.value || ""

    };

    CTM.round = 1;

    saveData();

    updateDashboard();

    const modalElement =
        document.getElementById("tournamentModal");

    if (modalElement) {

        const modal =
            bootstrap.Modal.getInstance(modalElement);

        if (modal)
            modal.hide();

    }

    alert("Tournament created successfully.");

}

/* ==========================================================
   RESET SYSTEM
========================================================== */

function resetSystem() {

    if (!confirm("Reset tournament?"))
        return;

    resetTournamentData();

    CTM.tournament = null;

    CTM.players = [];

    CTM.round = 1;

    updateDashboard();

    alert("Tournament has been reset.");

}

/* ==========================================================
   EVENT BINDING
========================================================== */

function bindEvents() {

    const saveBtn =
        document.getElementById("saveTournament");

    if (saveBtn) {

        saveBtn.addEventListener(
            "click",
            createTournament
        );

    }

}

/* ==========================================================
   INITIALIZE
========================================================== */

function initializeApp() {

    loadData();

    updateDashboard();

    bindEvents();

}

/* ==========================================================
   AUTO START
========================================================== */

document.addEventListener(

    "DOMContentLoaded",

    initializeApp

);
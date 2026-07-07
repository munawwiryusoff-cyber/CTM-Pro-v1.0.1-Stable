"use strict";

/* ==========================================================
   CTM - STORAGE MANAGER v1.0
   Semua operasi Local Storage dikendalikan di sini
========================================================== */

/* ==========================================================
   STORAGE KEYS
========================================================== */

const STORAGE_KEYS = {

    TOURNAMENT: "ctm_tournament",

    PLAYERS: "ctm_players",

    PAIRINGS: "ctm_pairings",

    ROUND: "ctm_round"

};

/* ==========================================================
   TOURNAMENT
========================================================== */

function getTournament() {

    return JSON.parse(
        localStorage.getItem(STORAGE_KEYS.TOURNAMENT)
    ) || null;

}

function saveTournament(data) {

    localStorage.setItem(
        STORAGE_KEYS.TOURNAMENT,
        JSON.stringify(data)
    );

}

/* ==========================================================
   TOURNAMENT STATUS
========================================================== */

function isTournamentFinished() {

    const tournament = getTournament();

    return tournament?.finished === true;

}

function finishTournament() {

    const tournament = getTournament();

    if (!tournament)
        return;

    tournament.finished = true;

    saveTournament(tournament);

}

function reopenTournament() {

    const tournament = getTournament();

    if (!tournament)
        return;

    tournament.finished = false;

    saveTournament(tournament);

}

/* ==========================================================
   PLAYERS
========================================================== */

function getPlayers() {

    return JSON.parse(
        localStorage.getItem(STORAGE_KEYS.PLAYERS)
    ) || [];

}

function savePlayers(players) {

    localStorage.setItem(
        STORAGE_KEYS.PLAYERS,
        JSON.stringify(players)
    );

}

/* ==========================================================
   PAIRINGS
========================================================== */

function getAllPairings() {

    return JSON.parse(
        localStorage.getItem(STORAGE_KEYS.PAIRINGS)
    ) || {};

}

function getPairings(round) {

    const all = getAllPairings();

    return all[`round_${round}`] || [];

}

function savePairings(round, pairings) {

    const all = getAllPairings();

    all[`round_${round}`] = pairings;

    localStorage.setItem(
        STORAGE_KEYS.PAIRINGS,
        JSON.stringify(all)
    );

}

function clearPairings() {

    localStorage.removeItem(
        STORAGE_KEYS.PAIRINGS
    );

}

/* ==========================================================
   ROUND
========================================================== */

function getRound() {

    return parseInt(
        localStorage.getItem(STORAGE_KEYS.ROUND)
    ) || 1;

}

function setRound(round) {

    localStorage.setItem(
        STORAGE_KEYS.ROUND,
        round
    );

}

/* ==========================================================
   RESET
========================================================== */

function resetTournamentData() {

    localStorage.removeItem(
        STORAGE_KEYS.TOURNAMENT
    );

    localStorage.removeItem(
        STORAGE_KEYS.PLAYERS
    );

    localStorage.removeItem(
        STORAGE_KEYS.PAIRINGS
    );

    localStorage.removeItem(
        STORAGE_KEYS.ROUND
    );

}
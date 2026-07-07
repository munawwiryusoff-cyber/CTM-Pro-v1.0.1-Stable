"use strict";

/* ==========================================================
   CTM v1.0 Stable
   TOURNAMENT ENGINE
========================================================== */

/* ==========================================================
   SORT PLAYERS (Swiss Order)
========================================================== */

function sortPlayers(players) {

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
   ENSURE SWISS FIELDS
========================================================== */

function preparePlayers(players) {

    players.forEach(player => {

        if (player.score === undefined)
            player.score = 0;

        if (player.win === undefined)
            player.win = 0;

        if (player.draw === undefined)
            player.draw = 0;

        if (player.loss === undefined)
            player.loss = 0;

        if (player.buchholz === undefined)
            player.buchholz = 0;

        if (player.colorBalance === undefined)
            player.colorBalance = 0;

        if (player.hadBye === undefined)
            player.hadBye = false;

        if (!Array.isArray(player.opponents))
            player.opponents = [];

    });

    return players;

}

/* ==========================================================
   GET CURRENT ROUND PAIRINGS
========================================================== */

function getCurrentPairings() {

    const currentRound = getRound() - 1;

    if (currentRound <= 0)
        return [];

    return getPairings(currentRound);

}

/* ==========================================================
   CHECK IF PLAYED BEFORE
========================================================== */

function hasPlayedBefore(playerA, playerB) {

    if (!playerA.opponents)
        return false;

    return playerA.opponents.includes(playerB.id);

}

/* ==========================================================
   COLOR BALANCE
========================================================== */

function decideColors(playerA, playerB) {

    const balanceA = playerA.colorBalance || 0;
    const balanceB = playerB.colorBalance || 0;

    let white;
    let black;

    if (balanceA > balanceB) {

        white = playerB;
        black = playerA;

    }

    else if (balanceB > balanceA) {

        white = playerA;
        black = playerB;

    }

    else {

        if (Math.random() < 0.5) {

            white = playerA;
            black = playerB;

        }

        else {

            white = playerB;
            black = playerA;

        }

    }

    white.colorBalance =
        (white.colorBalance || 0) + 1;

    black.colorBalance =
        (black.colorBalance || 0) - 1;

    return {

        white,

        black

    };

}

/* ==========================================================
   FIND LOWEST SCORE PLAYER
========================================================== */

function lowestScorePlayer(players) {

    const copy = [...players];

    copy.sort((a, b) => {

        if ((a.score || 0) !== (b.score || 0))
            return (a.score || 0) - (b.score || 0);

        return (a.rating || 1000) - (b.rating || 1000);

    });

    return copy[0];

}
/* ==========================================================
   GENERATE SWISS PAIRINGS
========================================================== */

function generatePairings() {

    if (!isCurrentRoundCompleted()) {

        alert("Please complete the current round before generating a new round.");

        return [];

    }

    let players = getPlayers();

    players = preparePlayers(players);

    if (players.length < 2) {

        alert("At least 2 players are required.");

        return [];

    }

    sortPlayers(players);

    const pairings = [];

    const used = new Set();

    /* ---------------------------------
       PAIR PLAYERS
    ---------------------------------- */

    for (let i = 0; i < players.length; i++) {

        const playerA = players[i];

        if (used.has(playerA.id))
            continue;

        let opponent = null;

        /* First Priority :
           Same score + Never met */

        for (let j = i + 1; j < players.length; j++) {

            const playerB = players[j];

            if (used.has(playerB.id))
                continue;

            if (hasPlayedBefore(playerA, playerB))
                continue;

            opponent = playerB;

            break;

        }

        /* Fallback */

        if (!opponent) {

            for (let j = i + 1; j < players.length; j++) {

                if (!used.has(players[j].id)) {

                    opponent = players[j];

                    break;

                }

            }

        }

        if (!opponent)
            continue;

        const colors = decideColors(playerA, opponent);

        pairings.push({

            board: pairings.length + 1,

            white: colors.white,

            black: colors.black,

            result: null,

            bye: false

        });

        /* Save opponent history */

        playerA.opponents.push(opponent.id);

        opponent.opponents.push(playerA.id);

        used.add(playerA.id);

        used.add(opponent.id);

    }

    /* ---------------------------------
       BYE PLAYER
    ---------------------------------- */

    const remaining = players.filter(

        player => !used.has(player.id)

    );

    if (remaining.length === 1) {

        const byePlayer = lowestScorePlayer(remaining);

        byePlayer.hadBye = true;

        pairings.push({

            board: pairings.length + 1,

            white: byePlayer,

            black: null,

            bye: true,

            result: "BYE"

        });

    }

    /* ---------------------------------
       SAVE
    ---------------------------------- */

    const round = getRound();

    savePlayers(players);

    savePairings(round, pairings);

    setRound(round + 1);

    return pairings;

}
/* ==========================================================
   SAVE ROUND RESULTS
========================================================== */

function saveRoundResults(round, results) {

    const pairings = getPairings(round);

    if (pairings.length === 0)
        return false;

    results.forEach(result => {

        const match = pairings.find(m => m.board === result.board);

        if (!match)
            return;

        match.result = result.result;

        if (match.bye)
            return;

        const players = getPlayers();

        const white = players.find(p => p.id === match.white.id);
        const black = players.find(p => p.id === match.black.id);

        if (!white || !black)
            return;

        switch (result.result) {

            case "1-0":

                white.score += 1;
                white.win++;

                black.loss++;

                break;

            case "0-1":

                black.score += 1;
                black.win++;

                white.loss++;

                break;

            case "0.5-0.5":

                white.score += 0.5;
                black.score += 0.5;

                white.draw++;
                black.draw++;

                break;

        }

        savePlayers(players);

    });

    savePairings(round, pairings);

    return true;

}

/* ==========================================================
   CHECK CURRENT ROUND COMPLETED
========================================================== */

function isCurrentRoundCompleted() {

    const round = getRound() - 1;

    if (round <= 0)
        return true;

    const pairings = getPairings(round);

    if (pairings.length === 0)
        return true;

    for (const match of pairings) {

        if (match.bye)
            continue;

        if (
            match.result === null ||
            match.result === undefined ||
            match.result === ""
        ) {

            return false;

        }

    }

    return true;

}

/* ==========================================================
   RESET TOURNAMENT
========================================================== */

function resetTournament() {

    clearPairings();

    setRound(1);

    const players = getPlayers();

    players.forEach(player => {

        player.score = 0;
        player.win = 0;
        player.draw = 0;
        player.loss = 0;

        player.buchholz = 0;
        player.colorBalance = 0;
        player.hadBye = false;
        player.opponents = [];

    });

    savePlayers(players);

}

/* ==========================================================
   UPDATE ROUND DISPLAY
========================================================== */

function updateDashboardRound() {

    const el = document.getElementById("dashboardRound");

    if (!el)
        return;

    el.textContent = getRound();

}

/* ==========================================================
   INITIALIZE
========================================================== */

function initializeTournament() {

    console.log("Tournament initialized");

    console.log("getRound =", typeof getRound);

    updateDashboardRound();

}
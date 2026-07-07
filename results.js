"use strict";

/* ==========================================================
   CTM RESULTS MODULE v1.0
========================================================== */

/* ==========================================================
   GET CURRENT ROUND
========================================================== */

function getCurrentResultsRound() {

    return Math.max(1, getRound() - 1);

}

/* ==========================================================
   COLLECT RESULTS FROM PAGE
========================================================== */

function collectResults() {

    const results = [];

    document.querySelectorAll(".resultSelect").forEach(select => {

        const value = select.value;

        if (value === "")
            return;

        results.push({

            board: Number(select.dataset.board),

            result: value

        });

    });

    return results;

}

/* ==========================================================
   VALIDATE RESULTS
========================================================== */

function validateResults(results) {

    const pairings = getPairings(getCurrentResultsRound());

    let totalGames = pairings.filter(match => !match.bye).length;

    return results.length === totalGames;

}

/* ==========================================================
   SAVE BUTTON
========================================================== */

function saveResults() {

    const round = getCurrentResultsRound();

    const results = collectResults();

    if (!validateResults(results)) {

        alert("Please enter results for all boards.");

        return;

    }

    const success = saveRoundResults(round, results);

    if (!success) {

        alert("Failed to save results.");

        return;

    }

    alert("Round " + round + " results saved successfully.");

}

/* ==========================================================
   REFRESH RESULTS PAGE
========================================================== */

function refreshResults() {

    if (typeof loadResults === "function") {

        loadResults();

    }

}

/* ==========================================================
   INITIALIZE RESULTS MODULE
========================================================== */

function initializeResults() {

    refreshResults();

    const saveButton =
        document.getElementById("saveResultsBtn");

    if (saveButton) {

        saveButton.addEventListener(

            "click",

            saveResults

        );

    }

}

/* ==========================================================
   AUTO INIT
========================================================== */

document.addEventListener(

    "DOMContentLoaded",

    initializeResults

);

/* ==========================================================
   AFTER SAVE PROCESS
========================================================== */

function afterSaveSuccess(round) {

    refreshResults();

    const nextRound = round + 1;

    const tournament = getTournament();

    if (tournament && nextRound <= tournament.rounds) {

        if (confirm(
            "Results saved successfully.\n\nGenerate Round " +
            nextRound +
            " now?"
        )) {

            window.location.href = "pairings.html";

        }

    } else {

        alert(
            "All tournament rounds have been completed."
        );

    }

}

/* ==========================================================
   OVERRIDE SAVE RESULTS
========================================================== */

const originalSaveResults = saveResults;

saveResults = function () {

    const round = getCurrentResultsRound();

    const results = collectResults();

    if (!validateResults(results)) {

        alert("Please enter results for every board.");

        return;

    }

    const success = saveRoundResults(round, results);

    if (!success) {

        alert("Unable to save results.");

        return;

    }

    afterSaveSuccess(round);

};

/* ==========================================================
   END OF RESULTS MODULE
========================================================== */
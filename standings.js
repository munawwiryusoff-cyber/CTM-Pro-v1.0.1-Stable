"use strict";

/* ==========================================================
   CTM STANDINGS MODULE v1.0
========================================================== */

/* ==========================================================
   GET SORTED PLAYERS
========================================================== */

function getSortedPlayers() {

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
   LOAD STANDINGS
========================================================== */

function loadStandings() {

    const players = getSortedPlayers();

    renderStandings(players);

}

/* ==========================================================
   RENDER STANDINGS TABLE
========================================================== */

function renderStandings(players) {

    const tbody =
        document.getElementById("standingsTable");

    const playerCount =
        document.getElementById("playerCount");

    if (!tbody)
        return;

    tbody.innerHTML = "";

    if (playerCount) {

        playerCount.textContent = players.length;

    }

    if (players.length === 0) {

        tbody.innerHTML = `

        <tr>

            <td colspan="9"
                class="text-center text-muted">

                No players found.

            </td>

        </tr>

        `;

        return;

    }

    players.forEach((player, index) => {

        tbody.innerHTML += `

        <tr>

            <td>

                ${index + 1}

            </td>

            <td>

                <strong>

                    ${player.name}

                </strong>

            </td>

            <td>

                ${player.school || "-"}

            </td>

            <td>

                ${player.category || "-"}

            </td>

            <td>

                ${(player.score || 0).toFixed(1)}

            </td>

            <td>

                ${player.win || 0}

            </td>

            <td>

                ${player.draw || 0}

            </td>

            <td>

                ${player.loss || 0}

            </td>

            <td>

                ${player.rating || 1000}

            </td>

        </tr>

        `;

    });

}

/* ==========================================================
   REFRESH STANDINGS
========================================================== */

function refreshStandings() {

    loadStandings();

}

/* ==========================================================
   INITIALIZE STANDINGS
========================================================== */

function initializeStandings() {

    refreshStandings();

}

/* ==========================================================
   AUTO INIT
========================================================== */

document.addEventListener(

    "DOMContentLoaded",

    initializeStandings

);

document
    .getElementById("btnExportStandings")
    ?.addEventListener("click", exportStandingsCSV);

/* =====================================================
   EXPORT STANDINGS CSV
===================================================== */

function exportStandingsCSV() {

    let players = getPlayers();

    players.sort((a, b) => {

        if ((b.score || 0) !== (a.score || 0))
            return (b.score || 0) - (a.score || 0);

        if ((b.win || 0) !== (a.win || 0))
            return (b.win || 0) - (a.win || 0);

        return (b.buchholz || 0) - (a.buchholz || 0);

    });

    let csv =
`Rank,Name,School,Category,Score,Win,Draw,Loss,Buchholz
`;

    players.forEach((player, index) => {

        csv +=
`${index + 1},"${player.name}","${player.school}","${player.category}",${player.score},${player.win},${player.draw},${player.loss},${player.buchholz}
`;

    });

    const blob = new Blob(

        [csv],

        {

            type: "text/csv;charset=utf-8;"

        }

    );

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = "CTM_Standings.csv";

    link.click();

}
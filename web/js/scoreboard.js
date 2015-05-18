var serverUrl = 'http://localhost:9200/server.php';

var currentScoreboard = { 'problems': [], 'entries': [] };

var rowsMap = {};
var entriesMap = {};
var prevMap = {};
var nextMap = {};

function fetchScoreboard() {
    $.get(serverUrl, function(data) {
        refreshScoreboard(JSON.parse(data));
    });

    setTimeout(fetchScoreboard, 2000);
}

function problemsChanged(problems) {
    var currentProblems = currentScoreboard['problems'];
    if (problems.length != currentProblems.length) {
        return true;
    }

    for (var i = 0; i < problems.length; i++) {
        if (problems[i] != currentProblems[i]) {
            return true;
        }
    }

    return false;
}

function refreshScoreboardProblems(problems) {
    $('.col-problem').remove();

    for (var i = 0; i < problems.length; i++) {
        var problem = problems[i];
        var header = $('<th>');
        header.prop('class', 'col-score col-problem');
        header.html(problem);
        $('#headers').append(header);
    }
}

function createRow(entry) {
    var tr = $('<tr>');
    tr.append($('<td>').html(entry['rank']));
    tr.append($('<td>').html(entry['name']));
    tr.append($('<td>').html(entry['school']));
    tr.append($('<td>').html(entry['province']));
    tr.append($('<td>').html(entry['totalScores']));

    for (var j = 0; j < entry['scores'].length; j++) {
        var score = entry['scores'][j];
        tr.append($('<td>').html(score));
    }

    return tr;
}

function refreshScoreboardEntries(entries) {
    $('#entries').empty();

    rowsMap = {};
    entriesMap = {};
    prevMap = {};
    nextMap = {};

    for (var i = 0; i < entries.length; i++) {
        var entry = entries[i];
        var jid = entry['jid'];

        entriesMap[jid] = entry;
        if (i > 0) {
            prevMap[jid] = entries[i-1]['jid'];
        } else {
            prevMap[jid] = null;
        }
        if (i+1 < entries.length) {
            nextMap[jid] = entries[i+1]['jid'];
        } else {
            nextMap[jid] = null;
        }

        var tr = createRow(entry);
        rowsMap[jid] = tr;
        $('#entries').append(tr);
    }
}

function isGreater(entry1, entry2) {
    if (entry1['totalScores'] == entry2['totalScores'])
        return entry1['name'] < entry2['name'];
    return entry1['totalScores'] > entry2['totalScores'];
}

function moveUp(jid) {
    var prevJid = prevMap[jid];
    var nextJid = nextMap[jid];

    prevMap[jid] = prevMap[prevJid];
    nextMap[jid] = prevJid;

    prevMap[prevJid] = jid;
    nextMap[prevJid] = nextJid;

    if (nextJid != null) {
        prevMap[nextJid] = prevJid;
    }
}

function entryChanged(entry1, entry2) {
    if (entry1['totalScores'] != entry2['totalScores']) {
        return true;
    }

    for (var i = 0; i < entry1['scores'].length; i++) {
        if (entry1['scores'][i] != entry2['scores'][i]) {
            return true;
        }
    }
    return false;
}

function updateScoreboardEntry(entriesByJid, i) {
    if (i == 0) {
        return;
    }

    var jid = currentScoreboard['entries'][i]['jid'];
    var destJid = null;

    if (!entryChanged(entriesByJid[jid], entriesMap[jid])) {
        updateScoreboardEntry(entriesByJid, i-1);
        return;
    }

    while (prevMap[jid] != null && isGreater(entriesByJid[jid], entriesMap[prevMap[jid]])) {
        destJid = prevMap[jid];
        moveUp(jid);
    }

    entriesMap[jid] = entriesByJid[jid];


    var row = rowsMap[jid];
    var destRow = rowsMap[destJid];

    var newRow = createRow(entriesByJid[jid]);
    rowsMap[jid] = newRow;

    if (destJid != null) {
        row.fadeOut(500, function() {
            row.remove();

            newRow.hide();
            newRow.insertBefore(destRow);
            newRow.fadeIn(500);
            setTimeout(function() {
                updateScoreboardEntry(entriesByJid, i-1);
            }, 100);
        });
    } else {
        row.fadeOut(500, function() {
            row.replaceWith(newRow);
            row.fadeIn(500);
            setTimeout(function() {
                updateScoreboardEntry(entriesByJid, i-1);
            }, 100);
        });
    }
}

function updateScoreboardEntries(entries) {
    var entriesByJid = {};
    for (var i = 0; i < entries.length; i++) {
        entriesByJid[entries[i]['jid']] = entries[i];
    }

    updateScoreboardEntry(entriesByJid, currentScoreboard['entries'].length-1);
}

function updateTimestamp(lastUpdateTime) {
    $('#lastUpdateTime').html(lastUpdateTime);
}

function refreshScoreboard(scoreboard) {
    if (problemsChanged(scoreboard['problems'])) {
        refreshScoreboardProblems(scoreboard['problems']);
        refreshScoreboardEntries(scoreboard['entries']);
    } else {
        updateScoreboardEntries(scoreboard['entries']);
    }

    currentScoreboard = { 'problems': scoreboard['problems'], 'entries': scoreboard['entries'] };

    updateTimestamp(scoreboard['lastUpdateTime']);
}

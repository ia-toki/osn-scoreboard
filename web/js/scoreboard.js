var serverUrl = 'http://scoreboard-host/server.php';
var fetchScoreboardInterval = 2000;

var currentProblems = [];
var currentEntries = [];

function fetchScoreboard() {
    $.get(serverUrl, function(data) {
        refreshScoreboard(JSON.parse(data));
        setTimeout(fetchScoreboard, fetchScoreboardInterval);
    });
}

function problemsChanged(problems) {
    var currentProblems = currentScoreboard['problems'];
    if (problems.length == 0 || problems.length != currentProblems.length) {
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

function calculateScoreColor(score, problemCount) {
	var hue = score * 120.0 / (100.0 * problemCount);
	return 'hsl(' + hue.toString() + ', 80%, 60%)';
}

function createRow(entry) {
    var tr = $('<tr>');
    tr.append($('<td>').html(entry['rank']));
    tr.append($('<td>').html(entry['name']));
    tr.append($('<td>').html(entry['school']));
    tr.append($('<td>').html(entry['province']));
    tr.append($('<td>').html(entry['totalScores']).css({'background-color': calculateScoreColor(entry['totalScores'], currentProblems.length)}));

    for (var j = 0; j < entry['scores'].length; j++) {
        var score = entry['scores'][j];
        tr.append($('<td>').html(score).css({'background-color': calculateScoreColor(score, 1)}));
    }

    return tr;
}

function refreshScoreboardEntries(entries) {
    $('#entries').empty();

    for (var i = 0; i < entries.length; i++) {
        var entry = entries[i];
        var jid = entry['jid'];

        var tr = createRow(entry);
        $('#entries').append(tr);
    }

    updateRanks();
}

function compareWithoutTieBreaker(entry1, entry2) {
    return entry2['totalScores'] - entry1['totalScores'];
}

function compareWithTieBreaker(entry1, entry2) {
    if (entry1['name'] < entry2['name']) {
        return -1;
    }
    if (entry1['name'] > entry2['name']) {
        return 1;
    }
    return 0;
}

function compare(entry1, entry2) {
    var withoutTieBreaker = compareWithoutTieBreaker(entry1, entry2);
    if (withoutTieBreaker != 0) {
       return withoutTieBreaker;
    }
    return compareWithTieBreaker(entry1, entry2);
}

function updateRanks() {
    var prevRank = -1;
    var prevEntry = {'name': '', 'totalScores': -1};
    var curRank = 0;

    $('#entries').find('tr').each(function() {
        curRank++;

        var tdRank = $(this).find('td').first();
        var tdTotalScores = tdRank.next().next().next().next();
        var rank = tdRank.html();
        var name = tdRank.next().html();
        var totalScores = tdTotalScores.html();

        var curEntry = {'name': name, 'totalScores': totalScores};

        if (compareWithoutTieBreaker(prevEntry, curEntry) == 0) {
            tdRank.html(prevRank);
        } else {
            tdRank.html(curRank);
            prevRank = curRank;
        }

        prevEntry = curEntry;
    });
}

function updateTimestamp(lastUpdateTime) {
    $('#lastUpdateTime').html(lastUpdateTime);
}

function refreshScoreboard(scoreboard) {
    var problems = scoreboard['problems'];
    var entries = scoreboard['entries'].sort(compare);

    if (problemsChanged(problems)) {
        refreshScoreboardProblems(problems);
    }

    refreshScoreboardEntries(entries);
    currentProblems = problems;
    currentEntries = entries;

    updateTimestamp(scoreboard['lastUpdateTime']);
}

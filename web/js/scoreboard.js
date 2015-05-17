var serverUrl = 'http://localhost:9200/server.php';

var currentScoreboard = { 'problems': [], 'entries': [] };

function fetchScoreboard() {
    $.get(serverUrl, function(data) {
        refreshScoreboard(JSON.parse(data));
    });
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

function refreshScoreboardEntries(entries) {
    $('#entries').empty();

    for (var i = 0; i < entries.length; i++) {
        var entry = entries[i];
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

        $('#entries').append(tr);
    }
}

function refreshScoreboard(scoreboard) {
    if (problemsChanged(scoreboard['problems'])) {
        refreshScoreboardProblems(scoreboard['problems']);
    }

    refreshScoreboardEntries(scoreboard['entries']);
}

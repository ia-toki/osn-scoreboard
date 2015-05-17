import csv
import urllib.request
import urllib.parse
import json
import configparser

parser = configparser.ConfigParser()
parser.read('config.ini')
config = parser['DEFAULT']

overallProblems = []
overallEntries = {}

with open(config['contestants']) as contestants_file:
    reader = csv.reader(contestants_file)
    for line in reader:
        (jid, name, school, province) = tuple(line)
        overallEntries[jid] = {'jid': jid, 'name': name, 'school': school, 'province': province, 'totalScores': 0, 'scores': [], 'rank': 0}

for contestJid in config['contestJids'].split(','):
    data = urllib.parse.urlencode({'secret' : config['secret'], 'contestJid' : contestJid, 'type' : config['type']})
    con = urllib.request.urlopen(config['url'], data.encode('utf-8'))
    scoreboard = json.loads(con.read().decode('utf-8'))['scoreboard']
    con.close()

    overallProblems.extend(scoreboard['config']['problemAliases'])

    for entry in scoreboard['content']['entries']:
        jid = entry['contestantJid']
        if jid in overallEntries:
            overallEntries[jid]['scores'].extend(entry['scores'])
            overallEntries[jid]['totalScores'] += entry['totalScores']

overallSortedEntries = sorted(list(overallEntries.values()), key=lambda e: (-e['totalScores'], e['name']))
for i in range(len(overallSortedEntries)):
    if i > 0 and overallSortedEntries[i]['totalScores'] == overallSortedEntries[i-1]['totalScores']:
        overallSortedEntries[i]['rank'] = overallSortedEntries[i-1]['rank']
    else:
        overallSortedEntries[i]['rank'] = i+1

overallScoreboard = {'problems': overallProblems, 'entries': overallSortedEntries}

with open(config['output'], 'w') as output_file:
    output_file.write(json.dumps(overallScoreboard))

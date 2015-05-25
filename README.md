OSN 2015 Scoreboard
===================

Concepts
--------

- There are two servers: onsite server and online server.
- Onsite server hosts Uriel and scoreboard update poller. It cannot be accessed from outside.
- Online server hosts the scoreboard website, receives scoreboard updates, and serves scoreboard updates to the scoreboard website.
- Onsite server must be able to connect to the online server to push scoreboard updates.
- Scoreboard update poller and Uriel agree on a shared secret ('apiSecret' in poller config, 'uriel.scoreboardSecret' in Uriel app config).
- Scoreboard update poller and scoreboard update receiver agree on a shared secret ('receiverSecret').
- Scoreboard update server serves the updates received by scoreboard update receiver to the scoreboard website.
- Scoreboard website contacts to scoreboard update server via AJAX.

Poller setup
------------

- Copy the poller directory to the onsite server.
- Enter contestants data to contestants.csv.
- Enter configuration values to config.ini.
    - Set receiverUrl to receiver address.
    - Set type to OFFICIAL or FROZEN.
    - Set contestJids to comma-separated list of contest jids (e.g., day 1 contest and day 2 contest).

- Run `python3 poll.py`.

Receiver & server setup
-----------------------

- Copy receiver.php and server.php to a directory accessible via web.
- Set $cache_path variable in both files to a path accessible by both.

Website setup
-------------

- Set serverUrl variable in js/scoreboard.js to the server address.

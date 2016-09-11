#!/usr/bin/env bash

adddate() {
    while IFS= read -r line; do
        echo "$(date) $line"
    done
}

git fetch origin | adddate >> /var/log/deploy.log
git reset --hard origin/master | adddate >> /var/log/deploy.log

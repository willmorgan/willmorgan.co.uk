adddate() {
    while IFS= read -r line; do
        echo "$(date) $line"
    done
}

git pull | adddate >> /var/log/deploy.log

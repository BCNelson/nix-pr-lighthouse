
clear-docker:
    docker compose down --volumes --remove-orphans

start-docker:
    docker compose up -d

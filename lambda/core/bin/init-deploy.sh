#!/bin/bash

bold=$(tput bold)
normal=$(tput sgr0)
red='\033[0;31m'
green='\033[0;32m'
nc='\033[0m' # No Color

set -e

if [ "$1" = "" ]; then
  echo
  echo -e ${red}${bold}Operation failed. The environment name must be set. Please check that it is available in the package.json script.${nc}${normal}
  echo
  exit 1
fi

if [ "$2" = "" ];
then
  FUNCTION="all"
else
  FUNCTION=$2
fi

echo
echo -e "${bold}Dockerized Lambda warming up!${normal}"
echo

echo "AWS_ACCESS_KEY_ID=$(aws configure get aws_access_key_id --profile nicbot-sls)
AWS_SECRET_ACCESS_KEY=$(aws configure get aws_secret_access_key --profile nicbot-sls)
ENVIRONMENT=$1
FUNCTION=${FUNCTION}" > .env

docker-compose up --build

echo
echo -e "${green}${bold}Cleanup commencing${normal}${nc}"
echo

docker rmi -f lambci/lambda:deploy
docker rm -v $(docker ps -a -q -f status=exited)

echo
echo -e "${green}${bold}Deployment complete!${normal}${nc}"
echo

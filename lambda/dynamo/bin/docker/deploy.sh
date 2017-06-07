#!/bin/bash

bold=$(tput bold)
normal=$(tput sgr0)
red='\033[0;31m'
green='\033[0;32m'
nc='\033[0m' # No Color

set -e

if [ "$1" = "" ]; then
  echo
  echo -e ${red}${bold}Operation failed inside Docker container. The environment name must be set. Please check that it is set in the package.json script.${nc}${normal}
  echo
  exit 1
fi

echo
echo -e ENVIRONMENT: $1
echo -e FUNCTION: $2
echo

yarn
yarn run gen-credentials

rm -rf node_modules
yarn cache clean
yarn install --production

if [ "${2}" = "all" ];
then
  echo
  echo -e sls deploy --profile nicbot-sls --env $1
  echo
  sls deploy --profile nicbot-sls --env $1
else
  echo
  echo -e sls deploy function --function $2 --profile nicbot-sls --env $1
  echo
  sls deploy function --function $2 --profile nicbot-sls --env $1
fi

echo
echo -e "${green}${bold}Deployment inside container successful!${normal}${nc}"
echo

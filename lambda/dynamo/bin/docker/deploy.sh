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

echo yarn install in root for node-credstash package
yarn
echo
yarn run gen-credentials

base_dir=`pwd`

cd ./src
echo
rm -rf ./yarn-error.log
echo yarn install in \`src\` folder
yarn install --production
echo
if [ -f ./yarn-error.log ]; then
  tail ./yarn-error.log
  exit 1
fi

cd $base_dir

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

#!/bin/bash

bold=$(tput bold)
normal=$(tput sgr0)
red='\033[0;31m'
green='\033[0;32m'
nc='\033[0m' # No Color

set -e

if [ "$1" = "" ]; then
  echo
  echo -e ${red}${bold}Operation failed. The name of the new Lambda must be set with the following command${nc}${normal}
  echo
  echo -e ${bold}NAME=newLambdaName yarn run new-lambda${normal}
  echo
  exit 1
fi

echo
echo -e "${bold}Lambda \"$1\" to be created from template${normal}"
echo

cp -r ./bin/template ./lambda/$1
cd ./lambda/$1/
yarn
yarn run gen-credentials

echo
echo -e "${green}${bold}New Lambda \"$1\" has been created!${normal}${nc}"
echo

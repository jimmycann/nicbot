#!/bin/bash

bold=$(tput bold)
normal=$(tput sgr0)
red='\033[0;31m'
green='\033[0;32m'
nc='\033[0m' # No Color

set -e

base_dir=`pwd`

if [ "$1" = "" ]; then
  echo
  echo -e ${red}${bold}Operation failed. The environment name must be set. Please check that it is available in the package.json script.${nc}${normal}
  echo
  exit 1
fi

echo
echo -e "${bold}Starting Static Database Build${normal}"
echo

for F in `find ./.data/tables -type f -maxdepth 1`
do
  cd $base_dir
  echo -e Add table from JSON: ${F}
  FUNCTION=createTable JSON_PATH=${F} yarn run invoke:$1
  echo
done

for F in `find ./.data/rows -type f -maxdepth 1`
do
  cd $base_dir
  echo -e Insert rows from JSON: ${F}
  FUNCTION=insertRows JSON_PATH=${F} yarn run invoke:$1
  echo
done

echo
echo -e "${green}${bold}Static Database Build Complete!${normal}${nc}"
echo

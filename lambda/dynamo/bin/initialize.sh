
#!/bin/bash

bold=$(tput bold)
normal=$(tput sgr0)
red='\033[0;31m'
green='\033[0;32m'
nc='\033[0m' # No Color

set -e

base_dir=`pwd`
yarn run gen-credentials

for D in `find . -type d -maxdepth 1`
do
  if [ "${D}" = "./bin" ] || [ "${D}" = "./config" ] || [ "${D}" = "./.env" ] || [ "${D}" = "./.environment" ] || [ "${D}" = "./.data" ]; then
    continue
  fi
  cd $base_dir
  cd $D
  yarn
done

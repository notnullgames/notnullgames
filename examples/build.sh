#!/bin/bash

# Very simple script to build examples into carts and put them in webroot

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

# just in case it's not available
mkdir -p "${SCRIPT_DIR}/../public/carts/"

# grab the current C-header
if [ ! -f "${SCRIPT_DIR}/c/null0.h" ]; then
  curl https://raw.githubusercontent.com/notnullgames/null0/refs/heads/main/carts/null0.h > "${SCRIPT_DIR}/c/null0.h"
fi


# build a C-cart
BUILDCART() {
  name="${1}"
  source_dir="${2}"
  echo "CART: C - ${name}"
  rm -rf "/tmp/${name}"
  mkdir -p "/tmp/${name}"
  cd "/tmp/${name}"
  cp -R "${source_dir}"/* .
  /opt/wasi-sdk/bin/clang -I "${SCRIPT_DIR}/c" "${source_dir}/main.c" -o ./main.wasm
  zip -rq "${SCRIPT_DIR}/../public/carts/${name}.null0" . -x "*.c" "*.h" ".DS_Store" "__*"
}

# build a JS cart
BUILDJSCART() {
  name="${1}"
  source_dir="${2}"
  echo "CART: JS - ${name}"
  rm -rf "/tmp/${name}"
  mkdir -p "/tmp/${name}"
  cd "/tmp/${name}"
  cp -R "${source_dir}"/* .
  cp  "${SCRIPT_DIR}/../public/carts/main.wasm" .
  zip -rq "${SCRIPT_DIR}/../public/carts/${name}.null0" . -x "*.c" "*.h" ".DS_Store" "__*"
}


BUILDCART "c-logo" "${SCRIPT_DIR}/c/logo"
BUILDCART "c-circle" "${SCRIPT_DIR}/c/circle"

BUILDJSCART "js-example" "${SCRIPT_DIR}/js/example"
BUILDJSCART "js-flappy" "${SCRIPT_DIR}/js/flappy"
BUILDJSCART "js-input" "${SCRIPT_DIR}/js/input"

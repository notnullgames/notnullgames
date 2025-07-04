#!/bin/bash

# Very simple script to build examples into carts and put them in webroot

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

CART_DIR="${SCRIPT_DIR}/../public/carts/"

# just in case it's not available
mkdir -p "${CART_DIR}"

# grab the current C-header
if [ ! -f "${SCRIPT_DIR}/c/null0.h" ]; then
  curl https://raw.githubusercontent.com/notnullgames/null0/refs/heads/main/carts/c/null0.h > "${SCRIPT_DIR}/c/null0.h"
fi

# grab the current nelua-header
if [ ! -f "${SCRIPT_DIR}/nelua/null0.nelua" ]; then
  curl https://raw.githubusercontent.com/notnullgames/null0/refs/heads/main/carts/nelua/null0.nelua > "${SCRIPT_DIR}/nelua/null0.nelua"
fi

# build a C-cart
BUILD_CART_C() {
  name="${1}"
  source_dir="${2}"
  echo "CART: C - ${name}"
  rm -rf "/tmp/${name}"
  mkdir -p "/tmp/${name}"
  cd "/tmp/${name}"
  cp -R "${source_dir}"/* .
  /opt/wasi-sdk/bin/clang -I "${SCRIPT_DIR}/c" "${source_dir}/main.c" -o ./main.wasm
  zip -rq "${CART_DIR}/${name}.null0" . -x "*.c" "*.h" ".DS_Store" "__*"
}

# build a JS cart
BUILD_CART_JS() {
  name="${1}"
  source_dir="${2}"
  echo "CART: JS - ${name}"
  rm -rf "/tmp/${name}"
  mkdir -p "/tmp/${name}"
  cd "/tmp/${name}"
  cp -R "${source_dir}"/* .
  cp  "${SCRIPT_DIR}/js/main.wasm" .
  zip -rq "${CART_DIR}/${name}.null0" . -x ".DS_Store" "__*"
}

# build a Nelua cart
BUILD_CART_NELUA() {
  name="${1}"
  source_dir="${2}"
  echo "CART: Nelua - ${name}"
  rm -rf "/tmp/${name}"
  mkdir -p "/tmp/${name}"
  cd "/tmp/${name}"
  cp -R "${source_dir}"/* .
  nelua --cflags="-I \"${SCRIPT_DIR}/c\"" -L "${SCRIPT_DIR}/nelua" "${source_dir}/main.nelua" -r --cc "/opt/wasi-sdk/bin/clang" -o ./main.wasm
  zip -rq "${CART_DIR}/${name}.null0" . -x ".DS_Store" "__*" "*.nelua"
}


BUILD_CART_C "c-logo" "${SCRIPT_DIR}/c/logo"
BUILD_CART_C "c-circle" "${SCRIPT_DIR}/c/circle"

BUILD_CART_JS "js-example" "${SCRIPT_DIR}/js/example"
BUILD_CART_JS "js-flappy" "${SCRIPT_DIR}/js/flappy"
BUILD_CART_JS "js-input" "${SCRIPT_DIR}/js/input"

BUILD_CART_NELUA "nelua-colorbars" "${SCRIPT_DIR}/nelua/colorbars"

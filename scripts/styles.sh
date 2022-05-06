#!/bin/bash

SASS_BIN="./node_modules/sass/sass.js"
SASS_DIR="./scss"
TARGET_DIR="./src/yafowil/widget/datetime/resources"

$SASS_BIN $SASS_DIR/timepicker.scss $TARGET_DIR/timepicker.css
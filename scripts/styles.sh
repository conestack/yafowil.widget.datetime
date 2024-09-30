#!/bin/bash

SASS_BIN="./node_modules/sass/sass.js"
SASS_DIR="./scss"
TARGET_DIR="./src/yafowil/widget/datetime/resources"

$SASS_BIN $SASS_DIR/timepicker.scss --no-source-map $TARGET_DIR/timepicker.css
$SASS_BIN $SASS_DIR/bootstrap5/timepicker.scss --no-source-map $TARGET_DIR/bootstrap5/timepicker.css
$SASS_BIN $SASS_DIR/bootstrap5/datepicker.scss --no-source-map $TARGET_DIR/bootstrap5/datepicker.css
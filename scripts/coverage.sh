#!/bin/sh

set -e

./bin/coverage run \
    --source src/yafowil/widget/datetime \
    --omit src/yafowil/widget/datetime/example.py \
    -m yafowil.widget.datetime.tests
./bin/coverage report
./bin/coverage html

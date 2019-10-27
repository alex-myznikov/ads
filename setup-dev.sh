#!/bin/bash
#
# Sets up SAYMON development environment.
#

echo -n "Installing Git commit hook...   "

cp tools/git/prepare-commit-msg .git/hooks
chmod +x .git/hooks/prepare-commit-msg

echo "OK"

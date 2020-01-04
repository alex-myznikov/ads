#!/bin/bash
#
# Sets up development environment.
#

echo -n "Installing Git commit hook...   "

cp tools/git/prepare-commit-msg .git/hooks
chmod +x .git/hooks/prepare-commit-msg

echo "OK"

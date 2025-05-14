#!/bin/bash
# Wrapper script for Odyssey Uplink Protocol migration tool

# Find the Node.js executable
NODE_EXEC=$(command -v node)

if [ -z "$NODE_EXEC" ]; then
  echo "Error: Node.js not found. Please install Node.js and try again."
  exit 1
fi

# Get the directory of this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Run the migration script
$NODE_EXEC "$SCRIPT_DIR/migrate-uplink.js" "$@"

#!/usr/bin/env bash

echo "Installing IndoreCar Rental - Angular Application"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js v18 or higher."
    exit 1
fi

echo "Node.js version: $(node --version)"
echo "npm version: $(npm --version)"

# Install dependencies
echo ""
echo "Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo ""
    echo "✓ Dependencies installed successfully"
    echo ""
    echo "To start the development server, run:"
    echo "  npm start"
    echo ""
    echo "The app will be available at http://localhost:4200"
else
    echo "✗ Failed to install dependencies"
    exit 1
fi

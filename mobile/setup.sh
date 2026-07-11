#!/bin/bash
# ─────────────────────────────────────────────────────────────────────
# Raptor Eats — Asset Setup Script
#
# Run this script to copy the generated images into the project assets
# directory, then install dependencies and start the dev server.
#
# Usage:
#   cd mobile
#   chmod +x setup.sh
#   ./setup.sh
# ─────────────────────────────────────────────────────────────────────

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ASSETS_DIR="$SCRIPT_DIR/assets/images"
GENERATED_DIR="$HOME/.gemini/antigravity-ide/brain/d3cc592f-9850-42bc-a7b4-6f5087c587f5"

echo "🦖 Raptor Eats — Setting up project..."

# Create assets directory
mkdir -p "$ASSETS_DIR"

# Copy generated images
echo "📸 Copying image assets..."
if [ -d "$GENERATED_DIR" ]; then
  cp "$GENERATED_DIR/raptor_eats_logo_1783358096822.png" "$ASSETS_DIR/logo.png" 2>/dev/null && echo "  ✓ logo.png" || echo "  ⚠ logo.png not found"
  cp "$GENERATED_DIR/food_tacos_1783358161528.png" "$ASSETS_DIR/tacos.png" 2>/dev/null && echo "  ✓ tacos.png" || echo "  ⚠ tacos.png not found"
  cp "$GENERATED_DIR/food_torta_1783358183860.png" "$ASSETS_DIR/torta.png" 2>/dev/null && echo "  ✓ torta.png" || echo "  ⚠ torta.png not found"
  cp "$GENERATED_DIR/food_quesadilla_1783358212730.png" "$ASSETS_DIR/quesadilla.png" 2>/dev/null && echo "  ✓ quesadilla.png" || echo "  ⚠ quesadilla.png not found"
  cp "$GENERATED_DIR/food_enchiladas_1783358286162.png" "$ASSETS_DIR/enchiladas.png" 2>/dev/null && echo "  ✓ enchiladas.png" || echo "  ⚠ enchiladas.png not found"
  cp "$GENERATED_DIR/food_agua_fresca_1783358338080.png" "$ASSETS_DIR/horchata.png" 2>/dev/null && echo "  ✓ horchata.png" || echo "  ⚠ horchata.png not found"
  cp "$GENERATED_DIR/food_flan_1783358378519.png" "$ASSETS_DIR/flan.png" 2>/dev/null && echo "  ✓ flan.png" || echo "  ⚠ flan.png not found"
else
  echo "  ⚠ Generated images directory not found. Please copy images manually to $ASSETS_DIR"
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the development server:"
echo "  npx expo start"
echo ""
echo "Scan the QR code with Expo Go (Android) or Camera (iOS) to preview."

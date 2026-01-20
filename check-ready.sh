#!/bin/bash

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🔍 Checking Still Basing Mini App Readiness..."
echo ""

# Counter for checks
PASSED=0
FAILED=0

# Function to check file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅${NC} $2"
        ((PASSED++))
    else
        echo -e "${RED}❌${NC} $2 (missing: $1)"
        ((FAILED++))
    fi
}

# Function to check file exists and has content
check_file_content() {
    if [ -f "$1" ] && [ -s "$1" ]; then
        echo -e "${GREEN}✅${NC} $2 ($(du -h "$1" | cut -f1))"
        ((PASSED++))
    else
        echo -e "${RED}❌${NC} $2 (missing or empty: $1)"
        ((FAILED++))
    fi
}

echo "📁 Checking Required Files..."
echo ""

# Check manifest
check_file "public/.well-known/farcaster.json" "Farcaster manifest"

# Check HTML
check_file "index.html" "Main HTML file"

# Check images
echo ""
echo "🖼️  Checking Required Images..."
echo ""
check_file_content "public/icon-1024.png" "Icon 1024×1024"
check_file_content "public/splash-200.png" "Splash 200×200"
check_file_content "public/hero-1200x630.png" "Hero 1200×630"
check_file_content "public/og-1200x630.png" "OG Image 1200×630"
check_file_content "public/screenshot-1.png" "Screenshot 1 (Play)"
check_file_content "public/screenshot-2.png" "Screenshot 2 (Stats)"
check_file_content "public/screenshot-3.png" "Screenshot 3 (NFT)"

# Check code files
echo ""
echo "💻 Checking Code Files..."
echo ""
check_file "src/wagmi.js" "Wagmi config (Smart Wallet)"
check_file "src/hooks/usePaymasterCapabilities.js" "Paymaster hook"
check_file "src/screens/PlayScreen.jsx" "Play screen (gasless)"
check_file "src/screens/NFTScreen.jsx" "NFT screen (gasless)"

# Check configs
echo ""
echo "⚙️  Checking Configuration..."
echo ""
check_file ".github/workflows/deploy.yml" "GitHub Actions deploy"
check_file "package.json" "Package.json"
check_file "vite.config.js" "Vite config"

# Validate manifest JSON
echo ""
echo "🔍 Validating Manifest..."
echo ""
if command -v jq &> /dev/null; then
    if jq empty public/.well-known/farcaster.json 2>/dev/null; then
        echo -e "${GREEN}✅${NC} Manifest JSON is valid"
        ((PASSED++))
    else
        echo -e "${RED}❌${NC} Manifest JSON is invalid"
        ((FAILED++))
    fi
else
    echo -e "${YELLOW}⚠️${NC}  jq not installed, skipping JSON validation"
fi

# Check Smart Wallet integration
echo ""
echo "🔐 Checking Smart Wallet Integration..."
echo ""
if grep -q "smartWalletOnly" src/wagmi.js 2>/dev/null; then
    echo -e "${GREEN}✅${NC} Smart Wallet configured"
    ((PASSED++))
else
    echo -e "${RED}❌${NC} Smart Wallet not configured"
    ((FAILED++))
fi

if grep -q "useWriteContracts" src/screens/PlayScreen.jsx 2>/dev/null; then
    echo -e "${GREEN}✅${NC} PlayScreen uses experimental hooks"
    ((PASSED++))
else
    echo -e "${RED}❌${NC} PlayScreen missing experimental hooks"
    ((FAILED++))
fi

if grep -q "usePaymasterCapabilities" src/screens/PlayScreen.jsx 2>/dev/null; then
    echo -e "${GREEN}✅${NC} PlayScreen uses paymaster capabilities"
    ((PASSED++))
else
    echo -e "${RED}❌${NC} PlayScreen missing paymaster capabilities"
    ((FAILED++))
fi

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
TOTAL=$((PASSED + FAILED))
PERCENTAGE=$((PASSED * 100 / TOTAL))

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All checks passed!${NC} ($PASSED/$TOTAL)"
    echo ""
    echo "✅ Ready for Featured submission!"
    echo ""
    echo "Next steps:"
    echo "1. Create PR: https://github.com/Alubiama/StillBASING/compare"
    echo "2. Merge to main"
    echo "3. Wait for deploy"
    echo "4. Test on https://base.dev/preview"
    echo ""
    exit 0
else
    echo -e "${RED}⚠️  Some checks failed${NC}"
    echo "Passed: $PASSED/$TOTAL ($PERCENTAGE%)"
    echo "Failed: $FAILED"
    echo ""
    echo "Please fix the issues above before deploying."
    echo ""
    exit 1
fi

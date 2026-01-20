#!/bin/bash

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

APP_URL="https://alubiama.github.io/StillBASING"
MANIFEST_URL="${APP_URL}/.well-known/farcaster.json"

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🚀 Still Basing - Deployment Validation${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

PASSED=0
FAILED=0
WARNINGS=0

# Function to test URL
test_url() {
    local url=$1
    local name=$2
    local expected_type=$3

    if command -v curl &> /dev/null; then
        status=$(curl -s -o /dev/null -w "%{http_code}" "$url")
        if [ "$status" = "200" ]; then
            echo -e "${GREEN}✅${NC} $name ($status)"
            ((PASSED++))
            return 0
        else
            echo -e "${RED}❌${NC} $name (HTTP $status)"
            ((FAILED++))
            return 1
        fi
    else
        echo -e "${YELLOW}⚠️${NC}  $name (curl not available)"
        ((WARNINGS++))
        return 2
    fi
}

# Function to test JSON endpoint
test_json() {
    local url=$1
    local name=$2

    if command -v curl &> /dev/null && command -v jq &> /dev/null; then
        response=$(curl -s "$url")
        if echo "$response" | jq empty 2>/dev/null; then
            echo -e "${GREEN}✅${NC} $name (valid JSON)"
            ((PASSED++))
            return 0
        else
            echo -e "${RED}❌${NC} $name (invalid JSON)"
            ((FAILED++))
            return 1
        fi
    elif command -v curl &> /dev/null; then
        status=$(curl -s -o /dev/null -w "%{http_code}" "$url")
        if [ "$status" = "200" ]; then
            echo -e "${YELLOW}⚠️${NC}  $name (HTTP $status, jq not available for validation)"
            ((WARNINGS++))
            return 2
        else
            echo -e "${RED}❌${NC} $name (HTTP $status)"
            ((FAILED++))
            return 1
        fi
    else
        echo -e "${YELLOW}⚠️${NC}  $name (curl not available)"
        ((WARNINGS++))
        return 2
    fi
}

echo "🌐 Testing Main Application..."
echo ""
test_url "$APP_URL/" "Main page"

echo ""
echo "📄 Testing Manifest..."
echo ""
test_json "$MANIFEST_URL" "Farcaster manifest"

echo ""
echo "🖼️  Testing Required Images..."
echo ""
test_url "${APP_URL}/icon-1024.png" "Icon 1024×1024"
test_url "${APP_URL}/splash-200.png" "Splash 200×200"
test_url "${APP_URL}/hero-1200x630.png" "Hero 1200×630"
test_url "${APP_URL}/og-1200x630.png" "OG Image 1200×630"
test_url "${APP_URL}/screenshot-1.png" "Screenshot 1 (Play)"
test_url "${APP_URL}/screenshot-2.png" "Screenshot 2 (Stats)"
test_url "${APP_URL}/screenshot-3.png" "Screenshot 3 (NFT)"

echo ""
echo "🔍 Checking Local Files..."
echo ""

# Check if we're in the right directory
if [ -f "package.json" ] && [ -d "src" ]; then
    echo -e "${GREEN}✅${NC} In correct project directory"
    ((PASSED++))
else
    echo -e "${RED}❌${NC} Not in project root directory"
    ((FAILED++))
fi

# Check critical files
if [ -f "src/wagmi.js" ] && grep -q "smartWalletOnly" src/wagmi.js 2>/dev/null; then
    echo -e "${GREEN}✅${NC} Smart Wallet configuration present"
    ((PASSED++))
else
    echo -e "${RED}❌${NC} Smart Wallet configuration missing"
    ((FAILED++))
fi

if [ -f "src/hooks/usePaymasterCapabilities.js" ]; then
    echo -e "${GREEN}✅${NC} Paymaster hook present"
    ((PASSED++))
else
    echo -e "${RED}❌${NC} Paymaster hook missing"
    ((FAILED++))
fi

# Check if deployed version matches local
echo ""
echo "📦 Checking Deployment Status..."
echo ""

if [ -d ".git" ]; then
    current_commit=$(git rev-parse --short HEAD 2>/dev/null)
    current_branch=$(git branch --show-current 2>/dev/null)

    if [ -n "$current_commit" ]; then
        echo -e "${GREEN}✅${NC} Current commit: $current_commit"
        echo -e "${GREEN}✅${NC} Current branch: $current_branch"
        ((PASSED++))
    fi

    # Check if there are uncommitted changes
    if [ -n "$(git status --porcelain 2>/dev/null)" ]; then
        echo -e "${YELLOW}⚠️${NC}  Uncommitted changes present"
        ((WARNINGS++))
    else
        echo -e "${GREEN}✅${NC} No uncommitted changes"
        ((PASSED++))
    fi
fi

# Summary
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

TOTAL=$((PASSED + FAILED))
if [ $TOTAL -gt 0 ]; then
    PERCENTAGE=$((PASSED * 100 / TOTAL))
else
    PERCENTAGE=0
fi

if [ $FAILED -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}🎉 Perfect! All checks passed!${NC}"
    echo ""
    echo "✅ Passed: $PASSED"
    echo ""
    echo -e "${GREEN}Your app is live and ready!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Test on Base Preview: https://base.dev/preview"
    echo "2. Test gasless transactions with Smart Wallet"
    echo "3. Submit for Featured!"
    echo ""
    exit 0
elif [ $FAILED -eq 0 ]; then
    echo -e "${YELLOW}⚠️  All checks passed with warnings${NC}"
    echo ""
    echo "✅ Passed: $PASSED"
    echo "⚠️  Warnings: $WARNINGS"
    echo ""
    echo "Warnings are usually due to missing tools (curl, jq)"
    echo "Your app should still be ready for submission."
    echo ""
    echo "Next steps:"
    echo "1. Manually verify URLs in browser"
    echo "2. Test on Base Preview: https://base.dev/preview"
    echo "3. Test gasless transactions with Smart Wallet"
    echo ""
    exit 0
else
    echo -e "${RED}⚠️  Some checks failed${NC}"
    echo ""
    echo "✅ Passed: $PASSED"
    echo "❌ Failed: $FAILED"
    if [ $WARNINGS -gt 0 ]; then
        echo "⚠️  Warnings: $WARNINGS"
    fi
    echo "📊 Success rate: $PERCENTAGE%"
    echo ""
    echo "Common issues:"
    echo "- Site not deployed yet (wait 2-3 minutes)"
    echo "- GitHub Pages not enabled in repo settings"
    echo "- Images not in public/ folder"
    echo "- Manifest JSON syntax error"
    echo ""
    echo "Run this script again in a few minutes."
    echo ""
    exit 1
fi

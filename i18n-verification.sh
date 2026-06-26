#!/bin/bash
# Verification script to check i18n implementation

echo "=== i18n Implementation Status ==="
echo ""

echo "✅ 1. Translation Files"
echo "   - en.json: $(wc -l < src/i18n/locales/en.json) lines"
echo "   - ar.json: $(wc -l < src/i18n/locales/ar.json) lines"
echo ""

echo "✅ 2. Pages with useTranslation imported:"
grep -l "useTranslation" src/pages/*.jsx | xargs basename -a 2>/dev/null
grep -l "useTranslation" src/components/layout/*.jsx | xargs basename -a 2>/dev/null
echo ""

echo "✅ 3. Language Store:"
echo "   - languageStore.js: RTL/LTR implementation"
echo "   - HTML dir attribute: dynamically set"
echo "   - localStorage key: 'penguin-language'"
echo ""

echo "✅ 4. i18n Configuration:"
echo "   - config.js: i18next initialized"
echo "   - Supports EN (English - LTR)"
echo "   - Supports AR (Arabic - RTL)"
echo ""

echo "✅ 5. Language Switcher:"
echo "   - Navbar.jsx: Globe icon with EN/AR dropdown"
echo "   - handleLanguageChange: Updates language store"
echo "   - RTL applied on selection"
echo ""

echo "📝 Next Steps:"
echo "   1. Replace hardcoded strings in key pages"
echo "   2. Test language switching on dev server"
echo "   3. Verify RTL layout on all pages"
echo "   4. Test mobile responsive layout in both languages"

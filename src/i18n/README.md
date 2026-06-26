# Language Support & Internationalization (i18n)

## Overview

The Penguin Stick website now supports full Arabic and English language switching with automatic RTL/LTR layout adjustments.

## Features

✅ **Language Switching**: Click the language button (EN/AR) in the navbar
✅ **RTL Support**: Automatic layout direction changes based on selected language  
✅ **Persistent Language**: Selected language is saved to localStorage
✅ **Dynamic Content**: All text content is translated through the i18n system
✅ **Clean Implementation**: Uses i18next with react-i18next for best practices

## Architecture

### Translation System
- **i18next**: Core translation engine
- **react-i18next**: React integration with hooks
- **Locales**: JSON translation files for each language
  - `src/i18n/locales/en.json` - English translations
  - `src/i18n/locales/ar.json` - Arabic translations

### Language State Management
- **useLanguageStore**: Zustand store for language state
  - Persists to localStorage with key `penguin-language`
  - Automatically sets HTML `dir` attribute (rtl/ltr)
  - Sets `lang` attribute for accessibility

### RTL/LTR Styling
- RTL CSS rules in `src/index.css`
- Tailwind CSS classes work automatically
- Flex direction automatically reverses in RTL mode
- Position and padding utilities adjust for RTL

## Usage in Components

### Using the Translation Hook

```javascript
import { useTranslation } from 'react-i18next'
import { useLanguageStore } from '@/store/languageStore'

function MyComponent() {
  const { t } = useTranslation()
  const { language } = useLanguageStore()

  return (
    <div>
      <h1>{t('navbar.shop_all')}</h1>
      <p>{t('home.hero_main')}</p>
      <button>{t('common.submit')}</button>
    </div>
  )
}
```

### Using the Custom Hook

```javascript
import { useTranslate } from '@/hooks/useTranslate'

function MyComponent() {
  const { t, language, isArabic, changeLanguage } = useTranslate()

  return (
    <div>
      <h1>{t('home.featured_title')}</h1>
      <p>Current language: {language}</p>
      {isArabic && <p>أنت تستخدم العربية</p>}
    </div>
  )
}
```

## Adding New Translations

1. **Open translation files**: 
   - `src/i18n/locales/en.json` for English
   - `src/i18n/locales/ar.json` for Arabic

2. **Add new key-value pairs**:
```json
{
  "section": {
    "key": "English text",
    "new_key": "New English text"
  }
}
```

3. **Use in components**:
```javascript
const { t } = useTranslation()
return <h1>{t('section.new_key')}</h1>
```

## Translation Keys Structure

The translations are organized by sections:

- `common`: General UI elements (buttons, labels)
- `navbar`: Navigation and user menu items
- `home`: Homepage content
- `shop`: Shop page and product filtering
- `product`: Product detail page
- `cart`: Shopping cart page
- `checkout`: Checkout and payment
- `custom_sticker`: Custom sticker creation
- `auth`: Authentication forms and messages
- `footer`: Footer content
- `errors`: Error messages
- `messages`: Toast notifications and feedback

## Language Switcher in Navbar

The language switcher is automatically included in the Navbar component:

```
[EN/AR] Button with dropdown menu
├── English (🇬🇧)
└── العربية (🇸🇦)
```

When user clicks a language:
1. Language is changed in the Zustand store
2. i18next translates all content
3. HTML direction changes (dir="rtl" or dir="ltr")
4. Language preference is saved to localStorage

## RTL Styling

The system handles RTL automatically, but for custom styling:

```css
/* RTL-specific styles */
html[dir="rtl"] .my-element {
  /* RTL-specific styles */
}

html[dir="ltr"] .my-element {
  /* LTR-specific styles */
}
```

## Browser Detection

Language preference is saved to localStorage. On first visit, it defaults to English:

```javascript
localStorage.setItem('penguin-language', JSON.stringify({ state: { language: 'en' } }))
```

## Performance Considerations

- Translations are loaded once at app initialization
- No runtime file loading delays
- Language switching is instant (no page reload needed)
- RTL/LTR change is smooth with CSS transitions

## Testing Language Features

1. Click EN/AR button in navbar
2. Verify all text updates immediately
3. Check layout direction changes
4. Verify localStorage persistence by refreshing page
5. Test on mobile responsive layout

## Accessibility

- HTML `lang` attribute updated for screen readers
- `dir` attribute follows language selection
- ARIA labels are translatable through i18n
- Proper text direction for all content

## Future Enhancements

Possible additions:
- More language support (French, Spanish, etc.)
- Regional dialects (Egyptian Arabic, Levantine Arabic)
- RTL-specific animation adjustments
- Font switching based on language (if needed)
- Language detection from browser preferences

## Troubleshooting

### Translations Not Appearing
- Check that key exists in both `en.json` and `ar.json`
- Ensure component is using `useTranslation()` hook
- Check browser console for i18n warnings

### RTL Not Applying
- Verify `dir="rtl"` is set in HTML element
- Clear browser cache (localStorage might be cached)
- Check that `useLanguageStore` is properly initialized

### Language Not Persisting
- Check localStorage is enabled in browser
- Verify `penguin-language` key in localStorage
- Check browser's privacy/cookie settings

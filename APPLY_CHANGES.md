# 🚀 Как применить изменения (Pimlico + NFT fix)

## ❗ CLI push заблокирован

Твой репозиторий защищён от прямого push через CLI. Это нормально и правильно для безопасности!

У тебя есть **3 варианта** применить изменения:

---

## ✅ ВАРИАНТ 1: GitHub Desktop (САМЫЙ ПРОСТОЙ) ⭐

1. **Скачай GitHub Desktop:** https://desktop.github.com/
2. **Открой репо:** File → Open → выбери папку StillBASING
3. **Переключись на ветку:** `claude/pimlico-integration-28588`
4. **Нажми "Push origin"**
5. **Готово!** Создай PR на GitHub

---

## ✅ ВАРИАНТ 2: VSCode (если используешь)

1. Открой VSCode
2. Source Control (Ctrl+Shift+G)
3. "..." → Push
4. Если не работает → используй Вариант 3

---

## ✅ ВАРИАНТ 3: Вручную через GitHub UI (15 минут)

### У нас 3 изменения:

### **1. Fix NFT claim function**

**Файл:** `src/screens/NFTScreen.jsx`

**Строка 94** - Измени:
```javascript
functionName: 'claimAchievementNFT',
```
**На:**
```javascript
functionName: 'claimNFT',
```

**Как:**
1. Открой: https://github.com/Alubiama/StillBASING/edit/main/src/screens/NFTScreen.jsx
2. Найди строку 94 (Ctrl+F → `claimAchievementNFT`)
3. Измени на `claimNFT`
4. Commit: "fix: Correct NFT claim function name"

---

### **2. Pimlico Integration**

#### 2.1. Файл `src/config/paymaster.js`

**Открой:** https://github.com/Alubiama/StillBASING/edit/main/src/config/paymaster.js

**Замени ВСЁ содержимое на:**

```javascript
/**
 * Paymaster configuration for Base Mini Apps
 *
 * Using Pimlico for sponsored (gasless) transactions
 *
 * To enable:
 * 1. Go to https://dashboard.pimlico.io/
 * 2. Create account and get API key (FREE tier: 100k operations/month!)
 * 3. Add VITE_PIMLICO_API_KEY to .env file
 * 4. Set enabled: true below
 * 5. Rebuild and enjoy gasless transactions!
 *
 * See PIMLICO_SETUP.md for detailed instructions
 */

export const PAYMASTER_CONFIG = {
  // Pimlico API endpoint for Base Sepolia
  paymasterUrl: 'https://api.pimlico.io/v2/base-sepolia/rpc',

  // Whether paymaster is enabled
  enabled: false, // Set to true after adding VITE_PIMLICO_API_KEY to .env

  // Provider name
  provider: 'Pimlico',

  // Instructions
  setupInstructions: \`
    To enable gasless transactions with Pimlico:

    1. Visit https://dashboard.pimlico.io/
    2. Create free account (100k ops/month free!)
    3. Get your API key
    4. Create .env file in project root:
       VITE_PIMLICO_API_KEY=your_api_key_here
    5. Set enabled: true in this config
    6. Rebuild: npm run build

    That's it! Your users won't pay gas fees!
  \`
}

/**
 * Get paymaster client configuration
 */
export function getPaymasterClient() {
  const apiKey = import.meta.env.VITE_PIMLICO_API_KEY

  if (!apiKey || !PAYMASTER_CONFIG.enabled) {
    console.info('⚠️ Paymaster not configured. Users will pay gas fees.')
    console.info('📖 See PIMLICO_SETUP.md for setup instructions')
    return null
  }

  return {
    url: \`\${PAYMASTER_CONFIG.paymasterUrl}?apikey=\${apiKey}\`,
    provider: PAYMASTER_CONFIG.provider,
  }
}
```

**Commit:** "feat: Switch to Pimlico paymaster config"

---

#### 2.2. Файл `.env.example`

**Открой:** https://github.com/Alubiama/StillBASING/edit/main/.env.example

**Замени на:**

```
# Pimlico API Key for Paymaster (gasless transactions)
# Get your FREE key at: https://dashboard.pimlico.io/
# FREE tier: 100,000 operations per month!
# This enables sponsored transactions for Base Mini Apps Featured requirements
# See PIMLICO_SETUP.md for setup instructions
VITE_PIMLICO_API_KEY=your_pimlico_api_key_here
```

**Commit:** "docs: Update env example for Pimlico"

---

#### 2.3. Создай файл `PIMLICO_SETUP.md`

**Открой:** https://github.com/Alubiama/StillBASING/new/main

**Name:** `PIMLICO_SETUP.md`

**Содержимое** скопируй из локального файла `PIMLICO_SETUP.md` (он уже создан)

**Commit:** "docs: Add Pimlico setup guide"

---

#### 2.4. Создай файл `FINAL_STEPS.md`

**Открой:** https://github.com/Alubiama/StillBASING/new/main

**Name:** `FINAL_STEPS.md`

**Содержимое** скопируй из локального файла `FINAL_STEPS.md` (он уже создан)

**Commit:** "docs: Add final steps guide"

---

## 🎯 После применения изменений:

1. ✅ NFT клейм работает
2. ✅ Pimlico готов к настройке
3. ✅ Документация полная

### Следующий шаг:

Открой `FINAL_STEPS.md` на GitHub и следуй инструкциям!

---

## 🤔 Какой вариант проще для тебя?

- **GitHub Desktop** - самый простой (2 клика)
- **VSCode** - если уже используешь (1 клик)
- **Вручную через GitHub** - 15 минут копипасты

Выбирай любой! Все работают 😊

# ⚡ Base Mini Apps - Quick Start Guide

> **Быстрый запуск нового Base Mini App за 30 минут**
>
> На основе опыта разработки Still Basing

---

## 🎯 Что вы получите

После этого гайда у вас будет:
- ✅ Работающее React приложение
- ✅ Интеграция с Base SDK
- ✅ Coinbase Smart Wallet с gasless транзакциями
- ✅ GitHub Pages deployment
- ✅ Готовый манифест для Base Mini Apps
- ✅ Валидация на base.dev/preview

---

## 📋 Предварительные требования

```bash
# Нужные инструменты
node >= 18.0.0
npm >= 9.0.0
git >= 2.30.0

# Проверить версии
node --version
npm --version
git --version
```

**Аккаунты:**
- GitHub аккаунт (для hosting)
- Base testnet ETH (для тестирования контрактов)
- Coinbase Wallet (для тестирования)

---

## 🚀 Часть 1: Создание проекта (5 минут)

### Шаг 1: Инициализация React + Vite

```bash
# Создать проект
npm create vite@latest my-base-app -- --template react

# Перейти в папку
cd my-base-app

# Установить зависимости
npm install
```

### Шаг 2: Установить Base зависимости

```bash
# Base SDK (ОБЯЗАТЕЛЬНО!)
npm install @farcaster/frame-sdk

# Web3 stack
npm install wagmi viem @tanstack/react-query

# RainbowKit для UI
npm install @rainbow-me/rainbowkit

# Для Base Sepolia
npm install @rainbow-me/rainbowkit@2.2.10 wagmi@2.x viem@2.x
```

### Шаг 3: Настроить Vite config

**ВАЖНО:** GitHub Pages требует base path = имя репозитория!

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, mkdirSync } from 'fs'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-wellknown',
      closeBundle() {
        // Копировать .well-known папку в dist
        mkdirSync('dist/.well-known', { recursive: true })
        copyFileSync(
          'public/.well-known/farcaster.json',
          'dist/.well-known/farcaster.json'
        )
        // Копировать .nojekyll для GitHub Pages
        copyFileSync('public/.nojekyll', 'dist/.nojekyll')
      }
    }
  ],
  base: '/my-base-app/', // ← Замените на имя вашего репозитория!
})
```

---

## 🔧 Часть 2: Web3 конфигурация (10 минут)

### Шаг 1: Создать wagmi config

```javascript
// src/config/wagmi.js
import { http, createConfig } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'
import { coinbaseWallet } from 'wagmi/connectors'

export const config = createConfig({
  chains: [baseSepolia],
  connectors: [
    coinbaseWallet({
      appName: 'My Base App', // ← Ваше название
      preference: 'smartWalletOnly', // ← ВАЖНО для gasless!
    }),
  ],
  transports: {
    [baseSepolia.id]: http(),
  },
})
```

### Шаг 2: Обернуть App в провайдеры

```javascript
// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'
import { config } from './config/wagmi'
import App from './App'

// RainbowKit styles
import '@rainbow-me/rainbowkit/styles.css'
import './index.css'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
)
```

### Шаг 3: Добавить Base SDK в App

```javascript
// src/App.jsx
import { useState, useEffect } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import sdk from '@farcaster/frame-sdk' // ← ОБЯЗАТЕЛЬНО!
import './App.css'

function App() {
  const { address, isConnected } = useAccount()

  // ← КРИТИЧНО! Инициализация Base SDK
  useEffect(() => {
    const initSDK = async () => {
      try {
        const context = await sdk.context
        console.log('Base SDK initialized:', context)
        sdk.actions.ready() // ← Без этого будет ошибка!
      } catch (error) {
        console.error('SDK init failed:', error)
        sdk.actions.ready() // ← Вызывать даже при ошибке!
      }
    }
    initSDK()
  }, [])

  return (
    <div className="app">
      <h1>My Base App</h1>
      <ConnectButton />
      {isConnected && <p>Connected: {address}</p>}
    </div>
  )
}

export default App
```

---

## 📱 Часть 3: Манифест Base Mini Apps (5 минут)

### Шаг 1: Создать папку .well-known

```bash
mkdir -p public/.well-known
```

### Шаг 2: Создать манифест

```json
// public/.well-known/farcaster.json
{
  "frame": {
    "name": "my-base-app",
    "version": "1",
    "iconUrl": "https://YOUR_USERNAME.github.io/YOUR_REPO/icon-1024.png",
    "homeUrl": "https://YOUR_USERNAME.github.io/YOUR_REPO/",
    "subtitle": "Your app subtitle here",
    "description": "Detailed description of your app",
    "primaryCategory": "games",
    "heroImageUrl": "https://YOUR_USERNAME.github.io/YOUR_REPO/hero-1200x630.png",
    "splashImageUrl": "https://YOUR_USERNAME.github.io/YOUR_REPO/splash-200.png",
    "splashBackgroundColor": "#0000FF",
    "tags": ["game", "onchain", "base"],
    "tagline": "Short catchy tagline",
    "ogTitle": "My Base App",
    "ogDescription": "Description for social media sharing",
    "ogImageUrl": "https://YOUR_USERNAME.github.io/YOUR_REPO/og-1200x630.png"
  }
}
```

**ВАЖНО:** Замените `YOUR_USERNAME` и `YOUR_REPO` на свои!

### Шаг 3: Добавить .nojekyll

```bash
# Важно для GitHub Pages!
touch public/.nojekyll
```

### Шаг 4: Подготовить изображения

**Минимальный набор (обязательно):**

1. **icon-1024.png** (1024×1024px)
   - Иконка приложения
   - PNG формат
   - Квадратная

2. **splash-200.png** (200×200px)
   - Splash screen при загрузке
   - PNG формат
   - Квадратная

3. **hero-1200x630.png** (1200×630px)
   - Hero image для discovery
   - PNG или JPG
   - Горизонтальная

4. **og-1200x630.png** (1200×630px)
   - Open Graph для социальных сетей
   - PNG или JPG
   - Горизонтальная

**Положить все в `public/` папку:**
```bash
public/
├── icon-1024.png
├── splash-200.png
├── hero-1200x630.png
├── og-1200x630.png
├── .nojekyll
└── .well-known/
    └── farcaster.json
```

---

## 🚢 Часть 4: GitHub Pages Deployment (10 минут)

### Шаг 1: Создать GitHub репозиторий

```bash
# Инициализировать git
git init
git add .
git commit -m "Initial commit"

# Создать репозиторий на GitHub
# Потом добавить remote:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### Шаг 2: Создать GitHub Actions workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Шаг 3: Включить GitHub Pages

1. Открыть: `https://github.com/YOUR_USERNAME/YOUR_REPO/settings/pages`
2. **Source:** выбрать **"GitHub Actions"** (НЕ "Deploy from a branch"!)
3. Сохранить

### Шаг 4: Сделать репозиторий публичным

1. Settings → Danger Zone
2. Change visibility → Public
3. Подтвердить

### Шаг 5: Запустить deployment

```bash
# Запушить workflow
git add .github/workflows/deploy.yml
git commit -m "Add GitHub Actions workflow"
git push origin main

# Или вручную:
# GitHub → Actions → Deploy to GitHub Pages → Run workflow
```

**Ждать 2-3 минуты**, потом проверить:
```
https://YOUR_USERNAME.github.io/YOUR_REPO/
```

---

## ✅ Часть 5: Валидация (5 минут)

### Шаг 1: Проверить что сайт работает

```bash
# Должна открыться ваша app
https://YOUR_USERNAME.github.io/YOUR_REPO/
```

### Шаг 2: Проверить манифест

```bash
# Должен вернуть JSON
https://YOUR_USERNAME.github.io/YOUR_REPO/.well-known/farcaster.json
```

### Шаг 3: Валидировать на Base Preview Tool

1. Открыть: https://base.dev/preview
2. Ввести URL: `https://YOUR_USERNAME.github.io/YOUR_REPO/`
3. Кликнуть "Validate"

**Проверить 3 таба:**
- ✅ **Metadata** - все изображения загружаются
- ✅ **Account Association** - манифест валидный
- ✅ **Embed** - preview приложения работает

**Если все ✅ зеленые - готово к Featured submission!**

---

## 🎮 Часть 6: Gasless транзакции (бонус)

Если у вас есть smart контракт и вы хотите gasless транзакции:

```javascript
// src/components/GaslessButton.jsx
import { useWriteContracts, useCapabilities } from 'wagmi/experimental'
import { useAccount } from 'wagmi'

function GaslessButton() {
  const { address } = useAccount()
  const { writeContracts, isPending } = useWriteContracts()

  // Получить paymaster capabilities
  const { data: capabilities } = useCapabilities({
    account: address,
  })

  const handleClick = async () => {
    try {
      await writeContracts({
        contracts: [{
          address: '0xYourContractAddress',
          abi: yourABI,
          functionName: 'yourFunction',
          args: [],
        }],
        capabilities, // ← Включает gasless через paymaster
      })
      console.log('Transaction sent (gasless)!')
    } catch (error) {
      console.error('Transaction failed:', error)
    }
  }

  return (
    <button onClick={handleClick} disabled={isPending}>
      {isPending ? 'Sending...' : 'Send Gasless TX'}
    </button>
  )
}

export default GaslessButton
```

**Важно:**
- Работает только с Coinbase Smart Wallet
- Требует `wagmi/experimental`
- Paymaster автоматически активируется на Base

---

## 📊 Полный чеклист готовности

### Код:
- [ ] React приложение создано
- [ ] Base SDK установлен и инициализирован
- [ ] `sdk.actions.ready()` вызывается в useEffect
- [ ] Coinbase Smart Wallet настроен (`smartWalletOnly`)
- [ ] wagmi config правильный
- [ ] RainbowKit провайдеры на месте

### Файлы:
- [ ] `vite.config.js` с правильным base path
- [ ] `public/.nojekyll` создан
- [ ] `public/.well-known/farcaster.json` создан и заполнен
- [ ] Все 4+ изображения в `public/`
- [ ] `.github/workflows/deploy.yml` создан

### GitHub:
- [ ] Репозиторий создан
- [ ] Репозиторий Public
- [ ] GitHub Pages включен (Source: GitHub Actions)
- [ ] GitHub Actions workflow прошел успешно
- [ ] Сайт доступен по URL

### Валидация:
- [ ] Сайт открывается
- [ ] Манифест доступен
- [ ] Base Preview Tool показывает ✅ на всех табах
- [ ] В Developer Mode нет ошибки "Ready not called"

---

## 🐛 Troubleshooting

### Проблема: "Ready not called" в Base

**Решение:**
```javascript
// ВСЕГДА добавляйте в App.jsx
import sdk from '@farcaster/frame-sdk'

useEffect(() => {
  const init = async () => {
    try {
      await sdk.context
      sdk.actions.ready() // ← Эта строка обязательна!
    } catch (e) {
      sdk.actions.ready() // ← И здесь тоже!
    }
  }
  init()
}, [])
```

### Проблема: 403 Forbidden на GitHub Pages

**Решение:**
1. Settings → Change repository visibility → Public
2. Settings → Pages → Source: GitHub Actions
3. Добавить `public/.nojekyll`

### Проблема: Белый экран на GitHub Pages

**Решение:**
Проверить base path в `vite.config.js`:
```javascript
export default defineConfig({
  base: '/YOUR_REPO_NAME/', // Должно совпадать с именем репозитория!
})
```

### Проблема: .well-known возвращает 404

**Решение:**
1. Проверить что `public/.nojekyll` существует
2. Проверить что copy plugin в `vite.config.js` правильный
3. После build проверить: `ls dist/.well-known/`

### Проблема: Smart Wallet не подключается

**Решение:**
```javascript
// В wagmi config ОБЯЗАТЕЛЬНО:
coinbaseWallet({
  appName: 'Your App',
  preference: 'smartWalletOnly', // ← Это ключевое!
})
```

---

## 📚 Полезные команды

```bash
# Локальная разработка
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Проверить build
ls -la dist/.well-known/
cat dist/.well-known/farcaster.json

# Git операции
git status
git add .
git commit -m "Your message"
git push origin main
```

---

## 🎯 Следующие шаги

После успешной валидации:

1. **Подать на Featured**
   - Заполнить форму на Base
   - Указать URL приложения
   - Описать ключевые фичи

2. **Добавить фичи**
   - Smart контракты
   - Больше интерактивности
   - Gamification

3. **Мониторинг**
   - Analytics
   - Error tracking
   - User feedback

---

## ⚡ Краткая версия (TL;DR)

```bash
# 1. Создать проект
npm create vite@latest my-app -- --template react
cd my-app

# 2. Установить зависимости
npm install @farcaster/frame-sdk wagmi viem @tanstack/react-query @rainbow-me/rainbowkit

# 3. Настроить vite.config.js (base path!)

# 4. Добавить Base SDK в App.jsx
# import sdk from '@farcaster/frame-sdk'
# useEffect(() => { sdk.actions.ready() }, [])

# 5. Создать public/.well-known/farcaster.json

# 6. Создать public/.nojekyll

# 7. Создать .github/workflows/deploy.yml

# 8. Push на GitHub
git init && git add . && git commit -m "init"
git remote add origin YOUR_REPO_URL
git push -u origin main

# 9. Settings → Pages → Source: GitHub Actions

# 10. Валидировать на https://base.dev/preview
```

**Время:** 30-40 минут от нуля до готового приложения! 🚀

---

## 📖 Дополнительные ресурсы

**Документация:**
- Base Mini Apps: https://docs.base.org/mini-apps
- Farcaster Frames: https://miniapps.farcaster.xyz/docs
- wagmi: https://wagmi.sh/
- RainbowKit: https://www.rainbowkit.com/

**Tools:**
- Base Preview Tool: https://base.dev/preview
- Base Sepolia Explorer: https://sepolia.basescan.org/

**Examples:**
- Still Basing: https://github.com/Alubiama/StillBASING
- Base Mini Apps Examples: https://github.com/base-org/mini-apps-examples

---

**Удачи с вашим Base Mini App! 🚀**

Если что-то не работает - проверьте `PROJECT_TIMELINE.md` для решений типичных проблем.

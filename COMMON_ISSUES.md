# 🔧 Base Mini Apps - Common Issues & Solutions

> **Решения типичных проблем при разработке Base Mini Apps**
>
> На основе реального опыта разработки Still Basing

---

## 📑 Содержание

1. [Base SDK проблемы](#1-base-sdk-проблемы)
2. [GitHub Pages проблемы](#2-github-pages-проблемы)
3. [Wallet подключение](#3-wallet-подключение)
4. [Транзакции и gasless](#4-транзакции-и-gasless)
5. [Build и deployment](#5-build-и-deployment)
6. [Манифест и валидация](#6-манифест-и-валидация)
7. [Изображения](#7-изображения)
8. [Performance](#8-performance)

---

## 1. Base SDK проблемы

### ❌ Ошибка: "Ready not called"

**Симптомы:**
```
Developer Mode показывает:
"Ready not called"
Your app hasn't called sdk.actions.ready() yet.
This may cause the splash screen to persist.
```

**Причина:**
Base SDK не инициализирован или `sdk.actions.ready()` не вызван

**Решение:**

```javascript
// src/App.jsx
import sdk from '@farcaster/frame-sdk'
import { useEffect } from 'react'

function App() {
  // ← Добавить этот useEffect
  useEffect(() => {
    const initSDK = async () => {
      try {
        // Дождаться загрузки SDK
        const context = await sdk.context
        console.log('Base SDK ready:', context)

        // Сообщить Base что готовы
        sdk.actions.ready()
      } catch (error) {
        console.error('SDK init failed:', error)
        // ВАЖНО: вызвать ready() даже при ошибке!
        sdk.actions.ready()
      }
    }

    initSDK()
  }, []) // ← Пустой array - запустить только раз!

  // ... rest of app
}
```

**Проверка:**
1. Открыть консоль браузера (F12)
2. Должно показать: "Base SDK ready: {user: ..., client: ...}"
3. Ошибка "Ready not called" должна исчезнуть

---

### ❌ Ошибка: "Module not found: @farcaster/frame-sdk"

**Симптомы:**
```bash
npm run dev
# Error: Cannot find module '@farcaster/frame-sdk'
```

**Причина:**
SDK не установлен

**Решение:**
```bash
npm install @farcaster/frame-sdk
```

**Проверка:**
```bash
cat package.json | grep frame-sdk
# Должно показать: "@farcaster/frame-sdk": "^0.x.x"
```

---

### ❌ SDK context undefined

**Симптомы:**
```javascript
const context = await sdk.context
console.log(context) // undefined
```

**Причина:**
Приложение открыто standalone (не в Base Mini Apps)

**Решение:**
SDK context доступен только когда приложение запущено внутри Base. Это нормально!

```javascript
useEffect(() => {
  const initSDK = async () => {
    try {
      const context = await sdk.context

      if (context) {
        // Внутри Base Mini Apps
        console.log('Running in Base:', context.user)
      } else {
        // Standalone режим
        console.log('Running standalone')
      }

      // Вызвать ready() в любом случае
      sdk.actions.ready()
    } catch (error) {
      // Standalone или ошибка - все равно вызвать ready()
      sdk.actions.ready()
    }
  }

  initSDK()
}, [])
```

---

## 2. GitHub Pages проблемы

### ❌ Ошибка: 403 Forbidden

**Симптомы:**
```bash
curl https://username.github.io/repo/
# 403 Forbidden
```

**Причины и решения:**

#### Причина 1: Репозиторий Private

**Проверка:**
```
https://github.com/USERNAME/REPO/settings
Смотреть: Danger Zone → Repository visibility
```

**Решение:**
1. Settings → Danger Zone
2. Change repository visibility
3. Change to public
4. Ввести имя репозитория для подтверждения
5. Confirm

#### Причина 2: GitHub Pages не включен

**Проверка:**
```
https://github.com/USERNAME/REPO/settings/pages
```

**Решение:**
1. Settings → Pages
2. Source: выбрать **"GitHub Actions"**
3. Save

⚠️ **НЕ выбирайте** "Deploy from a branch" - не будет работать!

#### Причина 3: Workflow нет permissions

**Проверка:**
```yaml
# .github/workflows/deploy.yml
permissions:
  pages: write       # ← Должно быть!
  id-token: write    # ← Должно быть!
```

**Решение:**
```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:  # ← Добавить эту секцию
  contents: read
  pages: write
  id-token: write

# ... rest of workflow
```

---

### ❌ Ошибка: 404 Not Found

**Симптомы:**
```bash
curl https://username.github.io/repo/
# 404: File not found
```

**Причины и решения:**

#### Причина 1: Deployment не запущен

**Проверка:**
```
https://github.com/USERNAME/REPO/actions
Смотреть: есть ли successful workflow run?
```

**Решение:**
```bash
# Запустить deployment вручную
git add .
git commit -m "Trigger deployment"
git push origin main

# Или через UI:
# GitHub → Actions → Deploy to GitHub Pages → Run workflow
```

#### Причина 2: Неправильный base path

**Проверка:**
```javascript
// vite.config.js
export default defineConfig({
  base: '/???' // Что здесь?
})
```

**Решение:**
```javascript
// vite.config.js
export default defineConfig({
  base: '/StillBASING/', // ← Должно быть ИМЯ РЕПОЗИТОРИЯ!
  // Важно: начинается и заканчивается с /
})
```

**Проверка после build:**
```bash
npm run build
cat dist/index.html | grep "href="
# Должно показать: href="/REPO_NAME/assets/..."
```

---

### ❌ .well-known возвращает 404

**Симптомы:**
```bash
curl https://username.github.io/repo/.well-known/farcaster.json
# 404 Not Found
```

**Причины и решения:**

#### Причина 1: Нет .nojekyll файла

GitHub Pages использует Jekyll, который игнорирует папки с `.`

**Решение:**
```bash
# Создать .nojekyll
touch public/.nojekyll

# Проверить что копируется в dist
npm run build
ls dist/.nojekyll
```

#### Причина 2: Copy plugin не работает

**Проверка:**
```bash
npm run build
ls -la dist/.well-known/
# Должно показать farcaster.json
```

**Решение:**
```javascript
// vite.config.js
import { copyFileSync, mkdirSync } from 'fs'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-wellknown',
      closeBundle() {
        // Создать папку
        mkdirSync('dist/.well-known', { recursive: true })

        // Копировать манифест
        copyFileSync(
          'public/.well-known/farcaster.json',
          'dist/.well-known/farcaster.json'
        )

        // Копировать .nojekyll
        copyFileSync('public/.nojekyll', 'dist/.nojekyll')
      }
    }
  ]
})
```

---

## 3. Wallet подключение

### ❌ Coinbase Smart Wallet не появляется

**Симптомы:**
- RainbowKit показывает кошельки
- Но Coinbase Wallet отсутствует в списке

**Причина:**
Coinbase Wallet connector не добавлен

**Решение:**
```javascript
// src/config/wagmi.js
import { coinbaseWallet } from 'wagmi/connectors'

export const config = createConfig({
  connectors: [
    coinbaseWallet({  // ← Добавить этот connector
      appName: 'Your App Name',
    }),
  ],
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(),
  },
})
```

---

### ❌ Подключается обычный кошелек, не Smart Wallet

**Симптомы:**
- Coinbase Wallet подключается
- Но это обычный кошелек (externally owned account)
- Нет gasless транзакций

**Причина:**
Не настроен `smartWalletOnly` режим

**Решение:**
```javascript
// src/config/wagmi.js
import { coinbaseWallet } from 'wagmi/connectors'

export const config = createConfig({
  connectors: [
    coinbaseWallet({
      appName: 'Your App Name',
      preference: 'smartWalletOnly', // ← Добавить эту строку!
    }),
  ],
  // ...
})
```

**Проверка:**
После подключения в консоли должно быть:
```
Connected to Coinbase Smart Wallet
Address: 0x... (это адрес контракта, не EOA)
```

---

### ❌ RainbowKit ошибка: "Invalid chain"

**Симптомы:**
```
Error: Chain "baseSepolia" not found in wagmi config
```

**Причина:**
Chain не импортирован или не добавлен в config

**Решение:**
```javascript
// src/config/wagmi.js
import { baseSepolia } from 'wagmi/chains' // ← Импортировать chain

export const config = createConfig({
  chains: [baseSepolia], // ← Добавить в массив
  // ...
})
```

---

## 4. Транзакции и gasless

### ❌ Popup с gas fees появляется

**Симптомы:**
- Smart Wallet подключен
- Но при транзакции появляется popup "Approve transaction"
- Пользователь должен платить gas

**Причина:**
Используется старый `useWriteContract` вместо `useWriteContracts`

**Решение:**
```javascript
// ❌ Старый способ (с gas)
import { useWriteContract } from 'wagmi'

const { writeContract } = useWriteContract()
writeContract({
  address: CONTRACT_ADDRESS,
  abi: ABI,
  functionName: 'myFunction',
})

// ✅ Новый способ (gasless)
import { useWriteContracts, useCapabilities } from 'wagmi/experimental'

const { writeContracts } = useWriteContracts()
const { data: capabilities } = useCapabilities({
  account: address,
})

writeContracts({
  contracts: [{  // ← Обратите внимание: contracts массив!
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'myFunction',
  }],
  capabilities, // ← Это включает paymaster!
})
```

**Важно:**
- Импортировать из `wagmi/experimental`
- Использовать `writeContracts` (множественное число)
- Передать `capabilities`
- Контракты в массиве `contracts: [{...}]`

---

### ❌ Ошибка: "useWriteContracts is not a function"

**Симптомы:**
```javascript
import { useWriteContracts } from 'wagmi/experimental'
// Error: useWriteContracts is not a function
```

**Причина:**
Старая версия wagmi (< 2.0)

**Решение:**
```bash
# Проверить версию
npm list wagmi
# Должно быть >= 2.0

# Обновить если нужно
npm install wagmi@latest viem@latest
```

---

### ❌ Gasless работает локально, но не на production

**Симптомы:**
- Локально: транзакции gasless ✅
- Production: появляется popup с gas ❌

**Причина:**
Paymaster работает только на определенных RPC endpoints

**Решение:**
Убедиться что используется правильный transport:
```javascript
// src/config/wagmi.js
import { http } from 'wagmi'

export const config = createConfig({
  // ...
  transports: {
    [baseSepolia.id]: http(), // ← Использовать публичный RPC
  },
})
```

**Не используйте:**
- Custom RPC без paymaster support
- Alchemy/Infura без настройки paymaster
- WebSocket transport

---

## 5. Build и deployment

### ❌ Build fails: "Cannot find module"

**Симптомы:**
```bash
npm run build
# Error: Cannot find module './Component'
```

**Причина:**
Неправильный case в import (Windows не различает, Linux различает)

**Решение:**
```javascript
// ❌ Неправильно
import Component from './component' // lowercase

// ✅ Правильно
import Component from './Component' // Точно как файл называется
```

**Проверка:**
```bash
ls src/Component.jsx  # Проверить точное название
```

---

### ❌ Build успешен, но сайт показывает белый экран

**Симптомы:**
- `npm run build` - OK ✅
- GitHub Actions - OK ✅
- Но сайт показывает пустую страницу

**Причина:**
JavaScript ошибка при инициализации

**Диагностика:**
1. Открыть консоль браузера (F12)
2. Посмотреть ошибки

**Частые причины:**

#### 1. Неправильный base path
```javascript
// vite.config.js
base: '/' // ❌ Неправильно для GitHub Pages

base: '/StillBASING/' // ✅ Правильно
```

#### 2. Провайдеры в неправильном порядке
```javascript
// ❌ Неправильно
<QueryClientProvider>
  <WagmiProvider>
    <App />
  </WagmiProvider>
</QueryClientProvider>

// ✅ Правильно
<WagmiProvider>
  <QueryClientProvider>
    <RainbowKitProvider>
      <App />
    </RainbowKitProvider>
  </QueryClientProvider>
</WagmiProvider>
```

#### 3. Missing environment variables
```javascript
// Если используете env vars
const API_KEY = import.meta.env.VITE_API_KEY

if (!API_KEY) {
  console.error('API_KEY not set!')
}
```

---

### ❌ GitHub Actions failed: "Deploy failed"

**Симптомы:**
```
GitHub Actions показывает красный ❌
Job "deploy" failed
```

**Причина 1: Нет permissions**

**Решение:**
```yaml
# .github/workflows/deploy.yml
permissions:
  pages: write
  id-token: write
```

**Причина 2: GitHub Pages не включен**

**Решение:**
Settings → Pages → Source: GitHub Actions

**Причина 3: npm ci failed**

**Решение:**
```bash
# Удалить package-lock.json
rm package-lock.json

# Пересоздать
npm install

# Закоммитить новый lock file
git add package-lock.json
git commit -m "Update lock file"
git push
```

---

## 6. Манифест и валидация

### ❌ Base Preview Tool: "Manifest not found"

**Симптомы:**
```
Base Preview Tool → Account Association tab:
❌ Manifest not found at /.well-known/farcaster.json
```

**Причины и решения:**

#### Причина 1: Файл не доступен
```bash
# Проверить
curl https://username.github.io/repo/.well-known/farcaster.json

# Если 404 - смотри раздел "GitHub Pages проблемы"
```

#### Причина 2: Неправильный Content-Type
Должен быть `application/json`, не `text/plain`

**Решение:**
GitHub Pages автоматически ставит правильный Content-Type для .json файлов

#### Причина 3: CORS ошибка
Base не может загрузить манифест из-за CORS

**Решение:**
GitHub Pages автоматически настраивает CORS. Подождите 10-15 минут после deployment.

---

### ❌ Base Preview Tool: "Invalid manifest"

**Симптомы:**
```
Base Preview Tool:
❌ Manifest is invalid
```

**Причина:**
Невалидный JSON или отсутствуют обязательные поля

**Решение:**

**Шаг 1: Проверить JSON синтаксис**
```bash
cat public/.well-known/farcaster.json | jq .
# Или на https://jsonlint.com/
```

**Шаг 2: Проверить обязательные поля**
```json
{
  "frame": {
    "name": "string",           // ← Обязательно
    "version": "1",             // ← Обязательно
    "iconUrl": "https://...",   // ← Обязательно
    "homeUrl": "https://...",   // ← Обязательно
    "primaryCategory": "games"  // ← Обязательно
  }
}
```

**Минимальный валидный манифест:**
```json
{
  "frame": {
    "name": "my-app",
    "version": "1",
    "iconUrl": "https://username.github.io/repo/icon-1024.png",
    "homeUrl": "https://username.github.io/repo/",
    "primaryCategory": "games"
  }
}
```

---

### ❌ Base Preview Tool: Изображения не загружаются

**Симптомы:**
```
Base Preview Tool → Metadata tab:
❌ Icon image: Failed to load
❌ Hero image: Failed to load
```

**Причины и решения:**

#### Причина 1: Изображения не существуют
```bash
# Проверить
curl -I https://username.github.io/repo/icon-1024.png
# Должно вернуть: HTTP/2 200
```

#### Причина 2: Неправильный URL в манифесте
```json
{
  "frame": {
    // ❌ Неправильно
    "iconUrl": "/icon-1024.png",

    // ✅ Правильно - полный URL
    "iconUrl": "https://username.github.io/repo/icon-1024.png"
  }
}
```

#### Причина 3: Изображения слишком большие
Base имеет лимиты на размер изображений

**Решение:**
- Оптимизировать PNG (TinyPNG.com)
- Или конвертировать в JPG
- Размер < 500KB per image

---

## 7. Изображения

### ❌ Изображения размытые

**Причина:**
Изображения слишком маленькие, растянуты

**Решение:**
Создать в правильных размерах:
- icon-1024.png: ровно 1024×1024px
- hero-1200x630.png: ровно 1200×630px
- og-1200x630.png: ровно 1200×630px
- splash-200.png: ровно 200×200px

**Проверка размеров:**
```bash
file public/icon-1024.png
# Должно показать: 1024 x 1024
```

---

### ❌ Splash screen не читается на темном фоне

**Причина:**
Splash image белый, splashBackgroundColor белый

**Решение:**
```json
{
  "frame": {
    "splashImageUrl": "https://.../splash-200.png",
    "splashBackgroundColor": "#0000FF" // ← Контрастный цвет!
  }
}
```

**Tips:**
- Темное изображение → светлый background
- Светлое изображение → темный background
- Или использовать прозрачный PNG с обводкой

---

## 8. Performance

### ❌ Приложение загружается медленно

**Диагностика:**
```bash
# Проверить размер bundle
npm run build
ls -lh dist/assets/*.js
```

**Решения:**

#### 1. Code splitting
```javascript
// Использовать React.lazy
import React, { lazy, Suspense } from 'react'

const HeavyComponent = lazy(() => import('./HeavyComponent'))

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  )
}
```

#### 2. Оптимизировать изображения
```bash
# Использовать WebP вместо PNG
# Или сжать PNG на TinyPNG.com
```

#### 3. Убрать неиспользуемые зависимости
```bash
npm uninstall unused-package
```

---

### ❌ Lighthouse Score низкий

**Проверка:**
1. Открыть DevTools (F12)
2. Lighthouse tab
3. Generate report

**Типичные проблемы:**

#### Performance < 80
- Слишком большие изображения
- Много JavaScript
- Нет code splitting

**Решение:**
- Оптимизировать изображения
- Использовать React.lazy
- Минифицировать код (Vite делает автоматически)

#### Accessibility < 90
- Нет alt текстов на изображениях
- Плохой контраст цветов
- Нет labels на inputs

**Решение:**
```jsx
// ✅ Добавить alt
<img src="..." alt="Description" />

// ✅ Добавить label
<label htmlFor="input">Name</label>
<input id="input" />

// ✅ Проверить контраст
// Использовать https://webaim.org/resources/contrastchecker/
```

---

## 🆘 Если ничего не помогает

### Шаг 1: Проверить базовую конфигурацию

```bash
# Проверить что все установлено
npm list @farcaster/frame-sdk wagmi viem @rainbow-me/rainbowkit

# Проверить что build работает
npm run build

# Проверить что файлы на месте
ls dist/.well-known/farcaster.json
ls dist/.nojekyll
```

### Шаг 2: Проверить deployment

```bash
# Проверить GitHub Actions
https://github.com/USERNAME/REPO/actions

# Проверить что сайт доступен
curl -I https://username.github.io/repo/

# Проверить манифест
curl https://username.github.io/repo/.well-known/farcaster.json
```

### Шаг 3: Сравнить с working example

Clone Still Basing:
```bash
git clone https://github.com/Alubiama/StillBASING
cd StillBASING
npm install
npm run build
```

Сравнить файлы:
- `vite.config.js`
- `src/config/wagmi.js`
- `src/App.jsx`
- `public/.well-known/farcaster.json`
- `.github/workflows/deploy.yml`

### Шаг 4: Создать минимальный репро

Создать самый простой пример:
1. `npm create vite@latest test-app -- --template react`
2. Добавить только Base SDK
3. Задеплоить на GitHub Pages
4. Если работает - добавлять код постепенно
5. Найти что ломает

---

## 📚 Дополнительные ресурсы

**Документация:**
- Base Mini Apps Docs: https://docs.base.org/mini-apps
- Base Troubleshooting: https://docs.base.org/mini-apps/troubleshooting
- wagmi Docs: https://wagmi.sh/
- RainbowKit Docs: https://www.rainbowkit.com/

**Community:**
- Base Discord: https://discord.gg/buildonbase
- Stack Overflow: [base-network] tag
- GitHub Discussions: base-org/miniapps

**Tools:**
- Base Preview Tool: https://base.dev/preview
- JSON Validator: https://jsonlint.com/
- Image Optimizer: https://tinypng.com/
- Contrast Checker: https://webaim.org/resources/contrastchecker/

---

## 💡 Tips для предотвращения проблем

### 1. Тестируйте рано и часто
- Deploy на GitHub Pages сразу
- Проверяйте Base Preview Tool после каждого изменения
- Используйте Lighthouse в процессе разработки

### 2. Следуйте чеклистам
- `DEPLOYMENT_CHECKLIST.md` перед каждым deploy
- Не пропускайте пункты

### 3. Документируйте свои проблемы
- Записывайте ошибки и решения
- Помогите следующему разработчику

### 4. Используйте examples
- Клонируйте working projects
- Сравнивайте конфигурации
- Учитесь на чужих решениях

### 5. Читайте документацию
- Base Docs очень подробные
- wagmi docs объясняют все хуки
- Ищите примеры кода

---

**Удачи! Если нашли новую проблему - добавьте её в этот документ! 🚀**

# ✅ Base Mini Apps - Pre-Deployment Checklist

> **Используйте этот чеклист перед каждым deployment**
>
> Все пункты должны быть ✅ перед подачей на Featured

---

## 📦 1. Код и зависимости

### Base SDK
- [ ] `@farcaster/frame-sdk` установлен
- [ ] SDK импортирован в App.jsx: `import sdk from '@farcaster/frame-sdk'`
- [ ] `sdk.actions.ready()` вызывается в useEffect
- [ ] useEffect имеет пустой dependency array: `useEffect(() => {...}, [])`
- [ ] Обработка ошибок: вызов `ready()` в catch блоке

**Проверка:**
```javascript
// App.jsx должен содержать:
import sdk from '@farcaster/frame-sdk'

useEffect(() => {
  const init = async () => {
    try {
      await sdk.context
      sdk.actions.ready()
    } catch (error) {
      console.error('SDK failed:', error)
      sdk.actions.ready() // ← Обязательно!
    }
  }
  init()
}, [])
```

### Web3 Stack
- [ ] `wagmi` установлен (версия 2.x)
- [ ] `viem` установлен (версия 2.x)
- [ ] `@rainbow-me/rainbowkit` установлен
- [ ] `@tanstack/react-query` установлен
- [ ] wagmi config создан (`src/config/wagmi.js`)
- [ ] Coinbase Wallet connector настроен с `smartWalletOnly: true`

**Проверка:**
```javascript
// src/config/wagmi.js
coinbaseWallet({
  appName: 'Your App',
  preference: 'smartWalletOnly', // ← Должно быть!
})
```

### Провайдеры
- [ ] App обернут в `WagmiProvider`
- [ ] App обернут в `QueryClientProvider`
- [ ] App обернут в `RainbowKitProvider`
- [ ] Порядок провайдеров правильный (Wagmi → Query → RainbowKit)

**Проверка:**
```javascript
// main.jsx
<WagmiProvider config={config}>
  <QueryClientProvider client={queryClient}>
    <RainbowKitProvider>
      <App />
    </RainbowKitProvider>
  </QueryClientProvider>
</WagmiProvider>
```

---

## 🎨 2. Изображения

### Обязательные изображения
- [ ] `public/icon-1024.png` (1024×1024px) - иконка
- [ ] `public/splash-200.png` (200×200px) - splash screen
- [ ] `public/hero-1200x630.png` (1200×630px) - hero
- [ ] `public/og-1200x630.png` (1200×630px) - Open Graph

### Рекомендуемые изображения
- [ ] `public/icon-512.png` (512×512px) - средняя иконка
- [ ] `public/icon-192.png` (192×192px) - PWA иконка
- [ ] `public/screenshot-1.png` (1284×2778px portrait) - скриншот 1
- [ ] `public/screenshot-2.png` (1284×2778px portrait) - скриншот 2
- [ ] `public/screenshot-3.png` (1284×2778px portrait) - скриншот 3

### Проверка качества изображений
- [ ] Все изображения в формате PNG
- [ ] Размеры точно соответствуют требованиям
- [ ] Изображения не размытые (хорошее качество)
- [ ] На изображениях виден контент приложения
- [ ] Splash screen читаемый на любом фоне

**Проверка размеров:**
```bash
file public/icon-1024.png
# Должно показать: 1024 x 1024

file public/hero-1200x630.png
# Должно показать: 1200 x 630
```

---

## 📄 3. Манифест и метаданные

### Манифест файл
- [ ] Файл создан: `public/.well-known/farcaster.json`
- [ ] JSON валидный (проверить на jsonlint.com)
- [ ] Поле `name` заполнено (lowercase, no spaces)
- [ ] Поле `version` = "1"
- [ ] Поле `iconUrl` указывает на icon-1024.png
- [ ] Поле `homeUrl` - корректный URL вашего app
- [ ] Поле `subtitle` заполнен (короткое описание)
- [ ] Поле `description` заполнен (подробное описание)
- [ ] Поле `primaryCategory` выбрано из списка Base
- [ ] Поле `heroImageUrl` указывает на hero-1200x630.png
- [ ] Поле `splashImageUrl` указывает на splash-200.png
- [ ] Поле `splashBackgroundColor` в hex формате (#RRGGBB)
- [ ] Поле `tags` - массив минимум 3 тега
- [ ] Поле `tagline` - короткий слоган
- [ ] Поля `ogTitle`, `ogDescription`, `ogImageUrl` заполнены

**Проверка JSON:**
```bash
cat public/.well-known/farcaster.json | jq .
# Должно распарсить без ошибок
```

### Open Graph метаданные
- [ ] В `index.html` есть `<meta property="og:type" content="website" />`
- [ ] В `index.html` есть `<meta property="og:url" ... />`
- [ ] В `index.html` есть `<meta property="og:title" ... />`
- [ ] В `index.html` есть `<meta property="og:description" ... />`
- [ ] В `index.html` есть `<meta property="og:image" ... />`
- [ ] В `index.html` есть `<meta property="og:image:width" content="1200" />`
- [ ] В `index.html` есть `<meta property="og:image:height" content="630" />`

### Farcaster Frame метаданные
- [ ] В `index.html` есть `<meta property="fc:frame" content="vNext" />`
- [ ] В `index.html` есть `<meta property="fc:frame:image" ... />`
- [ ] В `index.html` есть `<meta property="fc:frame:button:1" ... />`

---

## ⚙️ 4. Vite конфигурация

### Base path
- [ ] `vite.config.js` содержит `base: '/YOUR_REPO_NAME/'`
- [ ] Base path совпадает с именем GitHub репозитория
- [ ] Base path начинается и заканчивается с `/`

**Проверка:**
```javascript
// vite.config.js
export default defineConfig({
  base: '/StillBASING/', // ← Должно совпадать с repo name!
})
```

### Copy plugin
- [ ] Plugin копирует `.well-known/farcaster.json` в `dist/`
- [ ] Plugin копирует `.nojekyll` в `dist/`
- [ ] Plugin создает папку `dist/.well-known/` если её нет

**Проверка:**
```javascript
// vite.config.js
plugins: [
  react(),
  {
    name: 'copy-wellknown',
    closeBundle() {
      mkdirSync('dist/.well-known', { recursive: true })
      copyFileSync(
        'public/.well-known/farcaster.json',
        'dist/.well-known/farcaster.json'
      )
      copyFileSync('public/.nojekyll', 'dist/.nojekyll')
    }
  }
]
```

---

## 🚢 5. GitHub настройки

### Репозиторий
- [ ] Репозиторий создан на GitHub
- [ ] Репозиторий **Public** (не Private!)
- [ ] Имя репозитория без пробелов и спецсимволов
- [ ] README.md существует
- [ ] .gitignore настроен (node_modules, dist, .env)

### GitHub Pages
- [ ] GitHub Pages включен (Settings → Pages)
- [ ] Source установлен на **"GitHub Actions"** (НЕ "Deploy from a branch"!)
- [ ] Custom domain НЕ настроен (если не нужен)

**Проверка:**
```
Открыть: https://github.com/USERNAME/REPO/settings/pages
Убедиться: Source = GitHub Actions
```

### GitHub Actions
- [ ] Файл `.github/workflows/deploy.yml` создан
- [ ] Workflow имеет `permissions: pages: write, id-token: write`
- [ ] Workflow запускается на `push: branches: [main]`
- [ ] Workflow имеет `workflow_dispatch` для ручного запуска

**Проверка:**
```yaml
# .github/workflows/deploy.yml
permissions:
  pages: write
  id-token: write
```

---

## 📁 6. Структура файлов

### Обязательные файлы
- [ ] `package.json` существует
- [ ] `vite.config.js` существует
- [ ] `src/main.jsx` существует
- [ ] `src/App.jsx` существует
- [ ] `src/config/wagmi.js` существует
- [ ] `public/.nojekyll` существует
- [ ] `public/.well-known/farcaster.json` существует
- [ ] `.github/workflows/deploy.yml` существует

### Проверка структуры
```
my-base-app/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── public/
│   ├── .nojekyll
│   ├── .well-known/
│   │   └── farcaster.json
│   ├── icon-1024.png
│   ├── splash-200.png
│   ├── hero-1200x630.png
│   └── og-1200x630.png
├── src/
│   ├── config/
│   │   └── wagmi.js
│   ├── App.jsx
│   └── main.jsx
├── vite.config.js
└── package.json
```

---

## 🔨 7. Build проверка

### Локальный build
- [ ] `npm run build` завершается без ошибок
- [ ] Папка `dist/` создается
- [ ] `dist/.well-known/farcaster.json` существует
- [ ] `dist/.nojekyll` существует
- [ ] `dist/index.html` содержит правильный base path

**Проверка:**
```bash
npm run build

# Проверить что все скопировалось
ls -la dist/.well-known/
ls -la dist/.nojekyll

# Проверить base path в HTML
grep -r "href=" dist/index.html
# Должно показать: href="/YOUR_REPO/..."
```

### Preview build
- [ ] `npm run preview` запускается
- [ ] Приложение открывается в браузере
- [ ] Все изображения загружаются
- [ ] Кошелек подключается
- [ ] Нет ошибок в консоли

---

## 🌐 8. Deployment проверка

### После push на GitHub
- [ ] GitHub Actions workflow запустился
- [ ] Workflow завершился успешно (✅ зеленый)
- [ ] Job "build" прошел без ошибок
- [ ] Job "deploy" прошел без ошибок
- [ ] Deployment занял < 5 минут

**Проверка:**
```
Открыть: https://github.com/USERNAME/REPO/actions
Убедиться: последний workflow зеленый ✅
```

### Публичный доступ
- [ ] Сайт открывается: `https://USERNAME.github.io/REPO/`
- [ ] Страница не показывает 404
- [ ] Страница не показывает 403
- [ ] Контент приложения виден
- [ ] Изображения загружаются

**Проверка:**
```bash
curl -I https://USERNAME.github.io/REPO/
# Должно вернуть: HTTP/2 200
```

### Манифест доступен
- [ ] Манифест доступен: `https://USERNAME.github.io/REPO/.well-known/farcaster.json`
- [ ] Возвращает валидный JSON (не HTML)
- [ ] Content-Type: application/json
- [ ] Нет ошибок CORS

**Проверка:**
```bash
curl https://USERNAME.github.io/REPO/.well-known/farcaster.json
# Должно вернуть JSON
```

---

## ✨ 9. Base валидация

### Base Preview Tool
- [ ] Открыть: https://base.dev/preview
- [ ] Ввести URL приложения
- [ ] Кликнуть "Validate"
- [ ] Дождаться завершения проверки

### Metadata Tab
- [ ] ✅ Icon image загружается
- [ ] ✅ Hero image загружается
- [ ] ✅ Splash image загружается
- [ ] ✅ OG image загружается
- [ ] ✅ Screenshots загружаются (если есть)
- [ ] ✅ Все размеры правильные
- [ ] ✅ Нет ошибок "Image failed to load"

### Account Association Tab
- [ ] ✅ Manifest found at /.well-known/farcaster.json
- [ ] ✅ Manifest is valid JSON
- [ ] ✅ All required fields present
- [ ] ✅ Domain verified
- [ ] ✅ HTTPS enabled

### Embed Tab
- [ ] ✅ Preview shows your app
- [ ] ✅ App loads without errors
- [ ] ✅ No "Ready not called" error
- [ ] ✅ App interactive (можно кликать)
- [ ] ✅ Splash screen исчезает

---

## 🧪 10. Функциональное тестирование

### Base Developer Mode
- [ ] Открыть приложение в Base
- [ ] Developer Mode включен
- [ ] Нет ошибки "Ready not called"
- [ ] Splash screen скрывается
- [ ] Приложение полностью загружается
- [ ] Нет JavaScript ошибок в консоли

### Coinbase Smart Wallet
- [ ] Кошелек подключается
- [ ] Показывает правильный адрес
- [ ] Balance отображается (если нужен)
- [ ] Можно отключить кошелек
- [ ] Можно переподключить кошелек

### Транзакции (если есть контракт)
- [ ] Транзакция отправляется
- [ ] НЕ показывается popup с gas fees (для Smart Wallet)
- [ ] Показывается статус "Sending..."
- [ ] Транзакция завершается успешно
- [ ] UI обновляется после транзакции
- [ ] Можно отправить еще одну транзакцию

---

## 📊 11. Performance

### Lighthouse
- [ ] Performance score > 80
- [ ] Accessibility score > 90
- [ ] Best Practices score > 90
- [ ] SEO score > 80

### Loading
- [ ] First Contentful Paint < 2s
- [ ] Time to Interactive < 3s
- [ ] Total page size < 2MB
- [ ] Images оптимизированы

---

## 🎯 12. Pre-Featured Submission

### Финальная проверка
- [ ] Все чекбоксы выше ✅
- [ ] Base Preview Tool показывает все ✅
- [ ] Приложение работает в Base Developer Mode
- [ ] Нет критических ошибок
- [ ] Gasless транзакции работают (если есть)

### Документация
- [ ] README.md обновлен
- [ ] Описание приложения понятное
- [ ] Инструкции по использованию есть
- [ ] Ссылки на контракты (если есть)
- [ ] License указана

### Marketing materials
- [ ] Короткое описание (1-2 предложения)
- [ ] Подробное описание (пара абзацев)
- [ ] Key features список
- [ ] Screenshots готовы
- [ ] Demo video (опционально)

---

## 🚀 Ready to Submit!

Если все пункты ✅:

1. **Заполнить заявку на Featured**
   - Использовать шаблон из `FEATURED_SUBMISSION.md`
   - Указать все URLs
   - Описать key features

2. **Отправить на review**
   - Base submission form
   - Или через Discord/Twitter

3. **Мониторить статус**
   - Проверять email
   - Следить за обновлениями

---

## ❌ Если что-то не работает

### Красный крестик на Base Preview Tool
→ Откройте `COMMON_ISSUES.md` для решений

### GitHub Actions failed
→ Проверьте логи workflow
→ Проверьте permissions

### 403 Forbidden
→ Репозиторий должен быть Public
→ GitHub Pages должен быть включен

### "Ready not called"
→ Проверьте что SDK инициализирован
→ Проверьте что `ready()` вызывается

---

## 📝 Использование этого чеклиста

### Перед каждым deployment:
1. Распечатать или открыть этот файл
2. Пройтись по всем секциям
3. Отметить все пункты
4. Исправить проблемы
5. Задеплоить только когда все ✅

### После deployment:
1. Сохранить копию заполненного чеклиста
2. Записать дату и время deployment
3. Записать версию приложения
4. Сохранить в git history

---

**Удачи с deployment! 🚀**

Если возникли проблемы - смотрите:
- `PROJECT_TIMELINE.md` - опыт разработки Still Basing
- `BASE_MINIAPPS_QUICKSTART.md` - quick start guide
- `COMMON_ISSUES.md` - типичные проблемы и решения

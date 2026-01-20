# TODO - Still Basing App Development

## Текущий статус проекта

**Что уже работает:**
- ✅ Базовая игра с анимацией кнопки "Still basing"
- ✅ Подключение кошелька через RainbowKit
- ✅ Запись кликов на блокчейн (Base Sepolia)
- ✅ **НОВОЕ:** Рабочая навигация между экранами (Play, Stats, NFT, Info)
- ✅ **НОВОЕ:** Экран Stats с детальной статистикой и прогрессом
- ✅ **НОВОЕ:** Экран NFT с возможностью клейма наград
- ✅ Отображение базовой статистики (ваши клики, общие клики, количество достижений)
- ✅ Авто-коннект кошелька для Base Mini Apps
- ✅ Темная/светлая тема
- ✅ Onboarding экран для новых пользователей
- ✅ GitHub Pages deployment workflow
- ✅ **НОВОЕ:** Манифест Base Mini Apps (/.well-known/farcaster.json)
- ✅ **НОВОЕ:** Open Graph метаданные для embed
- ✅ **НОВОЕ:** Все изображения для Featured (icons, screenshots, OG images)
- ✅ **НОВОЕ:** Coinbase Smart Wallet интеграция для спонсируемых транзакций

**Контракты:**
- BasingCounter: `0x9a561f3018F454e2D2dBB30a71f8C1Cd3a84404c`
- BasingNFT: `0xAff4b98Ab1fC5Bac2a130751734c02f32c8DD679`

---

## Что нужно сделать СРОЧНО для Featured

### 1. ✅ Создать изображения для манифеста (ГОТОВО!)
**Выполнено:**
- ✅ `public/icon-1024.png` - иконка приложения (1024×1024px, PNG)
- ✅ `public/splash-200.png` - splash screen (200×200px, PNG)
- ✅ `public/hero-1200x630.png` - hero изображение для discovery (1200×630px)
- ✅ `public/og-1200x630.png` - Open Graph изображение (1200×630px)
- ✅ `public/screenshot-1.png` - скриншот Play экрана (1284×2778px portrait)
- ✅ `public/screenshot-2.png` - скриншот Stats экрана (1284×2778px portrait)
- ✅ `public/screenshot-3.png` - скриншот NFT экрана (1284×2778px portrait)

**Результат:** Все изображения созданы и готовы для Featured валидации!

---

### 2. ✅ Манифест Base Mini Apps (ГОТОВО)
**Выполнено:**
- ✅ Создан файл `/.well-known/farcaster.json`
- ✅ Заполнены все обязательные поля (name, homeUrl, iconUrl, category, tags, etc.)
- ✅ Добавлены Open Graph метаданные в index.html
- ✅ Добавлены Farcaster Frame метаданные

---

### 3. Валидация и тестирование
**Что нужно сделать ПОСЛЕ создания изображений:**
- [ ] Задеплоить на GitHub Pages
- [ ] Проверить на https://base.dev/preview
- [ ] Убедиться что все изображения загружаются
- [ ] Проверить embed в Base App
- [ ] Проверить Account Association

---

### 4. ✅ Настроить Paymaster (ГОТОВО!)
**Выполнено:**
- ✅ Интегрирован Coinbase Smart Wallet в wagmi config (`smartWalletOnly`)
- ✅ Создан хук `usePaymasterCapabilities` для paymaster возможностей
- ✅ Обновлен `PlayScreen.jsx` с использованием `useWriteContracts` (experimental)
- ✅ Обновлен `NFTScreen.jsx` с использованием `useWriteContracts` (experimental)
- ✅ Добавлена поддержка ERC-7677 paymaster через `useCapabilities`

**Как работает:**
- Smart Wallet автоматически определяет возможность спонсирования
- При наличии paymaster - транзакции БЕСПЛАТНЫЕ для пользователей
- Отображаются статусы "Recording (gasless)..." и "(No gas fees!)"

**Важно:** Coinbase Smart Wallet автоматически поддерживает спонсируемые транзакции на Base через Base Paymaster

---

### 5. Оптимизация и улучшения (потом)
- [ ] Добавить звуковые эффекты при клике
- [ ] Анимации при разблокировке достижений
- [ ] Таблица лидеров (топ игроков)
- [ ] Share в социальных сетях
- [ ] PWA support
- [ ] Analytics и мониторинг

---

## Следующие шаги для попадания в Featured

### Шаг 1: Создать изображения (сегодня)
1. Открыть Figma/Canva
2. Создать все 7 изображений по требованиям выше
3. Сохранить в `public/` папку
4. Закоммитить и задеплоить

### Шаг 2: Настроить Paymaster (завтра)
1. Зарегистрироваться на Coinbase Developer Platform
2. Получить API ключ
3. Настроить в коде
4. Протестировать

### Шаг 3: Валидация (после 1 и 2)
1. Открыть https://base.dev/preview
2. Ввести URL приложения
3. Проверить все вкладки (Metadata, Account Association, Embed)
4. Исправить ошибки если есть

### Шаг 4: Подать заявку на Featured
1. Убедиться что все чек-боксы зелёные
2. Заполнить форму на Base
3. Ждать одобрения

---

## Важные ссылки

- **Base Mini Apps Docs:** https://docs.base.org/mini-apps
- **Build Checklist:** https://docs.base.org/mini-apps/quickstart/build-checklist
- **Preview Tool:** https://base.dev/preview
- **Coinbase Developer Platform:** https://portal.cdp.coinbase.com/
- **Farcaster Mini Apps Spec:** https://miniapps.farcaster.xyz/docs/specification

---

## Как продолжить после перезапуска

1. Открыть этот файл `TODO.md`
2. Посмотреть раздел "Что нужно сделать СРОЧНО для Featured"
3. Начать с первой задачи со статусом [ ]
4. По мере выполнения менять [ ] на [x]
5. Когда все готово - коммитить и пушить в GitHub

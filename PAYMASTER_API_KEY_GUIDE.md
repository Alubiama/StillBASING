# Как получить Coinbase Paymaster API Key (5 минут)

## Зачем это нужно?
**КРИТИЧНО:** Для попадания в Featured Base Mini Apps все транзакции ДОЛЖНЫ быть бесплатными (gasless) для пользователей!

---

## Шаг 1: Регистрация на Coinbase Developer Platform

1. Открой https://portal.cdp.coinbase.com/
2. Нажми "Sign up" или "Get started"
3. Войди через Coinbase аккаунт (или создай новый)

---

## Шаг 2: Создать проект

1. После входа нажми "Create project" или "New project"
2. Введи название: **Still Basing**
3. Выбери **Base Sepolia** (для тестирования)
4. Подтверди создание

---

## Шаг 3: Получить API ключ

1. В проекте найди раздел **"API Keys"** или **"Settings"**
2. Нажми **"Create API Key"** или **"Generate new key"**
3. Выбери права:
   - ✅ **Paymaster** - обязательно!
   - ✅ **Gasless transactions**
4. Скопируй ключ (показывается ТОЛЬКО ОДИН РАЗ!)
   - Формат: `cdp_api_XXXXXXXXXXXXXXXXXXXXXXXX`

---

## Шаг 4: Добавить ключ в проект

### Вариант A: Локальная разработка

1. Создай файл `.env` в корне проекта:
```bash
VITE_CDP_API_KEY=cdp_api_твой_ключ_сюда
```

2. Убедись что `.env` в `.gitignore` (УЖЕ ДОБАВЛЕНО!)

### Вариант B: GitHub Pages (Production)

⚠️ **НЕ добавляй API ключ в код!** Для production используй один из вариантов:

**Вариант 1: GitHub Secrets** (Рекомендуется)
1. Открой https://github.com/Alubiama/StillBASING/settings/secrets/actions
2. Нажми "New repository secret"
3. Name: `VITE_CDP_API_KEY`
4. Value: `твой_api_ключ`
5. Обнови `.github/workflows/deploy.yml` чтобы использовать secret при build

**Вариант 2: Public без Paymaster**
- Для начала можешь задеплоить без paymaster
- Добавишь позже когда будешь готов к production

---

## Шаг 5: Активировать Paymaster в коде

1. Открой файл `src/config/paymaster.js`
2. Найди строку:
```javascript
enabled: false,  // Set to true after getting CDP API key
```
3. Измени на:
```javascript
enabled: true,  // Paymaster активирован!
```

---

## Шаг 6: Тестирование

1. Запусти локально:
```bash
npm run dev
```

2. Подключи кошелек к Base Sepolia
3. Сделай клик в игре
4. **Проверь:** Транзакция должна пройти БЕЗ запроса на оплату gas!

---

## Troubleshooting

### Ошибка: "Paymaster not configured"
- Проверь что `.env` файл создан и ключ правильный
- Перезапусти dev сервер: `npm run dev`

### Ошибка: "Invalid API key"
- Проверь что ключ начинается с `cdp_api_`
- Убедись что скопировал весь ключ полностью
- Создай новый ключ на portal.cdp.coinbase.com

### Ошибка: "Unauthorized"
- Убедись что в настройках API ключа включен **Paymaster**
- Проверь что выбрана правильная сеть (Base Sepolia)

### Транзакция всё равно запрашивает gas
- Проверь что `enabled: true` в `src/config/paymaster.js`
- Проверь console в браузере на ошибки
- Убедись что контракт работает на Base Sepolia (chainId 84532)

---

## Мониторинг и лимиты

1. Открой https://portal.cdp.coinbase.com/
2. Зайди в свой проект
3. Раздел **"Analytics"** или **"Usage"**
4. Отслеживай:
   - Количество спонсированных транзакций
   - Расходы на gas
   - Оставшиеся лимиты

### Лимиты:
- **Testnet (Base Sepolia):** Обычно бесплатно или большой лимит
- **Mainnet (Base):** Платно, следи за расходами!

---

## Что дальше?

После настройки Paymaster:
1. ✅ Протестируй несколько транзакций
2. ✅ Убедись что gas не запрашивается
3. ✅ Задеплой на GitHub Pages
4. ✅ Проверь на https://base.dev/preview
5. ✅ Подавай заявку на Featured!

---

## Важные ссылки

- **Coinbase Developer Platform:** https://portal.cdp.coinbase.com/
- **Документация Paymaster:** https://docs.cdp.coinbase.com/
- **Base Discord (помощь):** https://discord.gg/buildonbase
- **Наш TODO.md:** См. раздел "Настроить Paymaster"

# Настройка Paymaster для спонсируемых транзакций

## Что такое Paymaster?

Paymaster позволяет спонсировать gas fees для пользователей, делая транзакции полностью бесплатными. Это критически важно для Base Mini Apps.

## Как настроить Coinbase Paymaster

### Шаг 1: Получить API ключ

1. Перейдите на [Coinbase Developer Platform](https://portal.cdp.coinbase.com/)
2. Войдите или создайте аккаунт
3. Создайте новый проект
4. В настройках проекта найдите раздел "API Keys"
5. Создайте новый API ключ для Base Sepolia
6. Скопируйте ключ (он будет показан только один раз!)

### Шаг 2: Добавить ключ в проект

1. Создайте файл `.env` в корне проекта:
```bash
VITE_CDP_API_KEY=your_api_key_here
```

2. Убедитесь, что `.env` добавлен в `.gitignore` (НЕ коммитьте API ключ!)

### Шаг 3: Активировать Paymaster

1. Откройте файл `src/config/paymaster.js`
2. Измените `enabled: false` на `enabled: true`
3. Сохраните файл

### Шаг 4: Пересобрать проект

```bash
npm run build
```

## Проверка работы

После настройки:
1. Откройте приложение
2. Подключите кошелек
3. Сделайте клик
4. Транзакция должна пройти БЕЗ запроса на оплату gas!

## Важно для Featured Mini Apps

✅ **Требование для Featured:** Все транзакции ДОЛЖНЫ быть спонсированными (бесплатными для пользователей)

❌ **Без Paymaster:** Приложение не будет принято в Featured секцию

## Альтернативные решения

Если у вас нет доступа к Coinbase Paymaster, можете использовать:
- [Pimlico](https://www.pimlico.io/) - альтернативный Paymaster сервис
- [Alchemy](https://www.alchemy.com/) - поддерживает Account Abstraction
- [Biconomy](https://www.biconomy.io/) - Paymaster для разных сетей

## Мониторинг использования

1. Зайдите в [Coinbase Developer Portal](https://portal.cdp.coinbase.com/)
2. Откройте свой проект
3. Перейдите в раздел "Analytics"
4. Отслеживайте количество спонсированных транзакций и расходы

## Лимиты и тарифы

- **Тестнет (Base Sepolia):** Обычно бесплатно или с большими лимитами
- **Мейннет (Base):** Требует оплаты за спонсируемые транзакции
- Проверьте актуальные тарифы на сайте Coinbase Developer Platform

## Поддержка

- Документация: https://docs.cdp.coinbase.com/
- Discord: https://discord.gg/cdp
- Base Discord: https://discord.gg/buildonbase

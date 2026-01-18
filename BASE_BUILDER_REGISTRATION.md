# 🏗️ Регистрация в Base Builder Program

Пошаговая инструкция для регистрации вашего приложения от вашего аккаунта.

## 📋 Информация о вашем приложении:

- **Название**: Still Basing
- **URL**: https://alubiama.github.io/StillBASING/
- **GitHub**: https://github.com/Alubiama/StillBASING
- **Wallet Address**: `0x47550e121654FED9Bc17ed2f684E902a4B1fF102`
- **Описание**: Interactive on-chain achievement app built on Base blockchain. Users click to earn achievements and mint NFTs.

---

## 🎯 Вариант 1: Base App Directory

### Шаг 1: Подготовка
Убедитесь что:
- ✅ Контракты задеплоены на Base Sepolia/Mainnet
- ✅ Приложение работает на https://alubiama.github.io/StillBASING/
- ✅ Есть WalletConnect Project ID

### Шаг 2: Заполнение заявки

1. Перейдите: https://base.org/builder-registration (или https://airtable.com/appQ4ib2tLnUWOTr3/shrT8y0JjSmGQ5fhF)

2. Заполните форму:

   **Basic Information:**
   - Project Name: `Still Basing`
   - Project Description: `Interactive on-chain achievement app. Click to track progress on-chain and earn NFT achievements at milestones (10, 50, 100, 500, 1000 clicks). Built with React, Wagmi, and Solidity.`
   - Website: `https://alubiama.github.io/StillBASING/`
   - Twitter (optional): Ваш Twitter если есть
   - Discord (optional): Ваш Discord если есть

   **Technical Details:**
   - Blockchain: `Base`
   - Contract Address(es): Укажите адреса BasingCounter и BasingNFT после деплоя
   - GitHub: `https://github.com/Alubiama/StillBASING`
   - Category: `Gaming` или `Social`

   **Team:**
   - Team Size: `1` (Solo developer)
   - Your Role: `Full-stack developer`
   - Builder Address: `0x47550e121654FED9Bc17ed2f684E902a4B1fF102`

3. Нажмите **Submit**

### Шаг 3: Ожидание

- Обычно ревью занимает 1-2 недели
- Base команда может запросить дополнительную информацию
- После одобрения ваше приложение появится в Base App Directory

---

## 🌟 Вариант 2: Base Ecosystem Page

Альтернативный способ - добавить проект напрямую через PR:

1. Форкните репозиторий: https://github.com/base-org/base-ecosystem
2. Добавьте ваш проект в файл `projects.json`:

```json
{
  "name": "Still Basing",
  "description": "Interactive on-chain achievement app with NFT rewards",
  "url": "https://alubiama.github.io/StillBASING/",
  "github": "https://github.com/Alubiama/StillBASING",
  "category": "gaming",
  "tags": ["nft", "achievements", "on-chain"],
  "contracts": {
    "BasingCounter": "0x...",
    "BasingNFT": "0x..."
  }
}
```

3. Создайте Pull Request
4. Дождитесь ревью от Base команды

---

## 🏆 Вариант 3: Base Guild / BuilderFi

Зарегистрируйтесь как Builder:

1. Перейдите: https://guild.xyz/base
2. Подключите кошелек `0x47550e121654FED9Bc17ed2f684E902a4B1fF102`
3. Пройдите верификацию
4. Получите роль "Base Builder"
5. Доступ к эксклюзивным каналам и возможностям

---

## 📱 Вариант 4: Coinbase Wallet Dapp Store

После деплоя контрактов в mainnet:

1. Перейдите: https://www.coinbase.com/wallet/developers
2. Submit your dapp
3. Заполните информацию о Still Basing
4. Ваше приложение появится в Coinbase Wallet

---

## 🎨 Дополнительно: Подготовка медиа

Для лучшего представления создайте:

### Logo & Icons
- [ ] Icon 192x192px (для manifest.json)
- [ ] Icon 512x512px (для manifest.json)
- [ ] OG Image 1200x630px (для социальных сетей)

### Screenshots
- [ ] Desktop screenshot (1920x1080)
- [ ] Mobile screenshot (375x812)
- [ ] Wallet connection flow

### Demo Video (опционально)
- 30-60 секунд демо функциональности
- Показать: подключение кошелька → клики → получение NFT

---

## ✅ Чеклист перед подачей заявки:

- [ ] Контракты задеплоены и верифицированы на Basescan
- [ ] Приложение работает без ошибок
- [ ] WalletConnect Project ID настроен
- [ ] Есть README с описанием проекта
- [ ] Адрес кошелька билдера подготовлен
- [ ] Медиа материалы готовы (иконки, скриншоты)

---

## 🔗 Полезные ссылки:

- Base Builders: https://base.org/builders
- Base Docs: https://docs.base.org
- Base Discord: https://discord.gg/buildonbase
- Base Twitter: https://twitter.com/base
- Basescan: https://basescan.org

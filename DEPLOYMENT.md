# 🚀 Деплой смарт-контрактов

## Подготовка

### 1. Получите тестовые ETH для Base Sepolia

Ваш адрес кошелька: `0x47550e121654FED9Bc17ed2f684E902a4B1fF102`

**Способ 1: Coinbase Faucet (Рекомендуется)**
1. Перейдите: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet
2. Подключите кошелек или введите адрес: `0x47550e121654FED9Bc17ed2f684E902a4B1fF102`
3. Получите 0.05 ETH на Base Sepolia

**Способ 2: Base Sepolia Faucet**
1. Получите Sepolia ETH: https://sepoliafaucet.com
2. Bridge на Base Sepolia: https://bridge.base.org

### 2. Экспортируйте Private Key из MetaMask

⚠️ **ВАЖНО**: Private key - это секрет! Никому не показывайте!

1. Откройте MetaMask
2. Нажмите на три точки → Account Details
3. Export Private Key
4. Введите пароль MetaMask
5. Скопируйте private key (БЕЗ префикса 0x)

### 3. Создайте файл .env

```bash
cp .env.example .env
```

Откройте `.env` и вставьте ваш private key:

```env
PRIVATE_KEY=ваш_приватный_ключ_без_0x
```

**Проверьте что .env добавлен в .gitignore!** (Уже сделано)

---

## 🎯 Деплой

### На Base Sepolia (Testnet)

```bash
npx hardhat run scripts/deploy.js --network baseSepolia
```

### На Base Mainnet (Production)

⚠️ **Требует реальных ETH на Base!**

```bash
npx hardhat run scripts/deploy.js --network base
```

---

## 📝 После деплоя

Скрипт автоматически:
- ✅ Задеплоит оба контракта
- ✅ Подождет подтверждений
- ✅ Сохранит адреса в `deployments/baseSepolia-addresses.json`
- ✅ Верифицирует контракты на Basescan

### Результат

Вы получите файл `deployments/baseSepolia-addresses.json`:

```json
{
  "network": "baseSepolia",
  "chainId": 84532,
  "BasingCounter": "0x...",
  "BasingNFT": "0x...",
  "deployer": "0x47550e121654FED9Bc17ed2f684E902a4B1fF102",
  "timestamp": "2026-01-18T..."
}
```

### Проверка контрактов

Base Sepolia Explorer: https://sepolia.basescan.org

Введите адрес контракта для просмотра.

---

## 🔧 Дополнительные команды

### Компиляция контрактов

```bash
npx hardhat compile
```

### Ручная верификация (если автоматическая не сработала)

```bash
npx hardhat verify --network baseSepolia CONTRACT_ADDRESS
```

Для NFT контракта (с аргументом конструктора):

```bash
npx hardhat verify --network baseSepolia NFT_ADDRESS "COUNTER_ADDRESS"
```

### Проверка баланса

```bash
npx hardhat run scripts/check-balance.js --network baseSepolia
```

---

## ⚠️ Troubleshooting

### "Insufficient funds"
- Получите больше тестовых ETH через faucet
- Проверьте баланс: https://sepolia.basescan.org/address/0x47550e121654FED9Bc17ed2f684E902a4B1fF102

### "Invalid private key"
- Убедитесь что private key БЕЗ префикса 0x
- Проверьте что .env файл создан и содержит правильный ключ

### "Nonce too high"
- Сбросьте транзакции в MetaMask: Settings → Advanced → Clear activity tab data

### Verification failed
- Подождите 1-2 минуты после деплоя
- Запустите ручную верификацию (команда выше)

---

## 📊 Gas costs (приблизительно)

Base Sepolia:
- BasingCounter deploy: ~0.001 ETH
- BasingNFT deploy: ~0.002 ETH
- **Всего: ~0.003 ETH**

Base Mainnet (примерно):
- BasingCounter deploy: ~$0.50
- BasingNFT deploy: ~$1.00
- **Всего: ~$1.50**

---

## ✅ Готово!

После успешного деплоя:
1. Скопируйте адреса контрактов из `deployments/baseSepolia-addresses.json`
2. Я интегрирую их в приложение
3. Приложение сможет записывать клики on-chain!

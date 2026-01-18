# WalletConnect Project ID Setup

Для корректной работы RainbowKit нужен **WalletConnect Cloud Project ID**.

## 🚀 Как получить Project ID (2 минуты):

1. Перейдите на https://cloud.walletconnect.com/sign-in
2. Зарегистрируйтесь через GitHub (или email)
3. Нажмите **"Create New Project"**
4. Заполните:
   - **Project Name**: `Still Basing`
   - **Description**: `On-chain achievement app on Base`
5. Нажмите **"Create"**
6. Скопируйте **Project ID** (выглядит как `abc123def456...`)

## ✏️ Как добавить в проект:

После получения Project ID обновите файл `src/wagmi.js`:

```javascript
export const config = getDefaultConfig({
  appName: 'Still Basing',
  projectId: 'ВАШ_PROJECT_ID_СЮДА', // <-- Вставьте сюда
  chains: [baseSepolia, base],
  ssr: false,
})
```

## 📝 Зачем это нужно?

WalletConnect Project ID:
- Позволяет пользователям подключать мобильные кошельки (MetaMask Mobile, Trust Wallet, Coinbase Wallet)
- Бесплатный для небольших проектов (до 1M requests/month)
- Необходим для корректной работы RainbowKit

## 🔗 Полезные ссылки:

- WalletConnect Cloud: https://cloud.walletconnect.com
- RainbowKit Docs: https://rainbowkit.com/docs/installation

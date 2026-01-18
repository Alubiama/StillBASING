# Still Basing Smart Contracts

Два смарт-контракта для Base сети:

## 📜 Контракты

### 1. BasingCounter.sol
Контракт для отслеживания кликов пользователей:
- Записывает количество кликов каждого пользователя on-chain
- Подсчитывает общее количество кликов
- Отслеживает достижения (10, 50, 100, 500, 1000 кликов)
- Генерирует события при разблокировке достижений

### 2. BasingNFT.sol
NFT контракт для выдачи достижений:
- Минтит уникальные NFT за достижения
- ERC-721 стандарт
- Интегрируется с BasingCounter
- Разные NFT для каждого уровня достижения

## 🚀 Деплой на Base Sepolia (Testnet)

### Вариант 1: Remix IDE (Самый простой)

1. Установите MetaMask и добавьте Base Sepolia сеть:
   - Network Name: `Base Sepolia`
   - RPC URL: `https://sepolia.base.org`
   - Chain ID: `84532`
   - Currency: `ETH`
   - Block Explorer: `https://sepolia.basescan.org`

2. Получите тестовые ETH:
   - Base Sepolia Faucet: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet
   - Или Sepolia ETH faucet + bridge на Base Sepolia

3. Откройте Remix: https://remix.ethereum.org

4. Создайте новые файлы и скопируйте контракты:
   - `BasingCounter.sol`
   - `BasingNFT.sol`

5. Установите компилятор Solidity 0.8.20+

6. Для `BasingNFT.sol` установите зависимость OpenZeppelin:
   - В Remix перейдите в "File Explorer"
   - Создайте `.deps/npm/@openzeppelin/contracts` или импорт автоматически подтянет библиотеки

7. Скомпилируйте контракты

8. Деплой:
   - **Сначала** задеплойте `BasingCounter.sol`
   - Скопируйте адрес задеплоенного BasingCounter
   - **Затем** задеплойте `BasingNFT.sol`, передав адрес BasingCounter в конструктор

9. Сохраните адреса контрактов!

### Вариант 2: Hardhat (Для продвинутых)

1. Установите Hardhat:
\`\`\`bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npx hardhat init
\`\`\`

2. Установите OpenZeppelin:
\`\`\`bash
npm install @openzeppelin/contracts
\`\`\`

3. Создайте `hardhat.config.js`:
\`\`\`javascript
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.20",
  networks: {
    baseSepolia: {
      url: "https://sepolia.base.org",
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
\`\`\`

4. Создайте скрипт деплоя `scripts/deploy.js`:
\`\`\`javascript
async function main() {
  // Деплой BasingCounter
  const BasingCounter = await ethers.getContractFactory("BasingCounter");
  const counter = await BasingCounter.deploy();
  await counter.waitForDeployment();
  console.log("BasingCounter deployed to:", await counter.getAddress());

  // Деплой BasingNFT
  const BasingNFT = await ethers.getContractFactory("BasingNFT");
  const nft = await BasingNFT.deploy(await counter.getAddress());
  await nft.waitForDeployment();
  console.log("BasingNFT deployed to:", await nft.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
\`\`\`

5. Деплой:
\`\`\`bash
npx hardhat run scripts/deploy.js --network baseSepolia
\`\`\`

## 📝 После деплоя

1. Сохраните адреса контрактов
2. Обновите `src/contracts/addresses.js` в приложении
3. Создайте ABI файлы для фронтенда

## 🔗 Полезные ссылки

- Base Docs: https://docs.base.org
- Base Sepolia Explorer: https://sepolia.basescan.org
- Remix IDE: https://remix.ethereum.org
- OpenZeppelin Docs: https://docs.openzeppelin.com

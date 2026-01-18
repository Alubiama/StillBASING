const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("💼 Account Information");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Network:", hre.network.name);
  console.log("Chain ID:", hre.network.config.chainId);
  console.log("Address:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Balance:", hre.ethers.formatEther(balance), "ETH");

  const balanceFloat = parseFloat(hre.ethers.formatEther(balance));

  if (balanceFloat === 0) {
    console.log("\n⚠️  Balance is 0! You need testnet ETH to deploy.");
    console.log("Get testnet ETH from:");
    console.log("- https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet");
  } else if (balanceFloat < 0.01) {
    console.log("\n⚠️  Low balance! You may need more ETH for deployment.");
  } else {
    console.log("\n✅ Balance is sufficient for deployment!");
  }

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

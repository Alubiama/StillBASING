const hre = require("hardhat");

async function main() {
  console.log("🚀 Starting deployment to", hre.network.name);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH\n");

  // Deploy BasingCounter
  console.log("📜 Deploying BasingCounter...");
  const BasingCounter = await hre.ethers.getContractFactory("BasingCounter");
  const counter = await BasingCounter.deploy();
  await counter.waitForDeployment();
  const counterAddress = await counter.getAddress();

  console.log("✅ BasingCounter deployed to:", counterAddress);
  console.log("");

  // Deploy BasingNFT
  console.log("🎨 Deploying BasingNFT...");
  const BasingNFT = await hre.ethers.getContractFactory("BasingNFT");
  const nft = await BasingNFT.deploy(counterAddress);
  await nft.waitForDeployment();
  const nftAddress = await nft.getAddress();

  console.log("✅ BasingNFT deployed to:", nftAddress);
  console.log("");

  // Wait for block confirmations
  console.log("⏳ Waiting for block confirmations...");
  await counter.deploymentTransaction().wait(5);
  await nft.deploymentTransaction().wait(5);
  console.log("✅ Confirmations completed\n");

  // Summary
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🎉 Deployment Summary");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Network:", hre.network.name);
  console.log("BasingCounter:", counterAddress);
  console.log("BasingNFT:", nftAddress);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // Save addresses to file
  const fs = require("fs");
  const addresses = {
    network: hre.network.name,
    chainId: hre.network.config.chainId,
    BasingCounter: counterAddress,
    BasingNFT: nftAddress,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
  };

  const addressesPath = `./deployments/${hre.network.name}-addresses.json`;
  fs.mkdirSync("./deployments", { recursive: true });
  fs.writeFileSync(addressesPath, JSON.stringify(addresses, null, 2));
  console.log("📄 Addresses saved to:", addressesPath);

  // Verify contracts (optional)
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("\n⏳ Waiting before verification...");
    await new Promise((resolve) => setTimeout(resolve, 30000)); // Wait 30s

    console.log("\n🔍 Verifying contracts on Basescan...");

    try {
      await hre.run("verify:verify", {
        address: counterAddress,
        constructorArguments: [],
      });
      console.log("✅ BasingCounter verified");
    } catch (error) {
      console.log("⚠️ BasingCounter verification failed:", error.message);
    }

    try {
      await hre.run("verify:verify", {
        address: nftAddress,
        constructorArguments: [counterAddress],
      });
      console.log("✅ BasingNFT verified");
    } catch (error) {
      console.log("⚠️ BasingNFT verification failed:", error.message);
    }
  }

  console.log("\n✨ Deployment complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

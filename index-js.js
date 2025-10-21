import {
  createWalletClient,
  custom,
  createPublicClient,
  parseEther,
  defineChain,
  formatEther,
} from "https://esm.sh/viem";
import { contractAddress, abi } from "./constants-js.js";

const connectBtn = document.getElementById("connectBtn");
const buyCoffeeBtn = document.getElementById("buyCoffeeBtn");
const getBalanceBtn = document.getElementById("getBalanceBtn");
const withdrawBtn = document.getElementById("withdrawBtn");
const inputEthAmount = document.getElementById("inputEthAmount");
const addressToAmountBtn = document.getElementById("addressToAmountBtn");

let walletClient;
let publicClient;

async function connect() {
  if (typeof window.ethereum === "undefined") {
    connectBtn.innerHTML = "Please install MetaMask!";
    return;
  }
  console.log("Connecting to wallet...");

  try {
    walletClient = createWalletClient({
      transport: custom(window.ethereum),
    });

    await walletClient.requestAddresses();

    connectBtn.innerHTML = "Connected!";
  } catch (error) {
    console.log(error);
  }
}

async function buyCoffee() {
  // Check if MetaMask is installed
  if (typeof window.ethereum === "undefined") {
    connectBtn.innerHTML = "Please install MetaMask!";
    return;
  }
  try {
    console.log("Buying a coffee...");

    // Get the ETH amount from the input field
    const ethAmount = inputEthAmount.value;
    console.log(`Amount entered: ${ethAmount} ETH`);

    // Initialize walletClient
    walletClient = createWalletClient({
      transport: custom(window.ethereum),
    });

    const [account] = await walletClient.requestAddresses();
    const currentChain = await getCurrentChain(walletClient);

    // Initialize publicClient
    publicClient = createPublicClient({
      transport: custom(window.ethereum),
    });

    //We are simulating the transaction here, to test it before sending it for real
    const { request } = await publicClient.simulateContract({
      address: contractAddress,
      abi,
      functionName: "fund",
      account,
      chain: currentChain,
      value: parseEther(ethAmount),
    });
    console.log(request);

    // Send the transaction
    const txHash = await walletClient.writeContract(request);
    console.log(`Transaction hash: ${txHash}`);
  } catch (error) {
    console.log(error);
  }
}

async function getBalance() {
  if (typeof window.ethereum === "undefined") {
    connectBtn.innerHTML = "Please install MetaMask!";
    return;
  }

  try {
    console.log("Getting balance...");

    // Initialize walletClient
    publicClient = createPublicClient({
      transport: custom(window.ethereum),
    });

    const balance = await publicClient.getBalance({
      address: contractAddress,
    });

    console.log(formatEther(balance));
  } catch (error) {
    console.log(error);
  }
}

async function withdraw() {
  if (typeof window.ethereum === "undefined") {
    connectBtn.innerHTML = "Please install MetaMask!";
    return;
  }
  console.log("Withdrawing funds...");

  try {
    // Initialize walletClient
    walletClient = createWalletClient({
      transport: custom(window.ethereum),
    });

    const [account] = await walletClient.requestAddresses();
    console.log(`Connected account: ${account}`);

    const currentChain = await getCurrentChain(walletClient);

    // Initialize publicClient
    publicClient = createPublicClient({
      transport: custom(window.ethereum),
      chain: currentChain,
    });

    // Get contract balance before withdrawal
    const contractBalance = await publicClient.getBalance({
      address: contractAddress,
    });
    console.log(
      `Contract balance before withdrawal: ${formatEther(contractBalance)} ETH`
    );

    // Simulate the withdrawal transaction
    const { request } = await publicClient.simulateContract({
      address: contractAddress,
      abi,
      functionName: "withdraw",
      account,
      chain: currentChain,
    });
    console.log("Simulation successful:", request);

    // Send the withdrawal transaction
    const txHash = await walletClient.writeContract(request);
    console.log(`Withdrawal transaction hash: ${txHash}`);

    alert(`Withdrawal transaction sent! Hash: ${txHash}`);

    // Wait for transaction receipt
    const receipt = await publicClient.waitForTransactionReceipt({
      hash: txHash,
    });
    console.log("Withdrawal confirmed:", receipt);

    // Get new contract balance
    const newContractBalance = await publicClient.getBalance({
      address: contractAddress,
    });
    console.log(
      `Contract balance after withdrawal: ${formatEther(
        newContractBalance
      )} ETH`
    );

    alert(
      `Withdrawal successful!\nWithdrawn: ${formatEther(contractBalance)} ETH`
    );
  } catch (error) {
    console.error("Withdrawal failed:", error);

    // Provide more specific error messages
    if (
      error.message.includes("NotOwner") ||
      error.message.includes("579610db")
    ) {
      alert("Withdrawal failed: Only the contract owner can withdraw funds!");
    } else if (error.message.includes("rejected")) {
      alert("Transaction rejected by user");
    } else {
      alert(`Withdrawal failed: ${error.message}`);
    }
  }
}

async function addressToAmount() {
  // Get the connected wallet address
  const [account] = await walletClient.requestAddresses();

  // Read from the contract (no transaction needed, just reading data)
  const amountFunded = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "getAddressToAmountFunded",
    args: [account], // Pass the connected address
  });

  // Log the result
  console.log(`Amount funded by ${account}: ${formatEther(amountFunded)} ETH`);
}

async function getCurrentChain(client) {
  const chainId = await client.getChainId();
  const currentChain = defineChain({
    id: chainId,
    name: "Custom Chain",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ["http://localhost:8545"],
      },
    },
  });
  return currentChain;
}

connectBtn.onclick = connect;
buyCoffeeBtn.onclick = buyCoffee;
getBalanceBtn.onclick = getBalance;
withdrawBtn.onclick = withdraw;
addressToAmountBtn.onclick = addressToAmount;

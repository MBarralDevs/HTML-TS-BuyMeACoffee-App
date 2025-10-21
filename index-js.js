import {
  createWalletClient,
  custom,
  createPublicClient,
  parseEther,
  defineChain,
} from "https://esm.sh/viem";
import { contractAddress, abi } from "./constants-js.js";

const connectBtn = document.getElementById("connectBtn");
const buyCoffeeBtn = document.getElementById("buyCoffeeBtn");
const getBalanceBtn = document.getElementById("getBalanceBtn");
const withdrawBtn = document.getElementById("withdrawBtn");
const inputEthAmount = document.getElementById("inputEthAmount");

let walletClient;
let publicClient;

async function connect() {
  if (typeof window.ethereum === "undefined") {
    connectBtn.innerHTML = "Please install MetaMask!";
    return;
  }
  console.log("Connecting to wallet...");

  walletClient = createWalletClient({
    transport: custom(window.ethereum),
  });

  await walletClient.requestAddresses();

  connectBtn.innerHTML = "Connected!";
}

async function buyCoffee() {
  // Check if MetaMask is installed
  if (typeof window.ethereum === "undefined") {
    connectBtn.innerHTML = "Please install MetaMask!";
    return;
  }
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
}

function getBalance() {
  if (typeof window.ethereum === "undefined") {
    connectBtn.innerHTML = "Please install MetaMask!";
    return;
  }
  console.log("Getting balance...");
  // Add get balance logic here
}

function withdraw() {
  if (typeof window.ethereum === "undefined") {
    connectBtn.innerHTML = "Please install MetaMask!";
    return;
  }
  console.log("Withdrawing funds...");
  // Add withdraw logic here
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

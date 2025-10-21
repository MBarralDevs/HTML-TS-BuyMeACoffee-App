import { createWalletClient, custom } from "https://esm.sh/viem";

const connectBtn = document.getElementById("connectBtn");
const buyCoffeeBtn = document.getElementById("buyCoffeeBtn");
const getBalanceBtn = document.getElementById("getBalanceBtn");
const withdrawBtn = document.getElementById("withdrawBtn");

let walletClient;

async function connect() {
  if (typeof window.ethereum === "undefined") {
    connectBtn.innerHTML = "Please install MetaMask!";
    return;
  }
  console.log("Connecting to wallet...");

  walletClient = createWalletClient({
    transport: custom(window.ethereum),
    //chain: { id: 1 }, // Mainnet
  });

  await walletClient.requestAddresses();

  connectBtn.innerHTML = "Connected!";
}

function buyCoffee() {
  if (typeof window.ethereum === "undefined") {
    connectBtn.innerHTML = "Please install MetaMask!";
    return;
  }
  console.log("Buying a coffee...");
  // Add buy coffee logic here
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

connectBtn.onclick = connect;
buyCoffeeBtn.onclick = buyCoffee;
getBalanceBtn.onclick = getBalance;
withdrawBtn.onclick = withdraw;

import {
  createWalletClient,
  custom,
  createPublicClient,
} from "https://esm.sh/viem";

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

  await walletClient.requestAddresses();

  // Initialize publicClient
  publicClient = createPublicClient({
    transport: custom(window.ethereum),
  });

  //
  /*const {request} = await publicClient.simulateTransaction({
    address:
})*/
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

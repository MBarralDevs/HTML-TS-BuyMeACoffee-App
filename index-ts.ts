import {
  createWalletClient,
  custom,
  createPublicClient,
  parseEther,
  defineChain,
  formatEther,
  WalletClient,
  PublicClient,
  Chain,
  Transport,
  Hash,
} from "viem";
import { contractAddress, abi } from "./constants-ts";

// DOM Elements
const connectBtn = document.getElementById("connectBtn") as HTMLButtonElement;
const buyCoffeeBtn = document.getElementById("buyCoffeeBtn") as HTMLButtonElement;
const getBalanceBtn = document.getElementById("getBalanceBtn") as HTMLButtonElement;
const withdrawBtn = document.getElementById("withdrawBtn") as HTMLButtonElement;
const inputEthAmount = document.getElementById("inputEthAmount") as HTMLInputElement;

// Global clients
let walletClient: WalletClient | undefined;
let publicClient: PublicClient | undefined;

// Type guard for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

async function connect(): Promise<void> {
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
    console.error("Connection error:", error);
  }
}

async function buyCoffee(): Promise<void> {
  // Check if MetaMask is installed
  if (typeof window.ethereum === "undefined") {
    connectBtn.innerHTML = "Please install MetaMask!";
    return;
  }
  
  try {
    console.log("Buying a coffee...");

    // Get the ETH amount from the input field
    const ethAmount: string = inputEthAmount.value;
    
    if (!ethAmount || parseFloat(ethAmount) <= 0) {
      alert("Please enter a valid ETH amount");
      return;
    }
    
    console.log(`Amount entered: ${ethAmount} ETH`);

    // Initialize walletClient
    walletClient = createWalletClient({
      transport: custom(window.ethereum),
    });

    const [account] = await walletClient.requestAddresses();
    const currentChain: Chain = await getCurrentChain(walletClient);

    // Initialize publicClient
    publicClient = createPublicClient({
      transport: custom(window.ethereum),
      chain: currentChain,
    });

    // We are simulating the transaction here, to test it before sending it for real
    const { request } = await publicClient.simulateContract({
      address: contractAddress as `0x${string}`,
      abi,
      functionName: "fund",
      account,
      chain: currentChain,
      value: parseEther(ethAmount),
    });
    console.log("Simulation successful:", request);

    // Send the transaction
    const txHash: Hash = await walletClient.writeContract(request);
    console.log(`Transaction hash: ${txHash}`);
    
    alert(`Transaction sent! Hash: ${txHash}`);
    
    // Wait for transaction receipt
    const receipt = await publicClient.waitForTransactionReceipt({ 
      hash: txHash 
    });
    console.log("Transaction confirmed:", receipt);
    alert("Coffee purchased successfully!");
    
  } catch (error) {
    console.error("Transaction error:", error);
    if (error instanceof Error) {
      alert(`Transaction failed: ${error.message}`);
    }
  }
}

async function getBalance(): Promise<void> {
  if (typeof window.ethereum === "undefined") {
    connectBtn.innerHTML = "Please install MetaMask!";
    return;
  }

  try {
    console.log("Getting balance...");

    // Initialize walletClient if not already done
    if (!walletClient) {
      walletClient = createWalletClient({
        transport: custom(window.ethereum),
      });
    }
    
    const currentChain: Chain = await getCurrentChain(walletClient);

    // Initialize publicClient
    publicClient = createPublicClient({
      transport: custom(window.ethereum),
      chain: currentChain,
    });

    const [account] = await walletClient.requestAddresses();

    // Get contract balance
    const contractBalance: bigint = await publicClient.getBalance({
      address: contractAddress as `0x${string}`,
    });
    console.log(`Contract balance: ${formatEther(contractBalance)} ETH`);

    // Get user's funded amount
    const fundedAmount = await publicClient.readContract({
      address: contractAddress as `0x${string}`,
      abi,
      functionName: "getAddressToAmountFunded",
      args: [account],
    }) as bigint;

    console.log(`Your funded amount: ${formatEther(fundedAmount)} ETH`);
    alert(
      `Contract balance: ${formatEther(contractBalance)} ETH\nYour funded amount: ${formatEther(fundedAmount)} ETH`
    );
    
  } catch (error) {
    console.error("Get balance error:", error);
    if (error instanceof Error) {
      alert(`Error: ${error.message}`);
    }
  }
}

async function withdraw(): Promise<void> {
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

    const currentChain: Chain = await getCurrentChain(walletClient);

    // Initialize publicClient
    publicClient = createPublicClient({
      transport: custom(window.ethereum),
      chain: currentChain,
    });

    // Get contract balance before withdrawal
    const contractBalance: bigint = await publicClient.getBalance({
      address: contractAddress as `0x${string}`,
    });
    console.log(
      `Contract balance before withdrawal: ${formatEther(contractBalance)} ETH`
    );

    // Simulate the withdrawal transaction
    const { request } = await publicClient.simulateContract({
      address: contractAddress as `0x${string}`,
      abi,
      functionName: "withdraw",
      account,
      chain: currentChain,
    });
    console.log("Simulation successful:", request);

    // Send the withdrawal transaction
    const txHash: Hash = await walletClient.writeContract(request);
    console.log(`Withdrawal transaction hash: ${txHash}`);

    alert(`Withdrawal transaction sent! Hash: ${txHash}`);

    // Wait for transaction receipt
    const receipt = await publicClient.waitForTransactionReceipt({
      hash: txHash,
    });
    console.log("Withdrawal confirmed:", receipt);

    // Get new contract balance
    const newContractBalance: bigint = await publicClient.getBalance({
      address: contractAddress as `0x${string}`,
    });
    console.log(
      `Contract balance after withdrawal: ${formatEther(newContractBalance)} ETH`
    );

    alert(
      `Withdrawal successful!\nWithdrawn: ${formatEther(contractBalance)} ETH`
    );
  } catch (error) {
    console.error("Withdrawal failed:", error);

    // Provide more specific error messages
    if (error instanceof Error) {
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
}

async function getCurrentChain(client: WalletClient): Promise<Chain> {
  const chainId: number = await client.getChainId();
  const currentChain: Chain = defineChain({
    id: chainId,
    name: "Anvil Local",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ["http://127.0.0.1:8545"],
      },
    },
  });
  return currentChain;
}

// Event listeners
connectBtn.onclick = connect;
buyCoffeeBtn.onclick = buyCoffee;
getBalanceBtn.onclick = getBalance;
withdrawBtn.onclick = withdraw;
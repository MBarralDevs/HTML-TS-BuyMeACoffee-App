"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var viem_1 = require("viem");
var constants_ts_1 = require("./constants-ts");
// DOM Elements
var connectBtn = document.getElementById("connectBtn");
var buyCoffeeBtn = document.getElementById("buyCoffeeBtn");
var getBalanceBtn = document.getElementById("getBalanceBtn");
var withdrawBtn = document.getElementById("withdrawBtn");
var inputEthAmount = document.getElementById("inputEthAmount");
// Global clients
var walletClient;
var publicClient;
function connect() {
    return __awaiter(this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (typeof window.ethereum === "undefined") {
                        connectBtn.innerHTML = "Please install MetaMask!";
                        return [2 /*return*/];
                    }
                    console.log("Connecting to wallet...");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    walletClient = (0, viem_1.createWalletClient)({
                        transport: (0, viem_1.custom)(window.ethereum),
                    });
                    return [4 /*yield*/, walletClient.requestAddresses()];
                case 2:
                    _a.sent();
                    connectBtn.innerHTML = "Connected!";
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error("Connection error:", error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function buyCoffee() {
    return __awaiter(this, void 0, void 0, function () {
        var ethAmount, account, currentChain, request, txHash, receipt, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Check if MetaMask is installed
                    if (typeof window.ethereum === "undefined") {
                        connectBtn.innerHTML = "Please install MetaMask!";
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, , 8]);
                    console.log("Buying a coffee...");
                    ethAmount = inputEthAmount.value;
                    if (!ethAmount || parseFloat(ethAmount) <= 0) {
                        alert("Please enter a valid ETH amount");
                        return [2 /*return*/];
                    }
                    console.log("Amount entered: ".concat(ethAmount, " ETH"));
                    // Initialize walletClient
                    walletClient = (0, viem_1.createWalletClient)({
                        transport: (0, viem_1.custom)(window.ethereum),
                    });
                    return [4 /*yield*/, walletClient.requestAddresses()];
                case 2:
                    account = (_a.sent())[0];
                    return [4 /*yield*/, getCurrentChain(walletClient)];
                case 3:
                    currentChain = _a.sent();
                    // Initialize publicClient
                    publicClient = (0, viem_1.createPublicClient)({
                        transport: (0, viem_1.custom)(window.ethereum),
                        chain: currentChain,
                    });
                    return [4 /*yield*/, publicClient.simulateContract({
                            address: constants_ts_1.contractAddress,
                            abi: constants_ts_1.abi,
                            functionName: "fund",
                            account: account,
                            chain: currentChain,
                            value: (0, viem_1.parseEther)(ethAmount),
                        })];
                case 4:
                    request = (_a.sent()).request;
                    console.log("Simulation successful:", request);
                    return [4 /*yield*/, walletClient.writeContract(request)];
                case 5:
                    txHash = _a.sent();
                    console.log("Transaction hash: ".concat(txHash));
                    alert("Transaction sent! Hash: ".concat(txHash));
                    return [4 /*yield*/, publicClient.waitForTransactionReceipt({
                            hash: txHash
                        })];
                case 6:
                    receipt = _a.sent();
                    console.log("Transaction confirmed:", receipt);
                    alert("Coffee purchased successfully!");
                    return [3 /*break*/, 8];
                case 7:
                    error_2 = _a.sent();
                    console.error("Transaction error:", error_2);
                    if (error_2 instanceof Error) {
                        alert("Transaction failed: ".concat(error_2.message));
                    }
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
function getBalance() {
    return __awaiter(this, void 0, void 0, function () {
        var currentChain, account, contractBalance, fundedAmount, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (typeof window.ethereum === "undefined") {
                        connectBtn.innerHTML = "Please install MetaMask!";
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    console.log("Getting balance...");
                    // Initialize walletClient if not already done
                    if (!walletClient) {
                        walletClient = (0, viem_1.createWalletClient)({
                            transport: (0, viem_1.custom)(window.ethereum),
                        });
                    }
                    return [4 /*yield*/, getCurrentChain(walletClient)];
                case 2:
                    currentChain = _a.sent();
                    // Initialize publicClient
                    publicClient = (0, viem_1.createPublicClient)({
                        transport: (0, viem_1.custom)(window.ethereum),
                        chain: currentChain,
                    });
                    return [4 /*yield*/, walletClient.requestAddresses()];
                case 3:
                    account = (_a.sent())[0];
                    return [4 /*yield*/, publicClient.getBalance({
                            address: constants_ts_1.contractAddress,
                        })];
                case 4:
                    contractBalance = _a.sent();
                    console.log("Contract balance: ".concat((0, viem_1.formatEther)(contractBalance), " ETH"));
                    return [4 /*yield*/, publicClient.readContract({
                            address: constants_ts_1.contractAddress,
                            abi: constants_ts_1.abi,
                            functionName: "getAddressToAmountFunded",
                            args: [account],
                        })];
                case 5:
                    fundedAmount = _a.sent();
                    console.log("Your funded amount: ".concat((0, viem_1.formatEther)(fundedAmount), " ETH"));
                    alert("Contract balance: ".concat((0, viem_1.formatEther)(contractBalance), " ETH\nYour funded amount: ").concat((0, viem_1.formatEther)(fundedAmount), " ETH"));
                    return [3 /*break*/, 7];
                case 6:
                    error_3 = _a.sent();
                    console.error("Get balance error:", error_3);
                    if (error_3 instanceof Error) {
                        alert("Error: ".concat(error_3.message));
                    }
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function withdraw() {
    return __awaiter(this, void 0, void 0, function () {
        var account, currentChain, contractBalance, request, txHash, receipt, newContractBalance, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (typeof window.ethereum === "undefined") {
                        connectBtn.innerHTML = "Please install MetaMask!";
                        return [2 /*return*/];
                    }
                    console.log("Withdrawing funds...");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 9, , 10]);
                    // Initialize walletClient
                    walletClient = (0, viem_1.createWalletClient)({
                        transport: (0, viem_1.custom)(window.ethereum),
                    });
                    return [4 /*yield*/, walletClient.requestAddresses()];
                case 2:
                    account = (_a.sent())[0];
                    console.log("Connected account: ".concat(account));
                    return [4 /*yield*/, getCurrentChain(walletClient)];
                case 3:
                    currentChain = _a.sent();
                    // Initialize publicClient
                    publicClient = (0, viem_1.createPublicClient)({
                        transport: (0, viem_1.custom)(window.ethereum),
                        chain: currentChain,
                    });
                    return [4 /*yield*/, publicClient.getBalance({
                            address: constants_ts_1.contractAddress,
                        })];
                case 4:
                    contractBalance = _a.sent();
                    console.log("Contract balance before withdrawal: ".concat((0, viem_1.formatEther)(contractBalance), " ETH"));
                    return [4 /*yield*/, publicClient.simulateContract({
                            address: constants_ts_1.contractAddress,
                            abi: constants_ts_1.abi,
                            functionName: "withdraw",
                            account: account,
                            chain: currentChain,
                        })];
                case 5:
                    request = (_a.sent()).request;
                    console.log("Simulation successful:", request);
                    return [4 /*yield*/, walletClient.writeContract(request)];
                case 6:
                    txHash = _a.sent();
                    console.log("Withdrawal transaction hash: ".concat(txHash));
                    alert("Withdrawal transaction sent! Hash: ".concat(txHash));
                    return [4 /*yield*/, publicClient.waitForTransactionReceipt({
                            hash: txHash,
                        })];
                case 7:
                    receipt = _a.sent();
                    console.log("Withdrawal confirmed:", receipt);
                    return [4 /*yield*/, publicClient.getBalance({
                            address: constants_ts_1.contractAddress,
                        })];
                case 8:
                    newContractBalance = _a.sent();
                    console.log("Contract balance after withdrawal: ".concat((0, viem_1.formatEther)(newContractBalance), " ETH"));
                    alert("Withdrawal successful!\nWithdrawn: ".concat((0, viem_1.formatEther)(contractBalance), " ETH"));
                    return [3 /*break*/, 10];
                case 9:
                    error_4 = _a.sent();
                    console.error("Withdrawal failed:", error_4);
                    // Provide more specific error messages
                    if (error_4 instanceof Error) {
                        if (error_4.message.includes("NotOwner") ||
                            error_4.message.includes("579610db")) {
                            alert("Withdrawal failed: Only the contract owner can withdraw funds!");
                        }
                        else if (error_4.message.includes("rejected")) {
                            alert("Transaction rejected by user");
                        }
                        else {
                            alert("Withdrawal failed: ".concat(error_4.message));
                        }
                    }
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    });
}
function getCurrentChain(client) {
    return __awaiter(this, void 0, void 0, function () {
        var chainId, currentChain;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client.getChainId()];
                case 1:
                    chainId = _a.sent();
                    currentChain = (0, viem_1.defineChain)({
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
                    return [2 /*return*/, currentChain];
            }
        });
    });
}
// Event listeners
connectBtn.onclick = connect;
buyCoffeeBtn.onclick = buyCoffee;
getBalanceBtn.onclick = getBalance;
withdrawBtn.onclick = withdraw;

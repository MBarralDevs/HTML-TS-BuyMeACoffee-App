const connectBtn = document.getElementById("connectBtn");
const buyCoffeeBtn = document.getElementById("buyCoffeeBtn");
const getBalanceBtn = document.getElementById("getBalanceBtn");
const withdrawBtn = document.getElementById("withdrawBtn");

function connect() {
  console.log("Connecting to wallet...");
  // Add wallet connection logic here
}

function buyCoffee() {
  console.log("Buying a coffee...");
  // Add buy coffee logic here
}

function getBalance() {
  console.log("Getting balance...");
  // Add get balance logic here
}

function withdraw() {
  console.log("Withdrawing funds...");
  // Add withdraw logic here
}

connectBtn.onclick = connect;
buyCoffeeBtn.onclick = buyCoffee;
getBalanceBtn.onclick = getBalance;
withdrawBtn.onclick = withdraw;

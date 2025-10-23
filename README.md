# ☕ FundMe Coffee dApp

A simple decentralized application (dApp) that allows users to send ETH (buy coffee) to a smart contract and enables the contract owner to withdraw funds. Built with Solidity, TypeScript/JavaScript, and Viem.

## 📋 Overview

This project demonstrates basic Web3 interactions including:
- Connecting to MetaMask wallet
- Sending ETH transactions to a smart contract
- Reading contract state
- Owner-only withdrawal functionality
- Real-time balance checking

## 🛠️ Tech Stack

- **Smart Contract**: Solidity
- **Frontend**: HTML, CSS, Vanilla JavaScript/TypeScript
- **Web3 Library**: [Viem](https://viem.sh/) v2.38.3
- **Development Environment**: Anvil (Local Ethereum node)
- **Wallet**: MetaMask

## 📁 Project Structure

```
.
├── index.html              # Main HTML interface
├── index-js.js             # JavaScript implementation
├── index-ts.ts             # TypeScript implementation
├── index-ts.js             # Compiled TypeScript
├── constants-js.js         # Contract ABI and address (JS)
├── constants-ts.ts         # Contract ABI and address (TS)
├── fundme-anvil.json       # Anvil state snapshot
├── package.json            # Dependencies
└── tsconfig.json           # TypeScript configuration
```

## 🚀 Features

### User Functions
- **Connect Wallet**: Connect your MetaMask wallet to the dApp
- **Buy Coffee**: Send ETH to the contract (minimum 5 USD worth)
- **Get Balance**: View contract balance and your contribution
- **Address to Amount**: Check how much you've funded

### Owner Functions
- **Withdraw**: Contract owner can withdraw all funds

## 📝 Smart Contract Details

- **Contract Address**: `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512`
- **Network**: Anvil Local (chainId: 31337)
- **Minimum Funding**: 5 USD equivalent in ETH
- **Price Feed**: Uses Chainlink-style price aggregator at `0x5fbdb2315678afecb367f032d93f642f64180aa3`

### Key Functions

```solidity
fund()                              // Payable - Send ETH to contract
withdraw()                          // Owner only - Withdraw all funds
cheaperWithdraw()                   // Gas-optimized withdrawal
getAddressToAmountFunded(address)   // View user's contribution
getFunder(uint256)                  // Get funder by index
getBalance()                        // Get contract balance
```

## 🔧 Setup & Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd fundme-coffee-dapp
```

2. **Install dependencies**
```bash
npm install
```

3. **Start Anvil local node**
```bash
anvil
```

4. **Load the state snapshot** (optional)
```bash
anvil --state fundme-anvil.json
```

5. **Configure MetaMask**
   - Add Anvil network:
     - RPC URL: `http://127.0.0.1:8545`
     - Chain ID: `31337`
     - Currency: `ETH`
   - Import one of Anvil's test accounts using the private key

6. **Open the dApp**
   - Simply open `index.html` in your browser
   - Or use a local server:
   ```bash
   npx serve .
   ```

## 💻 Usage

### For JavaScript version:
The `index.html` is already configured to use the JavaScript implementation (`index-js.js`).

### For TypeScript version:
1. Compile TypeScript:
```bash
npx tsc
```

2. Update `index.html` to use TypeScript compiled output:
```html
<script src="./index-ts.js" type="module"></script>
```

### Interacting with the dApp

1. **Connect**: Click "Connect" to connect your MetaMask wallet
2. **Fund**: Enter an ETH amount and click "Buy Coffee"
3. **Check Balance**: Click "Get Balance" to see contract balance and your contribution
4. **Withdraw** (Owner only): Click "Withdraw" to retrieve all funds

## 📊 Transaction History

The project includes a successful deployment transaction:
- **Transaction Hash**: `0xdb6bf7d9d802856cf6e4e42cb0abddfa7396cebf4fd5fda5d08cc2d4ba39d71b`
- **Gas Used**: 102,412
- **Block Number**: 3
- **Block Hash**: `0x215e23af098de63ef0dbc29272b9ad08b70f12d7ccc75213640dd0cbef35d70f`

## 🔐 Security Notes

- This is a **development/learning project** - not audited for production
- The contract has an owner-only withdraw function using a custom error `FundMe__NotOwner`
- Always test on local networks before deploying to mainnet
- Never share your private keys or seed phrases

## 🎓 Learning Resources

This project demonstrates:
- Smart contract interaction with Viem
- MetaMask wallet connection
- Transaction simulation before execution
- Event handling in Web3
- TypeScript typing for Web3 development
- Contract state reading (view functions)
- Payable function calls

## 📄 License

This is an educational project. Feel free to use and modify for learning purposes.

## 🤝 Contributing

This is a learning project, but suggestions and improvements are welcome!

## 📞 Support

For issues or questions, please open an issue in the repository.

---

**Built with ☕ and Solidity**

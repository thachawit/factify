# Factify

Factify is a decentralized platform dedicated to ensuring authentic research is accessible to all. By leveraging technologies such as WorldCoin's unique ID and the Sign Protocol, Factify aims to reduce publication bias and connect all stakeholders—researchers, funders, and verifiers—with a token system that rewards ethical publishing.

## Overview

Factify is designed to bring various types of off-chain data, in the form of research documents, onto the blockchain for public use. The platform ensures that all research publications are verified and transparent, promoting a culture of trust and accountability in research.

### Core Features

- **Authentication with WorldCoin:** Leverages WorldCoin's unique ID system to authenticate researchers, verifiers, and other stakeholders.
- **Signing with Sign Protocol:** Uses schemas to sign documents and verify authenticity, reducing publication bias.
- **Decentralized Storage:** Research documents are stored in a secure, decentralized manner using Arweave.
- **Bias Scoring:** Automatically scores research papers for potential biases, making the scoring process transparent and trustworthy.
- **Reward System:** Future plans include a tokenomics model that rewards researchers and verifiers for ethical publishing.

## Tech Stack

- **Frontend:** Built with Next.js, Tailwind CSS, and Daisy UI.
- **Backend:** Developed in Go, utilizing Hexagonal Architecture, Resty, and Echo for client-side interactions.
- **Blockchain Interactions:** Uses Sign Protocol for attestation signing and WorldCoin for identity verification.
- **Storage:** Research documents are encoded in Base64 and stored on Arweave for permanent, decentralized storage.

## How It Works

1. **Authentication:** Users authenticate using WorldCoin's IDKit, ensuring that each participant is verified.
2. **Research Submission:** Researchers submit their work, which is then signed using the Sign Protocol, ensuring transparency and traceability.
3. **Verification:** Documents and data are stored on-chain with relevant signatures and bias scores.
4. **Decentralized Storage:** The research documents are encoded in Base64 and stored on Arweave, maintaining the integrity and accessibility of research data.

## Project Structure

```tree
app
├── blockexplorer
│ ├── \_components
│ │ ├── AddressCodeTab.tsx
│ │ ├── AddressComponent.tsx
│ │ ├── AddressLogsTab.tsx
│ │ ├── AddressStorageTab.tsx
│ │ ├── BackButton.tsx
│ │ ├── ContractTabs.tsx
│ │ ├── PaginationButton.tsx
│ │ ├── SearchBar.tsx
│ │ ├── TransactionHash.tsx
│ │ ├── TransactionsTable.tsx
│ │ └── index.tsx
│ ├── address
│ │ └── [address]
│ │ └── page.tsx
│ ├── layout.tsx
│ ├── page.tsx
│ └── transaction
│ ├── [txHash]
│ │ └── page.tsx
│ └── \_components
│ └── TransactionComp.tsx
├── debug
│ ├── \_components
│ │ ├── DebugContracts.tsx
│ │ └── contract
│ │ ├── ContractInput.tsx
│ │ ├── ContractReadMethods.tsx
│ │ ├── ContractUI.tsx
│ │ ├── ContractVariables.tsx
│ │ ├── ContractWriteMethods.tsx
│ │ ├── DisplayVariable.tsx
│ │ ├── InheritanceTooltip.tsx
│ │ ├── ReadOnlyFunctionForm.tsx
│ │ ├── Tuple.tsx
│ │ ├── TupleArray.tsx
│ │ ├── TxReceipt.tsx
│ │ ├── WriteOnlyFunctionForm.tsx
│ │ ├── index.tsx
│ │ ├── utilsContract.tsx
│ │ └── utilsDisplay.tsx
│ └── page.tsx
├── layout.tsx
├── page.tsx
└── research_verify
└── page.tsx

```

```tree
components
├── AttestationCard.tsx
├── AuthBeforeCreate.tsx
├── CreateAttestation.tsx
├── Footer.tsx
├── Header.tsx
├── QueryAttestation.tsx
├── QueryResearchAttestation.tsx
├── ScaffoldEthAppWithProviders.tsx
├── SignAttestation.tsx
├── SwitchTheme.tsx
├── ThemeProvider.tsx
├── WorldId.tsx
├── assets
│ └── BuidlGuidlLogo.tsx
├── createResearchAttestation.tsx
├── scaffold-eth
│ ├── Address.tsx
│ ├── Balance.tsx
│ ├── BlockieAvatar.tsx
│ ├── Faucet.tsx
│ ├── FaucetButton.tsx
│ ├── Input
│ │ ├── AddressInput.tsx
│ │ ├── Bytes32Input.tsx
│ │ ├── BytesInput.tsx
│ │ ├── EtherInput.tsx
│ │ ├── InputBase.tsx
│ │ ├── IntegerInput.tsx
│ │ ├── index.ts
│ │ └── utils.ts
│ ├── ProgressBar.tsx
│ ├── RainbowKitCustomConnectButton
│ │ ├── AddressInfoDropdown.tsx
│ │ ├── AddressQRCodeModal.tsx
│ │ ├── NetworkOptions.tsx
│ │ ├── WrongNetworkDropdown.tsx
│ │ └── index.tsx
│ └── index.tsx
└── sign-schema.tsx
```

### Key Components

- **`CreateAttestation.tsx`**: Handles the creation of attestations for researchers. Auto-generates unique researcher IDs and timestamps.
- **`createResearchAttestation.tsx`**: Dedicated to creating research-specific attestations with verification and data encoding.
- **`AuthBeforeCreate.tsx`**: Enforces authentication checks using WorldCoin's ID system before allowing attestation creation.
- **`Header.tsx`**: Includes navigation links to the home page and the research verification path.

## Getting Started

### Prerequisites

- **Node.js**: Ensure you have Node.js installed (recommended version >= 14).
- **Go**: Install Go for backend proof verification.
- **Docker**: Recommended for setting up the environment and dependencies.

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/factify.git
   cd factify
   Install dependencies:
   ```

2. **run frontend:**

   ```bash
   cd frontend
   yarn add i
   yarn start
   ```

3. **run backend**
   ```bash
   cd backend
   go mod tidy
   go run main.go
   ```

Usage
Authentication: Users need to authenticate using WorldCoin ID before creating research attestations.
Research Verification: Submit and verify research documents through the /research_verify path.
Future Plans
Tokenomics Integration: Introducing a reward system for ethical publishing.
Bias Scoring Improvements: Enhancing bias scoring models using AI.
Advanced Privacy Controls: Incorporating Gnosis Shutter network encryption for privacy-sensitive data.
Contributing
We welcome contributions from the community! Please read our Contributing Guide to get started.

License
This project is licensed under the MIT License. See the LICENSE file for details.

Contact
For questions or support, please reach out at support@factify.com.

Factify: Bringing unbiased and verified research to the world. 🌐

ETH_Global hackathon 2024

# ShieldLend Architecture

ShieldLend is a privacy-preserving lending risk prototype for Solana.

## Core Idea

Traditional on-chain lending exposes borrower risk data such as collateral value, debt amount, loan-to-value ratio, and health factor. This makes borrowers easy targets for liquidation bots.

ShieldLend keeps sensitive borrower data encrypted and uses Arcium-style encrypted computation to evaluate lending risk rules.

## Flow

1. A borrower creates a private lending position.
2. Collateral and debt values are encrypted client-side.
3. The encrypted values are submitted to the Arcium computation layer.
4. Arcium computes:
   - LTV
   - Health factor
   - Liquidation eligibility
   - Risk status
5. The Solana program receives or records only the minimal output:
   - Safe
   - Warning
   - Liquidatable

## Private Data

ShieldLend protects:

- Exact collateral value
- Exact debt value
- Exact LTV
- Exact health factor
- Distance to liquidation

## Public Data

The protocol may reveal:

- A position exists
- A private risk check was executed
- The final liquidation eligibility or risk state

## Arcium Role

Arcium is used as the encrypted computation layer. The encrypted instruction in `encrypted-ixs/risk_check.rs` describes how ShieldLend computes lending risk metrics without exposing the underlying borrower values.

## Current MVP

The current project includes:

- A live Next.js frontend demo
- A private risk simulation UI
- Arcium encrypted instruction design
- Solana Anchor program skeleton
- Documentation explaining how Arcium protects borrower privacy

## Future Work

- Compile and deploy the Anchor program
- Connect the frontend to a Solana wallet
- Encrypt inputs client-side
- Submit actual Arcium computations
- Store verified risk results on-chain
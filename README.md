# ShieldLend

ShieldLend is a privacy-preserving liquidation protection prototype for Solana lending using Arcium.

## Problem

Traditional on-chain lending exposes borrower collateral, borrowed amount, LTV, and health factor. This makes users vulnerable to predatory liquidation bots that monitor public risk data.

## Solution

ShieldLend keeps sensitive lending risk data private. Instead of revealing exact collateral, debt, LTV, or health factor on-chain, ShieldLend computes liquidation eligibility through encrypted computation and reveals only the minimum required result.

## How Arcium Is Used

Arcium is used as the encrypted computation layer for lending risk logic.

ShieldLend uses Arcium-style confidential computation to privately compute:

- Loan-to-value ratio
- Health factor
- Liquidation eligibility
- Borrow safety status

The encrypted instruction is located at:

```text
encrypted-ixs/risk_check.rs
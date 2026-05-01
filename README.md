# ShieldLend

ShieldLend is a privacy-preserving liquidation protection prototype for Solana lending using Arcium.

## Problem

Traditional on-chain lending exposes borrower collateral, borrowed amount, LTV, and health factor. This makes users vulnerable to predatory liquidation bots that monitor public risk data.

## Solution

ShieldLend keeps sensitive lending risk data private. Instead of revealing the exact collateral, debt, LTV, or health factor on-chain, the protocol computes liquidation eligibility through encrypted computation and reveals only the minimum required result.

## How Arcium Is Used

Arcium is used as the encrypted computation layer for lending risk logic.

ShieldLend uses Arcium to privately compute:

- Loan-to-value ratio
- Health factor
- Liquidation eligibility
- Borrow safety status

The goal is to allow the Solana program to enforce lending rules without exposing each borrower's full financial position publicly.

## Privacy Benefits

ShieldLend protects:

- Exact collateral value
- Exact borrowed amount
- Exact LTV
- Exact health factor
- Distance to liquidation

Only the final risk result is revealed, such as:

- Safe
- Warning
- Liquidatable

## Tech Stack

- Solana
- Arcium
- Next.js
- TypeScript
- Vercel

## Demo

The current frontend includes a live risk simulation UI. The next milestone is connecting the UI to an Arcium-powered Solana program for encrypted risk checks.

## Status

Hackathon MVP in progress.

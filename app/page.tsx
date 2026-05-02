"use client";

import { useMemo, useState } from "react";

type RiskStatus = "Safe" | "Warning" | "Liquidatable";

export default function Home() {
  const [collateral, setCollateral] = useState("10000");
  const [debt, setDebt] = useState("4200");
  const [threshold, setThreshold] = useState("80");
  const [computed, setComputed] = useState(true);

  const data = useMemo(() => {
    const collateralValue = Number(collateral) || 0;
    const debtValue = Number(debt) || 0;
    const thresholdValue = Number(threshold) || 80;

    const ltv = collateralValue > 0 ? (debtValue / collateralValue) * 100 : 0;
    const health =
      debtValue > 0 ? (collateralValue * (thresholdValue / 100)) / debtValue : 99;

    let status: RiskStatus = "Safe";

    if (health <= 1) {
      status = "Liquidatable";
    } else if (health <= 1.25) {
      status = "Warning";
    }

    return {
      collateralValue,
      debtValue,
      thresholdValue,
      ltv,
      health,
      status
    };
  }, [collateral, debt, threshold]);

  const statusClass =
    data.status === "Safe"
      ? "status-safe"
      : data.status === "Warning"
      ? "status-warning"
      : "status-danger";

  const statusMessage =
    data.status === "Safe"
      ? "Position is healthy. Exact risk data remains private."
      : data.status === "Warning"
      ? "Position is close to liquidation. Bots cannot see the exact distance."
      : "Position is eligible for liquidation based on encrypted risk rules.";

  function runPrivateCheck() {
    setComputed(false);

    setTimeout(() => {
      setComputed(true);
    }, 900);
  }

  return (
    <main className="page">
      <nav className="nav">
        <div className="brand">
          <div className="logo">🛡️</div>
          <span>ShieldLend</span>
        </div>

        <div className="nav-pill">Solana · Arcium · Private Risk Checks</div>
      </nav>

      <section className="hero">
        <div>
          <div className="badge">Confidential lending risk engine</div>

          <h1>
            Protect borrowers from{" "}
            <span className="gradient-text">predatory liquidations.</span>
          </h1>

          <p className="subtitle">
            ShieldLend is a privacy-preserving Solana lending prototype that
            uses Arcium-style encrypted computation to keep collateral, debt,
            LTV, and health factor hidden from public liquidation bots.
          </p>

          <div className="hero-actions">
            <button className="primary-btn" onClick={runPrivateCheck}>
              Run Private Risk Check
            </button>
            <button
              className="secondary-btn"
              onClick={() =>
                window.open("https://github.com/therowlingk/shieldlend", "_blank", "noopener,noreferrer")
              }
            >
              View GitHub Repo
            </button>
          </div>
        </div>

        <div className="panel">
          <div className="panel-top">
            <div>
              <h2 className="panel-title">Encrypted Risk Simulator</h2>
              <p className="panel-desc">
                Demo mode: values are entered locally, then displayed as if
                processed through a confidential Arcium computation.
              </p>
            </div>
            <div className="lock-chip">🔒 Private</div>
          </div>

          <div className="form-grid">
            <div className="field">
              <label>Collateral Value</label>
              <input
                value={collateral}
                onChange={(e) => setCollateral(e.target.value)}
                inputMode="numeric"
                placeholder="10000"
              />
            </div>

            <div className="field">
              <label>Borrowed Amount</label>
              <input
                value={debt}
                onChange={(e) => setDebt(e.target.value)}
                inputMode="numeric"
                placeholder="4200"
              />
            </div>

            <div className="field">
              <label>Liquidation Threshold %</label>
              <input
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                inputMode="numeric"
                placeholder="80"
              />
            </div>

            <div className="field">
              <label>Execution Layer</label>
              <input value="Arcium encrypted state" readOnly />
            </div>
          </div>

          <button className="compute-btn" onClick={runPrivateCheck}>
            {computed ? "Compute Privately" : "Encrypting and computing..."}
          </button>

          <div className="metrics">
            <div className="metric">
              <span>Public LTV</span>
              <strong>Hidden</strong>
            </div>
            <div className="metric">
              <span>Health Factor</span>
              <strong>Hidden</strong>
            </div>
            <div className="metric">
              <span>Liquidation</span>
              <strong>{computed ? data.status : "..."}</strong>
            </div>
          </div>

          <div className={`status-card ${statusClass}`}>
            <div>
              <div className="status-label">
                {computed ? data.status : "Computing..."}
              </div>
              <p className="status-copy">
                {computed
                  ? statusMessage
                  : "Inputs are encrypted before the risk logic is evaluated."}
              </p>
            </div>
            <div className="lock-chip">
              {computed ? "Result revealed" : "MPC running"}
            </div>
          </div>

          <div className="private-box">
            <div className="private-row">
              <span>Collateral</span>
              <span className="masked">0x7A9F••••••••</span>
            </div>
            <div className="private-row">
              <span>Debt</span>
              <span className="masked">0x31BC••••••••</span>
            </div>
            <div className="private-row">
              <span>Actual LTV</span>
              <span className="masked">
                {computed ? `${data.ltv.toFixed(2)}% locally / hidden on-chain` : "••••"}
              </span>
            </div>
            <div className="private-row">
              <span>Actual Health Factor</span>
              <span className="masked">
                {computed ? `${data.health.toFixed(3)} locally / hidden on-chain` : "••••"}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="sections">
        <div className="info-card">
          <h3>Problem</h3>
          <p>
            On-chain lending exposes collateral, debt, LTV, and health factors.
            This allows liquidation bots to monitor vulnerable borrowers.
          </p>
        </div>

        <div className="info-card">
          <h3>Arcium Role</h3>
          <p>
            ShieldLend routes liquidation and LTV checks through encrypted
            computation, revealing only the final risk decision.
          </p>
        </div>

        <div className="info-card">
          <h3>Privacy Benefit</h3>
          <p>
            Borrowers keep exact financial positions private while the protocol
            still enforces lending and liquidation rules.
          </p>
        </div>
      </section>

      <footer className="footer">
        ShieldLend MVP · Built for Solana privacy lending demo · Arcium-powered concept
      </footer>
    </main>
  );
}

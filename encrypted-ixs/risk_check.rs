use arcis::*;

#[encrypted]
mod circuits {
    use arcis::*;

    pub struct RiskInput {
        pub collateral_value_cents: u64,
        pub debt_value_cents: u64,
        pub liquidation_threshold_bps: u16,
        pub warning_health_bps: u32,
    }

    pub struct RiskResult {
        pub ltv_bps: u32,
        pub health_bps: u32,
        pub status: u8,
        pub liquidatable: bool,
    }

    #[instruction]
    pub fn risk_check(input_ctxt: Enc<Shared, RiskInput>) -> Enc<Shared, RiskResult> {
        let input = input_ctxt.to_arcis();

        let collateral = input.collateral_value_cents;
        let debt = input.debt_value_cents;

        let ltv_bps: u32 = if collateral == 0 {
            10000
        } else {
            ((debt as u128 * 10000u128) / collateral as u128) as u32
        };

        let health_bps: u32 = if debt == 0 {
            999999
        } else {
            ((collateral as u128 * input.liquidation_threshold_bps as u128) / debt as u128) as u32
        };

        let liquidatable = health_bps <= 10000;

        let status: u8 = if liquidatable {
            2
        } else if health_bps <= input.warning_health_bps {
            1
        } else {
            0
        };

        let result = RiskResult {
            ltv_bps,
            health_bps,
            status,
            liquidatable,
        };

        input_ctxt.owner.from_arcis(result)
    }
}
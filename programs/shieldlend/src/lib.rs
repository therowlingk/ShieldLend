use anchor_lang::prelude::*;

declare_id!("ShieLDend111111111111111111111111111111111");

#[program]
pub mod shieldlend {
    use super::*;

    pub fn initialize_protocol(ctx: Context<InitializeProtocol>) -> Result<()> {
        let protocol = &mut ctx.accounts.protocol;
        protocol.authority = ctx.accounts.authority.key();
        protocol.total_positions = 0;
        protocol.bump = ctx.bumps.protocol;

        msg!("ShieldLend protocol initialized");
        Ok(())
    }

    pub fn register_private_position(
        ctx: Context<RegisterPrivatePosition>,
        encrypted_position_hash: [u8; 32],
    ) -> Result<()> {
        let position = &mut ctx.accounts.position;
        let protocol = &mut ctx.accounts.protocol;

        position.owner = ctx.accounts.owner.key();
        position.encrypted_position_hash = encrypted_position_hash;
        position.last_risk_status = RiskStatus::Unknown;
        position.bump = ctx.bumps.position;

        protocol.total_positions += 1;

        msg!("Private ShieldLend position registered");
        Ok(())
    }

    pub fn update_risk_status(
        ctx: Context<UpdateRiskStatus>,
        status: RiskStatus,
    ) -> Result<()> {
        let position = &mut ctx.accounts.position;

        require_keys_eq!(
            position.owner,
            ctx.accounts.owner.key(),
            ShieldLendError::Unauthorized
        );

        position.last_risk_status = status;

        msg!("Risk status updated without exposing exact collateral, debt, LTV, or health factor");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeProtocol<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + Protocol::INIT_SPACE,
        seeds = [b"protocol"],
        bump
    )]
    pub protocol: Account<'info, Protocol>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RegisterPrivatePosition<'info> {
    #[account(
        mut,
        seeds = [b"protocol"],
        bump = protocol.bump
    )]
    pub protocol: Account<'info, Protocol>,

    #[account(
        init,
        payer = owner,
        space = 8 + PrivatePosition::INIT_SPACE,
        seeds = [b"position", owner.key().as_ref()],
        bump
    )]
    pub position: Account<'info, PrivatePosition>,

    #[account(mut)]
    pub owner: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateRiskStatus<'info> {
    #[account(
        mut,
        seeds = [b"position", owner.key().as_ref()],
        bump = position.bump
    )]
    pub position: Account<'info, PrivatePosition>,

    pub owner: Signer<'info>,
}

#[account]
#[derive(InitSpace)]
pub struct Protocol {
    pub authority: Pubkey,
    pub total_positions: u64,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct PrivatePosition {
    pub owner: Pubkey,
    pub encrypted_position_hash: [u8; 32],
    pub last_risk_status: RiskStatus,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, InitSpace)]
pub enum RiskStatus {
    Unknown,
    Safe,
    Warning,
    Liquidatable,
}

#[error_code]
pub enum ShieldLendError {
    #[msg("Unauthorized action")]
    Unauthorized,
}
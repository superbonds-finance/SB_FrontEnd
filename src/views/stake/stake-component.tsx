/* eslint-disable eqeqeq */
import React, { useEffect,useCallback, useState } from "react";
import { notify } from "../../utils/notifications";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection,sendTransaction } from "../../contexts/connection";
import { SUPERBONDS_PROGRAM_ID,
         STAKING_DATA_ACCOUNT,
        //  USDC_MINT_ADDRESS,
         SUPERB_MINT_ADDRESS,
         LP_TOKEN_30_MINT_ADDRESS,
         LP_TOKEN_90_MINT_ADDRESS,
         POOL_30_ADDRESS,
         POOL_90_ADDRESS,
        //  USDC_DECIMALS,
         SUPERB_DECIMALS,
         LP_TOKEN_DECIMALS,
         PLATFORM_DATA_ACCOUNT,
        //  SUPERB_REWARDS_POOL_ADDRESS,
        //  SOL_SB_LP_MINT_ADDRESS,
        //  SOL_SB_LP_TOKEN_DECIMALS,
        //  SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
        //  SUNNY_MINT_ADDRESS, SABER_MINT_ADDRESS, ORCA_MINT_ADDRESS,
       } from "../../utils/ids";
import { findAssociatedTokenAddress } from "../../contexts/accounts";
// import { useUserBalance } from "../../hooks";
import {POOL_DATA_LAYOUT,PoolDataLayout} from "../../utils/pool_data_layout";
// import {TRADE_DATA_LAYOUT,TradeDataLayout} from "../../utils/trade_data_layout";
import {PLATFORM_DATA_LAYOUT,PlatformDataLayout} from "../../utils/platform_data_layout";
// import {STAKING_DATA_LAYOUT,StakingDataLayout} from "../../utils/staking_data_layout";
import {TRADER_LAYOUT/* ,TraderLayout */} from "../../utils/trader_layout";
import {FARMING_REWARD_LAYOUT} from "../../utils/farming_reward_layout";
import {ButtonText,Text} from "./stake.styled";
import BN from "bn.js";
import { 
  Numberu64,numberFormatter,
  /* ,truncateStr,convertTimeStamp, */
  getTokenBalance,delay,
  formatInputNumber, unformatInputNumber,
  numOnly, noSpecial
 } from "../../utils/utils";
import {
  Account,
  // Connection,
  PublicKey,
  // LAMPORTS_PER_SOL,
  SYSVAR_RENT_PUBKEY,
  // SYSVAR_CLOCK_PUBKEY,
  SystemProgram,
  TransactionInstruction,
  // Transaction,
} from '@solana/web3.js';
import {  
          // AccountLayout,
          // Token,
          TOKEN_PROGRAM_ID,
          // MintLayout
 } from "@solana/spl-token";
// import {decode} from "base58-universal";
import Swal from 'sweetalert2';
import classes from './stake.module.css';
import { GlobalStyle } from "../redeem/redeem.styled";

let sunny_reward_accounts:any = [];
let saber_reward_accounts:any = [];

export const StakeViewComponent: React.FC<{ poolType: string ,getAllLiquidityBalances:Function,refreshStakeBalance:Number}> = ({ poolType,getAllLiquidityBalances ,refreshStakeBalance}) => {

  const connection = useConnection();
  const wallet = useWallet();
  const [lq_amount30,setLQ_Amount30] = useState("");
  const [lq_amount90,setLQ_Amount90] = useState("");
  // const [sb_amount,setSB_Amount] = useState("");
  // const [sol_sb_lp_amount,setSOL_SB_LP_Amount] = useState("");

  const onChangeLQ_amount30 = useCallback( (e) => {
    const { value } = e.target;
    setLQ_Amount30(formatInputNumber(value));
  },[]);

  const onChangeLQ_amount90 = useCallback( (e) => {
    const { value } = e.target;
    setLQ_Amount90(formatInputNumber(value));
  },[]);


  const [SuperBbalance,setSuperBbalance] = useState<any>(0);
  const [LP30balance,setLP30balance] = useState<any>(0);
  const [LP90balance,setLP90balance] = useState<any>(0);
  // const [SOL_SB_LPbalance,setSOL_SB_LPbalance] = useState<any>(0);

  const [traderData,setTraderData] = useState<any>(null);
  const [PlatformData, setPlatformData] = useState<any>();
  // const [StakingData, setStakingData] = useState<any>();
  // const [SuperB_Rewards_Balance,setSuperB_Rewards_Balance] = useState(0);

  const getAllBalances = async () => {
    if ( !wallet){
      notify({
        message: 'Please connect to Sol network',
        type: "error",
      });
      return;
    }
    if (!wallet.publicKey){
      notify({
        message: 'Please connect to Solana network',
        type: "error",
      });
      return;
    }
    //setSOLbalance(await connection.getBalance(wallet.publicKey)/(10**9));
    //setUSDCbalance(await getTokenBalance(connection,wallet.publicKey,USDC_MINT_ADDRESS,USDC_DECIMALS));
    setLP30balance(await getTokenBalance(connection,wallet.publicKey,LP_TOKEN_30_MINT_ADDRESS,LP_TOKEN_DECIMALS));
    setLP90balance(await getTokenBalance(connection,wallet.publicKey,LP_TOKEN_90_MINT_ADDRESS,LP_TOKEN_DECIMALS));
    setSuperBbalance(await getTokenBalance(connection,wallet.publicKey,SUPERB_MINT_ADDRESS,SUPERB_DECIMALS));
    // setSOL_SB_LPbalance(await getTokenBalance(connection,wallet.publicKey,SOL_SB_LP_MINT_ADDRESS,SOL_SB_LP_TOKEN_DECIMALS));
  }
  
  useEffect(() => {
    if (!wallet.publicKey) return;
    onRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet]);

  useEffect(() => {
    if(refreshStakeBalance>0) onRefresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshStakeBalance]);

  useEffect(() => {
    if (!wallet.publicKey) return;
    if (!traderData || !PlatformData) return;
    getRewardDataAccount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [traderData,PlatformData]);

  const getTraderDataAccount = async () => {
    if ( !wallet){
      notify({
        message: 'Please connect to Sol network',
        type: "error",
      });
      return;
    }
    let publicKey = wallet.publicKey;
    if (!publicKey){
      notify({
        message: 'Please connect to Solana network',
        type: "error",
      });
      return;
    }
    let filters = [
          {
            "dataSize":560
          },
          {
            "memcmp": {
              "offset": 0,
              "bytes": publicKey.toBase58()
            }
          }];
    const resp = await connection.getProgramAccounts(SUPERBONDS_PROGRAM_ID, {
      commitment: connection.commitment,
      filters,
      encoding: 'base64',
    });
    if (resp.length > 0){
      let decodedData = TRADER_LAYOUT.decode(resp[0].account.data);
      console.log(decodedData);
      setTraderData(decodedData);
    }

  }
  const getPlatformData = async () => {
    if ( !wallet){
      notify({
        message: 'Please connect to Sol network',
        type: "error",
      });
      return;
    }
    let publicKey = wallet.publicKey;
    if (!publicKey){
      notify({
        message: 'Please connect to Solana network',
        type: "error",
      });
      return;
    }
    const encodedPoolDataState = (await connection.getAccountInfo(PLATFORM_DATA_ACCOUNT, 'singleGossip'))!.data;
    const decodedPoolDataState = PLATFORM_DATA_LAYOUT.decode(encodedPoolDataState) as PlatformDataLayout;
    console.log(decodedPoolDataState);
    setPlatformData(decodedPoolDataState);

    // const encodedStakingDataState = (await connection.getAccountInfo(STAKING_DATA_ACCOUNT, 'singleGossip'))!.data;
    // const decodedStakingDataState = STAKING_DATA_LAYOUT.decode(encodedStakingDataState) as StakingDataLayout;
    // console.log(decodedStakingDataState);
    // setStakingData(decodedStakingDataState);

    // const encodeSuperB_Rewards_Account_ADDRESS = (await connection.getAccountInfo(new PublicKey(SUPERB_REWARDS_POOL_ADDRESS), 'singleGossip'))!.data;
    // const decodeSuperB_Rewards_Account_ADDRESS = AccountLayout.decode(encodeSuperB_Rewards_Account_ADDRESS);
    // let SuperB_Rewards_Balance = new BN(decodeSuperB_Rewards_Account_ADDRESS.amount, 10, "le").toNumber() / (10**SUPERB_DECIMALS);
    // setSuperB_Rewards_Balance(SuperB_Rewards_Balance);
  }

  const [sunny_unclaimed_rewards,setSunny_Unclaimed_Rewards] = useState(0);
  const [saber_unclaimed_rewards,setSaber_Unclaimed_Rewards] = useState(0);
  const [orca_unclaimed_rewards,setOrca_Unclaimed_Rewards] = useState(0);

  const getRewardDataAccount = async () => {
    if ( !wallet){
      notify({
        message: 'Please connect to Sol network',
        type: "error",
      });
      return;
    }
    let publicKey = wallet.publicKey;
    if (!publicKey){
      notify({
        message: 'Please connect to Solana network',
        type: "error",
      });
      return;
    }
    // let trader_Data_account = null;
    let filters = [
          {
            "dataSize":176
          }];
    const resp = await connection.getProgramAccounts(SUPERBONDS_PROGRAM_ID, {
      commitment: connection.commitment,
      filters,
      encoding: 'base64',
    });

    if (resp.length == 0) return;

    let Sunny_rewards = 0;
    let Saber_rewards = 0;
    let Orca_rewards = 0;
    sunny_reward_accounts = [];
    saber_reward_accounts = [];

    resp.forEach(element => {
      console.log(element);
      let farming_reward = FARMING_REWARD_LAYOUT.decode(element.account.data);
      let total_reward = new BN(farming_reward.total_reward, 10, "le").toNumber() / 1000000;
      let lp_staked_30 = farming_reward.total_lp_token_staked[0] / 1000000;
      let lp_staked_90 = farming_reward.total_lp_token_staked[1] / 1000000;
      if (total_reward>0 && (lp_staked_30 > 0 || lp_staked_90 > 0 ))
      {
        //process reward_data
        let timestamp = new BN(farming_reward.received_at, 10, "le").toNumber();
        let token_account = farming_reward.token_account.toBase58();

        let sunny_last_update = traderData ? traderData.last_update_external_farming[0] : 0;

        if (sunny_last_update != 0 && sunny_last_update < timestamp){
          //qualify for Rewards
          if (token_account == PlatformData.reserved_token_accounts[0].toBase58()){
            //Sunny
            Sunny_rewards += total_reward * PlatformData.pool_risk_factor_vector[0]/1000000 * ((traderData.total_LP_Token_staked_vector[0]/1000000) /  lp_staked_30);
            Sunny_rewards += total_reward * PlatformData.pool_risk_factor_vector[1]/1000000 * ((traderData.total_LP_Token_staked_vector[1]/1000000) /  lp_staked_90);
            sunny_reward_accounts.push(element.pubkey);
          }

        }

        let saber_last_update = traderData ? traderData.last_update_external_farming[1] : 0;

        if (saber_last_update != 0 && saber_last_update < timestamp){
          //qualify for Rewards
          if (token_account == PlatformData.reserved_token_accounts[1].toBase58()){
            //Saber
            Saber_rewards += total_reward * PlatformData.pool_risk_factor_vector[0]/1000000 * ((traderData.total_LP_Token_staked_vector[0]/1000000) /  lp_staked_30);
            Saber_rewards += total_reward * PlatformData.pool_risk_factor_vector[1]/1000000 * ((traderData.total_LP_Token_staked_vector[1]/1000000) /  lp_staked_90);
            saber_reward_accounts.push(element.pubkey);
          }
        }
      }

    });
    setSunny_Unclaimed_Rewards(Math.round(Sunny_rewards*1000000)/1000000);
    setSaber_Unclaimed_Rewards(Math.round(Saber_rewards*1000000)/1000000);
    setOrca_Unclaimed_Rewards(Math.round(Orca_rewards*1000000)/1000000);

  }

  const onStake = async (pool:number,isClaim=false) => {
    if ( !wallet){
      notify({
        message: 'Please connect to Sol network',
        type: "error",
      });
      return;
    }
    let publicKey = wallet.publicKey;
    if (!publicKey){
      notify({
        message: 'Please connect to Solana network',
        type: "error",
      });
      return;
    }

    let Proceed = false;
    if (sunny_unclaimed_rewards != 0 || orca_unclaimed_rewards != 0 || saber_unclaimed_rewards !=0)
    {
      let message =
      '<div class="bg-gray-200 py-3 p-4 mt-3 sm:p-1 rounded-md"><strong class="text-white">You have SUNNY/SABER/ORCA rewards. These may be claimed or will be auto-claimed after staking/unstaking LP Tokens</strong><br/></div/>';
      await Swal.fire({
        title: 'Confirmation',
        html:message,
        showCancelButton: true,
        confirmButtonText: 'OK',
        confirmButtonColor:'#7cfa4d'
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          Proceed = true;
          //console.log(Proceed);
        }
      })
      if (!Proceed) return;
    }

    let pool_address = pool == 30 ? POOL_30_ADDRESS : POOL_90_ADDRESS;
    let lp_token_mint_address = pool == 30 ? LP_TOKEN_30_MINT_ADDRESS : LP_TOKEN_90_MINT_ADDRESS;
    let lp_token_amount = unformatInputNumber(pool == 30 ? lq_amount30 : lq_amount90);
    let lp_token_balance  = pool == 30 ? LP30balance : LP90balance;

    const encodedPoolDataState = (await connection.getAccountInfo(pool_address, 'singleGossip'))!.data;
    const decodedPoolDataState = POOL_DATA_LAYOUT.decode(encodedPoolDataState) as PoolDataLayout;

    const encodedStakingDataState = (await connection.getAccountInfo(PLATFORM_DATA_ACCOUNT, 'singleGossip'))!.data;
    const decodedStakingDataState = PLATFORM_DATA_LAYOUT.decode(encodedStakingDataState) as PlatformDataLayout;

    let SuperB_fee = new BN(decodedPoolDataState.transaction_fee_SuperB, 10, "le").toNumber();
    if (!isClaim){
      if (SuperBbalance*(10**SUPERB_DECIMALS)  < SuperB_fee)
      {
        notify({
          message: 'You dont have enough SuperB to pay for transaction fee',
          type: "error",
        });
        return;
      }
    }
    if (lp_token_balance < parseFloat(lp_token_amount))
    {
      notify({
        message: 'You dont have enough LP Token',
        type: "error",
      });
      return;
    }
    let associated_SUPERB_token_account_address = await findAssociatedTokenAddress(publicKey,SUPERB_MINT_ADDRESS);
    console.log('associated_SUPERB_token_account_address',associated_SUPERB_token_account_address.toBase58());

    let associated_LP_Token_token_account_address = await findAssociatedTokenAddress(publicKey,lp_token_mint_address);
    console.log('associated_LP_Token_token_account_address',associated_LP_Token_token_account_address.toBase58());
    let buffers = null;
    if (!isClaim){
       buffers = [
        Buffer.from(Uint8Array.of(19,0, ...new Numberu64(parseFloat(lp_token_amount) * (10**LP_TOKEN_DECIMALS)).toBuffer()))
      ];
    }
    else {
       buffers = [
        Buffer.from(Uint8Array.of(19,0, ...new Numberu64(0).toBuffer()))
      ];
    }

    //Look for Trader Data Account
    let trader_Data_account = null;
    let filters = [
          {
            "dataSize":560
          },
          {
            "memcmp": {
              "offset": 0,
              "bytes": publicKey.toBase58()
            }
          }];
    const resp = await connection.getProgramAccounts(SUPERBONDS_PROGRAM_ID, {
      commitment: connection.commitment,
      filters,
      encoding: 'base64',
    });
    console.log('resp',resp);
    //return;
    let [SuperB_pda_address/* ,SuperB_pda_NONCE */] = await PublicKey.findProgramAddress([new PublicKey(decodedStakingDataState.SuperB_Account).toBuffer()], SUPERBONDS_PROGRAM_ID);

    if (resp.length == 0){
      console.log('Initializing Trader Data Account and Stake...');
      trader_Data_account = new Account();
      console.log('trader_Data_account',trader_Data_account.publicKey.toBase58());
      const createTraderDataAccountIx = SystemProgram.createAccount({
          programId: SUPERBONDS_PROGRAM_ID,
          space: TRADER_LAYOUT.span,
          lamports: await connection.getMinimumBalanceForRentExemption(TRADER_LAYOUT.span),
          fromPubkey: publicKey,
          newAccountPubkey: trader_Data_account.publicKey
      });
      const stakeLP_TokenIx = new TransactionInstruction({
          programId: SUPERBONDS_PROGRAM_ID,
          keys: [
              { pubkey: PLATFORM_DATA_ACCOUNT, isSigner: false, isWritable: true },
              { pubkey: STAKING_DATA_ACCOUNT, isSigner: false, isWritable: true },
              { pubkey: pool_address, isSigner: false, isWritable: true },
              //Trader Data Account
              { pubkey: trader_Data_account.publicKey, isSigner: false, isWritable: true },
              { pubkey: publicKey, isSigner: true, isWritable: false },
              { pubkey: new PublicKey(decodedStakingDataState.SuperB_Account), isSigner: false, isWritable: true },
              { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
              { pubkey: SuperB_pda_address, isSigner: false, isWritable: true},
              { pubkey: associated_SUPERB_token_account_address, isSigner: false, isWritable: true },
              { pubkey: new PublicKey(decodedStakingDataState.SuperB_Pool), isSigner: false, isWritable: true },
              { pubkey: SUPERB_MINT_ADDRESS, isSigner: false, isWritable: true},
              { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false},
              { pubkey: associated_LP_Token_token_account_address, isSigner: false, isWritable: true },
              { pubkey: new PublicKey(decodedPoolDataState.Staked_LP_Token_Account), isSigner: false, isWritable: true },
              { pubkey: lp_token_mint_address, isSigner: false, isWritable: true},

          ],
          data: Buffer.concat(buffers)
      });

      let txid = await sendTransaction(connection,wallet,
          [createTraderDataAccountIx,stakeLP_TokenIx]
        ,[trader_Data_account],false);
      if (!txid){
        notify({
          message: 'Something wrong with your request!',
          type: "error",
        });
      }else{
        if (!isClaim){
          notify({
            message: 'Staking Request Sent',
            type: "success",
          });
        }
        else{
          notify({
            message: 'Claim SuperB Rewards from ' + pool+'-days Pool LP Staking Sent',
            type: "success",
          });
        }
        await delay(2000);
        onRefresh();
        getAllLiquidityBalances()
      }
    }

    else{
      console.log('Stake...');
      const stakeLP_TokenIx = new TransactionInstruction({
          programId: SUPERBONDS_PROGRAM_ID,
          keys: [
            { pubkey: PLATFORM_DATA_ACCOUNT, isSigner: false, isWritable: true },
            { pubkey: STAKING_DATA_ACCOUNT, isSigner: false, isWritable: true },
            { pubkey: pool_address, isSigner: false, isWritable: true },
            //Trader Data Account
            { pubkey: resp[0].pubkey, isSigner: false, isWritable: true },
            { pubkey: publicKey, isSigner: true, isWritable: false },
            { pubkey: new PublicKey(decodedStakingDataState.SuperB_Account), isSigner: false, isWritable: true },
            { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
            { pubkey: SuperB_pda_address, isSigner: false, isWritable: true},
            { pubkey: associated_SUPERB_token_account_address, isSigner: false, isWritable: true },
            { pubkey: new PublicKey(decodedStakingDataState.SuperB_Pool), isSigner: false, isWritable: true },
            { pubkey: SUPERB_MINT_ADDRESS, isSigner: false, isWritable: true},
            { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false},
            { pubkey: associated_LP_Token_token_account_address, isSigner: false, isWritable: true },
            { pubkey: new PublicKey(decodedPoolDataState.Staked_LP_Token_Account), isSigner: false, isWritable: true },
            { pubkey: lp_token_mint_address, isSigner: false, isWritable: true},
          ],
          data: Buffer.concat(buffers)
      });

      let txid = await sendTransaction(connection,wallet,
          [stakeLP_TokenIx]
        ,[],false);
      if (!txid){
        notify({
          message: 'Something wrong with your request!',
          type: "error",
        });
      }else{
        if (!isClaim){
          notify({
            message: 'Staking Request Sent',
            type: "success",
          });
        }
        else{
          notify({
            message: 'Claim SuperB Rewards from Pool LP Staking Sent',
            type: "success",
          });
        }
        await delay(2000);
        onRefresh();
       getAllLiquidityBalances()
      }
    }


  }
  const onUnstake = async (pool:number) => {
    if ( !wallet){
      notify({
        message: 'Please connect to Sol network',
        type: "error",
      });
      return;
    }
    let publicKey = wallet.publicKey;
    if (!publicKey){
      notify({
        message: 'Please connect to Solana network',
        type: "error",
      });
      return;
    }
    let Proceed = false;
    if (sunny_unclaimed_rewards != 0 || orca_unclaimed_rewards != 0 || saber_unclaimed_rewards !=0)
    {
      let message =
      '<div class="bg-gray-200 py-3 p-4 mt-3 sm:p-1 rounded-md"><strong class="text-white">If you have unclaimed ‘Other Rewards’ ,please claim it from your account section before proceeding. Else that will be lost.</strong><br/></div>';
      await Swal.fire({
        title: 'Confirmation',
        html:message,
        showCancelButton: true,
        confirmButtonText: 'OK',
        confirmButtonColor:'#7cfa4d'
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          Proceed = true;
          //console.log(Proceed);
        }
      });
      if (!Proceed) return;
    }

    let pool_address = pool == 30 ? POOL_30_ADDRESS : POOL_90_ADDRESS;
    let lp_token_mint_address = pool == 30 ? LP_TOKEN_30_MINT_ADDRESS : LP_TOKEN_90_MINT_ADDRESS;
    let lp_token_amount = unformatInputNumber(pool == 30 ? lq_amount30 : lq_amount90);

    const encodedPoolDataState = (await connection.getAccountInfo(pool_address, 'singleGossip'))!.data;
    const decodedPoolDataState = POOL_DATA_LAYOUT.decode(encodedPoolDataState) as PoolDataLayout;

    const encodedStakingDataState = (await connection.getAccountInfo(PLATFORM_DATA_ACCOUNT, 'singleGossip'))!.data;
    const decodedStakingDataState = PLATFORM_DATA_LAYOUT.decode(encodedStakingDataState) as PlatformDataLayout;

    let lp_token_balance  = pool == 30 ? traderData.total_LP_Token_staked_vector[0]/1000000 : traderData.total_LP_Token_staked_vector[1]/1000000;

    let SuperB_fee = new BN(decodedPoolDataState.transaction_fee_SuperB, 10, "le").toNumber();
    if (SuperBbalance*(10**SUPERB_DECIMALS)  < SuperB_fee)
    {
      notify({
        message: 'You dont have enough SuperB to pay for transaction fee',
        type: "error",
      });
      return;
    }
    if (lp_token_balance < parseFloat(lp_token_amount))
    {
      notify({
        message: 'You dont have enough LP Token',
        type: "error",
      });
      return;
    }
    let associated_SUPERB_token_account_address = await findAssociatedTokenAddress(publicKey,SUPERB_MINT_ADDRESS);
    console.log('associated_SUPERB_token_account_address',associated_SUPERB_token_account_address.toBase58());

    let associated_LP_Token_token_account_address = await findAssociatedTokenAddress(publicKey,lp_token_mint_address);
    console.log('associated_LP_Token_token_account_address',associated_LP_Token_token_account_address.toBase58());

    let [SuperB_pda_address/* ,SuperB_pda_NONCE */] = await PublicKey.findProgramAddress([new PublicKey(decodedStakingDataState.SuperB_Account).toBuffer()], SUPERBONDS_PROGRAM_ID);

    const buffers = [
      Buffer.from(Uint8Array.of(21,0, ...new Numberu64(parseFloat(lp_token_amount) * (10**LP_TOKEN_DECIMALS)).toBuffer()))
    ];

    //Look for Trader Data Account
    // let trader_Data_account = null;
    let filters = [
          {
            "dataSize":560
          },
          {
            "memcmp": {
              "offset": 0,
              "bytes": publicKey.toBase58()
            }
          }];
    const resp = await connection.getProgramAccounts(SUPERBONDS_PROGRAM_ID, {
      commitment: connection.commitment,
      filters,
      encoding: 'base64',
    });
    console.log('resp',resp);
    //return;

    if (resp.length == 0){

      notify({
        message: 'Cannot find Trader Data Account!',
        type: "error",
      });
      return;
    }
    else{
      console.log('Unstake...');
      let [staked_lp_token_pda_address/* ,staked_lp_token_pda_NONCE */] = await PublicKey.findProgramAddress([ new PublicKey(decodedPoolDataState.Staked_LP_Token_Account).toBuffer()], SUPERBONDS_PROGRAM_ID);
      const unstakeLP_TokenIx = new TransactionInstruction({
          programId: SUPERBONDS_PROGRAM_ID,
          keys: [
              { pubkey: PLATFORM_DATA_ACCOUNT, isSigner: false, isWritable: true },
              { pubkey: STAKING_DATA_ACCOUNT, isSigner: false, isWritable: true },
              { pubkey: pool_address, isSigner: false, isWritable: true },
              //Trader Data Account
              { pubkey: resp[0].pubkey, isSigner: false, isWritable: true },
              { pubkey: publicKey, isSigner: true, isWritable: false },
              { pubkey: new PublicKey(decodedStakingDataState.SuperB_Account), isSigner: false, isWritable: true },
              { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
              { pubkey: SuperB_pda_address, isSigner: false, isWritable: true},
              { pubkey: associated_SUPERB_token_account_address, isSigner: false, isWritable: true },
              { pubkey: new PublicKey(decodedStakingDataState.SuperB_Pool), isSigner: false, isWritable: true },
              { pubkey: SUPERB_MINT_ADDRESS, isSigner: false, isWritable: true},
              { pubkey: associated_LP_Token_token_account_address, isSigner: false, isWritable: true },
              { pubkey: new PublicKey(decodedPoolDataState.Staked_LP_Token_Account), isSigner: false, isWritable: true },
              { pubkey: lp_token_mint_address, isSigner: false, isWritable: true},
              { pubkey: staked_lp_token_pda_address, isSigner: false, isWritable: true},

          ],
          data: Buffer.concat(buffers)
      });

      let txid = await sendTransaction(connection,wallet,
          [unstakeLP_TokenIx]
        ,[],false);
      if (!txid){
        notify({
          message: 'Something wrong with your request!',
          type: "error",
        });
      }else{
        notify({
          message: 'Unstake Request Sent',
          type: "success",
        });
        await delay(2000);
        onRefresh();
        getAllLiquidityBalances()
      }
    }


  }
   
  const onRefresh = async () =>{
    await getTraderDataAccount();
    await getPlatformData();
    await getAllBalances();
  }
  
  if (poolType === '30')
    return (<div
      className="flex neon-bottom-card selected-box-neon border-left-none flex-col w-5/12 2xl:w-49/100 xl:w-11/12 md:w-8/12 sm:w-11/12 ml-4 bg-gray-300 py-5 px-7 rounded-md md:my-4 md:ml-0 mt-2 max-h-80">
      <i className={"fas fa-exchange-alt fa-lg mr-1 " + classes.exchange_icon} aria-hidden="true" />
      <div className="text-center">
        <Text size={"16px"} transform={"true"}>30-DAY POOL LP STAKING</Text>
      </div>
      <div className="bg-gray-200 py-3 pl-3 pr-3  mt-2 rounded-md">
        <table className="w-full">
          <tr>
            <th className="float-left"><Text opacity={"50%"}>Balance:</Text></th>
            <td className="text-right px-2"><Text className='cursor-pointer' onClick={()=>setLQ_Amount30(formatInputNumber(String(LP30balance)))}> {numberFormatter.format(LP30balance)}</Text></td>
          </tr>
          <tr>
            <th className="float-left"><Text opacity={"50%"}>Staked:</Text></th>
            <td className="text-right px-2"><Text className='cursor-pointer' onClick={()=>setLQ_Amount30(formatInputNumber(String(traderData.total_LP_Token_staked_vector[0]/1000000)))}>{traderData ? numberFormatter.format(traderData.total_LP_Token_staked_vector[0]/1000000): '0.00'}</Text></td>
          </tr>
        </table>
      </div>
      <div className="text-center bg-gray-200 py-3 px-3 border rounded-md mt-3">
        <Text className="block" opacity={"0.5"}>Enter 30 Day LP Token</Text>
        <input maxLength={20}
          onKeyDown={numOnly}
          onKeyPress={noSpecial}
          onChange={onChangeLQ_amount30} value={lq_amount30}
          className="w-full py-2 px-2 h-10 mt-3 rounded-md bg-gray-400 focus:outline-none ring-2 ring-green-100 focus:ring-green-100 focus:border-transparent placeholder-green-100"
          placeholder="Token Amount" />
      </div>
      {/* <Text opacity={"50%"}>Fees:0.5%+500SB</Text> */}
      <div className="grid grid-cols-2 gap-2 mt-3">
        <div>
          <button onClick={() => onStake(30)} className="border-2 hover:bg-green-100 hover:text-black  rounded-md w-full border-green-100 px-6 py-1.5
        inline-block">
            <ButtonText transform weight>Stake</ButtonText>
          </button>
        </div>
        <div>
          <button onClick={() => onUnstake(30)} className="border-2 hover:bg-green-100 hover:text-black  rounded-md w-full border-green-100 px-6 py-1.5
        inline-block">
            <ButtonText transform weight>Unstake</ButtonText>
          </button>
        </div>
      </div>
    </div>)

  if (poolType === '90')
    return (
      <div
        className="flex neon-bottom-card selected-box-neon border-left-none flex-col w-5/12 2xl:w-49/100 xl:w-11/12 md:w-8/12 sm:w-11/12 ml-4 bg-gray-300 py-5 px-7 rounded-md md:my-4 md:ml-0 mt-2 max-h-80">
        <i className={"fas fa-exchange-alt fa-lg mr-1 " + classes.exchange_icon} aria-hidden="true" />
        <div className="text-center">
          <Text size={"16px"} transform={"true"}>90-DAY POOL LP STAKING</Text>
        </div>
        <div className="bg-gray-200 py-3 pl-3 pr-3  mt-2 rounded-md">
          <table className="w-full">
            <tr>
              <th className="float-left"><Text opacity={"50%"}>Balance:</Text></th>
              <td className="text-right px-2"><Text className='cursor-pointer' onClick={()=>setLQ_Amount90(formatInputNumber(String(LP90balance)))}>{numberFormatter.format(LP90balance)}</Text></td>
            </tr>
            <tr>
            <th className="float-left"><Text opacity={"50%"}>Staked:</Text></th>
            <td className="text-right px-2"><Text className='cursor-pointer' onClick={()=>setLQ_Amount90(formatInputNumber(String(traderData.total_LP_Token_staked_vector[1]/1000000)))}>{traderData ? numberFormatter.format(traderData.total_LP_Token_staked_vector[1]/1000000): '0.00'}</Text></td>
          </tr>
          </table>
        </div>
        <div className="text-center bg-gray-200 py-3 px-3 border rounded-md mt-3">
          <Text className="block" opacity={"0.5"}>Enter 90 Day LP Token</Text>
          <input maxLength={20}
            onKeyDown={numOnly}
            onKeyPress={noSpecial} value={lq_amount90}
            onChange={onChangeLQ_amount90}
            className="w-full py-2 px-2 h-10 mt-3 rounded-md bg-gray-400 focus:outline-none ring-2 ring-green-100 focus:ring-green-100 focus:border-transparent placeholder-green-100"
            placeholder="Token Amount" />
        </div>
        {/* <Text opacity={"50%"}>Fees:0.5%+500SB</Text> */}
        <div className="grid grid-cols-2 gap-2 mt-3">
          <div>
            <button onClick={() => onStake(90)} className="border-2 hover:bg-green-100 hover:text-black  rounded-md w-full border-green-100 px-6 py-1.5
        inline-block">
              <ButtonText transform weight>Stake</ButtonText>
            </button>
          </div>
          <div>
            <button onClick={() => onUnstake(90)} className="border-2 hover:bg-green-100 hover:text-black  rounded-md w-full border-green-100 px-6 py-1.5
        inline-block">
              <ButtonText transform weight>Unstake</ButtonText>
            </button>
          </div>
        </div>
        <GlobalStyle />
      </div>
    )

  return null

}

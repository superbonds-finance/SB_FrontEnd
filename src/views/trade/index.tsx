import React, { useEffect,useCallback, useState } from "react";
import { notify } from "../../utils/notifications";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection,sendTransaction } from "../../contexts/connection"
import { SUPERBONDS_PROGRAM_ID,
    USDC_MINT_ADDRESS,
    SUPERB_MINT_ADDRESS,
    LP_TOKEN_30_MINT_ADDRESS,
    LP_TOKEN_90_MINT_ADDRESS,
    POOL_30_ADDRESS,
    POOL_90_ADDRESS,
    PLATFORM_DATA_ACCOUNT,
    USDC_DECIMALS,
    SUPERB_DECIMALS,
    LP_TOKEN_DECIMALS,
    SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
    STAKING_DATA_ACCOUNT
  } from "../../utils/ids";
import { findAssociatedTokenAddress } from "../../contexts/accounts";
import {POOL_DATA_LAYOUT,PoolDataLayout} from "../../utils/pool_data_layout";
import {TRADE_DATA_LAYOUT,TradeDataLayout} from "../../utils/trade_data_layout";
import {PLATFORM_DATA_LAYOUT,PlatformDataLayout} from "../../utils/platform_data_layout";
import {TRADER_LAYOUT,TraderLayout} from "../../utils/trader_layout";
import BN from "bn.js";
import { Numberu64,
  delay,
  getTokenBalance,
  formatNumberWithoutRounding,
  formatInputNumber, unformatInputNumber,
  numOnly, noSpecial } from "../../utils/utils";
import {
  Account,
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  SYSVAR_RENT_PUBKEY,
  SYSVAR_CLOCK_PUBKEY,
  SystemProgram,
  TransactionInstruction,
  Transaction,
} from '@solana/web3.js';
import {  AccountLayout,
          Token,
          TOKEN_PROGRAM_ID,
          MintLayout
 } from "@solana/spl-token";
import Swal from 'sweetalert2'
import {HeaderText,Text} from "./trade.styled"
import { HeaderCard } from "../../components/HeaderCard";
import '../../styles/trade.css';
import { GlobalStyle } from "../redeem/redeem.styled";
import axios from 'axios';
import {AxiosResponse} from 'axios';
import {TradeTableComponent} from "./trade.table";
import { useInterval } from "../../hooks";

export function TradeView() {
    const connection = useConnection();
    const wallet = useWallet();
    //const [loaded,setLoaded] = useState(false);

    const [data30pool,setData30pool] = useState<any>();
    const [data90pool,setData90pool] = useState<any>();
    const [showAllTrade,setAllTrade]=useState<number>(2);

    const [SOLbalance,setSOLbalance] = useState(0);
    const [USDCbalance,setUSDCbalance] = useState<any>(0);
    const [SuperBbalance,setSuperBbalance] = useState<any>(0);

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
      setUSDCbalance(await getTokenBalance(connection,wallet.publicKey,USDC_MINT_ADDRESS,USDC_DECIMALS));
      //setLP30balance(await getTokenBalance(connection,wallet.publicKey,LP_TOKEN_30_MINT_ADDRESS,LP_TOKEN_DECIMALS));
      //setLP90balance(await getTokenBalance(connection,wallet.publicKey,LP_TOKEN_90_MINT_ADDRESS,LP_TOKEN_DECIMALS));
      setSuperBbalance(await getTokenBalance(connection,wallet.publicKey,SUPERB_MINT_ADDRESS,SUPERB_DECIMALS));

    }

    const [bond_yield30,setBond_Yield30] = useState(0);
    const [superbondsStatus30,setSuperBondsStatus30] = useState(false);
    const [superbondsRate30,setSuperBondsRate30] = useState(1);
    const [adjustedLiquidity30,setAdjustedLiquidity30] = useState(0);
    const [tradeLiquidityAvailability30,setTradeLiquidityAvailability30] = useState(0);
    const [trade_fee_USDC30,setTrade_fee_USDC30] = useState(0);
    const [transaction_fee_SuperB30,setTransaction_fee_SuperB30] = useState(0);
    const [SuperBonds_Rewards_Pool_30_Balance,setSuperBonds_Rewards_Pool_30_Balance] = useState(0);
    const [superBonds_status30,setsuperBonds_status30] = useState<any>("INACTIVE");

    const [bondValue_30,setBondValue_30] = useState(0);
    const [bondValueMaturity_30,setBondValueMaturity_30] = useState(0);

    const [bond_yield90,setBond_Yield90] = useState(0);
    const [superbondsStatus90,setSuperBondsStatus90] = useState(false);
    const [superbondsRate90,setSuperBondsRate90] = useState(1);
    const [adjustedLiquidity90,setAdjustedLiquidity90] = useState(0);
    const [tradeLiquidityAvailability90,setTradeLiquidityAvailability90] = useState(0);
    const [trade_fee_USDC90,setTrade_fee_USDC90] = useState(0);
    const [transaction_fee_SuperB90,setTransaction_fee_SuperB90] = useState(0);
    const [SuperBonds_Rewards_Pool_90_Balance,setSuperBonds_Rewards_Pool_90_Balance] = useState(0);
    const [superBonds_status90,setsuperBonds_status90] = useState<any>("INACTIVE");

    const [bondValue_90,setBondValue_90] = useState(0);
    const [bondValueMaturity_90,setBondValueMaturity_90] = useState(0);
    const [stakingPool, setStakingPool] = useState<any>();
    const [lq_amount30, setLQ_Amount30] = useState<any>("");
    const [lq_amount90, setLQ_Amount90] = useState("");

    const [Trade_dataSource,setTrade_dataSource] = useState<any>([]);
    const [myTradeData,setMyTradeData]=useState<any>([]);
    const [allTradeData,setAllTradeData]=useState<any>([]);
    const [myPendingData,setMyPendingData]=useState<any>([]);
    const [offset,setOffset] = useState(0);

    const onShowAllTrades = async (_type:number) =>{
      setAllTrade(_type);
    };

    useEffect(() => {
      if (!wallet.publicKey) return;
      //console.log('Here');
      readPoolData_30();
      readPoolData_90();
      getStakingPoolData();
      onShowAllTrades(2);
      getAllBalances();
    }, [wallet]);

    useEffect(() => {
      if (!wallet.publicKey) return;
      if (data30pool) {
        setSuperBondsRate30(data30pool.superBonds_rate/100);
        setAdjustedLiquidity30(new BN(data30pool.adjustedLiquidity, 10, "le").toNumber()/1000000);
        setTradeLiquidityAvailability30(data30pool.trade_liquidity_availability/10000);
        setTrade_fee_USDC30(data30pool.trade_fee_USDC/10000);
        setTransaction_fee_SuperB30(new BN(data30pool.transaction_fee_SuperB, 10, "le").toNumber());
      }
      if (data90pool) {

        setSuperBondsRate90(data90pool.superBonds_rate/100);
        setAdjustedLiquidity90(new BN(data90pool.adjustedLiquidity, 10, "le").toNumber()/1000000);
        setTradeLiquidityAvailability90(data90pool.trade_liquidity_availability/10000);
        setTrade_fee_USDC90(data90pool.trade_fee_USDC/10000);
        setTransaction_fee_SuperB90(new BN(data90pool.transaction_fee_SuperB, 10, "le").toNumber());
      }
      superBondsProcess();
    }, [data30pool,data90pool]);

    const readPoolData_30 = async () => {
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

      const encodedPoolDataState = (await connection.getAccountInfo(POOL_30_ADDRESS, 'singleGossip'))!.data;
      const decodedPoolDataState = POOL_DATA_LAYOUT.decode(encodedPoolDataState) as PoolDataLayout;
      setData30pool(decodedPoolDataState);

      const encodeSuperBonds_Rewards_Pool_Account_ADDRESS = (await connection.getAccountInfo(new PublicKey(decodedPoolDataState.SuperBonds_Rewards_Pool), 'singleGossip'))!.data;
      const decodeSuperBonds_Rewards_Pool_Account_ADDRESS = AccountLayout.decode(encodeSuperBonds_Rewards_Pool_Account_ADDRESS);
      let SuperBonds_Rewards_Pool_Balance = new BN(decodeSuperBonds_Rewards_Pool_Account_ADDRESS.amount, 10, "le").toNumber() / (10**USDC_DECIMALS);
      setSuperBonds_Rewards_Pool_30_Balance(SuperBonds_Rewards_Pool_Balance);

    }
    const readPoolData_90 = async () => {
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

      const encodedPoolDataState = (await connection.getAccountInfo(POOL_90_ADDRESS, 'singleGossip'))!.data;
      const decodedPoolDataState = POOL_DATA_LAYOUT.decode(encodedPoolDataState) as PoolDataLayout;
      setData90pool(decodedPoolDataState);

      const encodeSuperBonds_Rewards_Pool_Account_ADDRESS = (await connection.getAccountInfo(new PublicKey(decodedPoolDataState.SuperBonds_Rewards_Pool), 'singleGossip'))!.data;
      const decodeSuperBonds_Rewards_Pool_Account_ADDRESS = AccountLayout.decode(encodeSuperBonds_Rewards_Pool_Account_ADDRESS);
      let SuperBonds_Rewards_Pool_Balance = new BN(decodeSuperBonds_Rewards_Pool_Account_ADDRESS.amount, 10, "le").toNumber() / (10**USDC_DECIMALS);
      setSuperBonds_Rewards_Pool_90_Balance(SuperBonds_Rewards_Pool_Balance);
    }
    const getStakingPoolData = async () => {
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
      //console.log(decodedPoolDataState);
      setStakingPool(decodedPoolDataState);
      let bond_yield = decodedPoolDataState.pool_yield_vector[0]/100;
      setBond_Yield30(bond_yield);
      bond_yield =  decodedPoolDataState.pool_yield_vector[1]/100;
      setBond_Yield90(bond_yield);

    }

    const onChangePar_value_30 =  (e:any) => {
      let { value } = !e.target ? 0 : e.target;
      value = formatInputNumber(value)
      setLQ_Amount30(formatInputNumber(value))
      value = unformatInputNumber(value)

      let bondValueMaturity = parseFloat(value) * 1000;
      setBondValueMaturity_30(bondValueMaturity);
      let bondValue = bondValueMaturity / ((1 + (bond_yield30/100))**(30/365))
      setBondValue_30(bondValue);

    };
    const onChangePar_value_90 =  (e:any) => {
      let { value } = !e.target ? 0 : e.target;
      value = formatInputNumber(value)
      setLQ_Amount90(formatInputNumber(value))
      value = unformatInputNumber(value)

      let bondValueMaturity = parseFloat(value) * 1000;
      setBondValueMaturity_90(bondValueMaturity);
      let bondValue = bondValueMaturity / ((1 + (bond_yield90/100))**(90/365))
      setBondValue_90(bondValue);

    };

    const onTrade = async (pool:any) =>{
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
      let SOL_balance = await connection.getBalance(publicKey)/(10**9);
      if (SOL_balance <= 0.001){
        notify({
          message: 'You have low Sol balance',
          type: "info",
        });
        return;
      }
      let bondValue = pool == 30 ? bondValue_30 : bondValue_90;

      if (bondValue<5){
        notify({
          message: 'Minimum Trade is 5 USDC',
          type: "error",
        });
        return;
      }

      let pool_address = pool == 30 ? POOL_30_ADDRESS : POOL_90_ADDRESS;

      let poolName = pool == 30 ? '30-day' : '90-day';
      let bondValueMaturity = pool == 30 ? bondValueMaturity_30 : bondValueMaturity_90;
      let bondYield = pool == 30 ? bond_yield30 : bond_yield90;
      let trade_fee_USDC = pool == 30 ? trade_fee_USDC30 : trade_fee_USDC90;
      let adjustedLiquidity = pool == 30 ? adjustedLiquidity30 : adjustedLiquidity90;
      let tradeLiquidityAvailability = pool == 30 ? tradeLiquidityAvailability30 : tradeLiquidityAvailability90;
      let lp_token_mint_address = pool == 30 ? LP_TOKEN_30_MINT_ADDRESS : LP_TOKEN_90_MINT_ADDRESS;
      let superbondsStatus = pool == 30 ? superbondsStatus30 : superbondsStatus90;
      let superbondsRate = pool == 30 ? superbondsRate30 : superbondsRate90;

      let toSend = bondYield > 0 ? bondValue*(1+trade_fee_USDC) : bondValueMaturity*(1+trade_fee_USDC);
      let superB_fee = pool == 30 ? transaction_fee_SuperB30 : transaction_fee_SuperB90;
      //console.log('toSend',toSend,'superB_fee',superB_fee,'adjustedLiquidity',adjustedLiquidity);
      if (bondValueMaturity-bondValue > tradeLiquidityAvailability * adjustedLiquidity){
        notify({
          message: 'Above Max Trade Limit',
          type: "error",
        });
        return;
      }
      if (toSend<=0){
        notify({
          message: 'Invalid Input',
          type: "error",
        });
        return;
      }

      //Check if user has enough balance
      if (USDCbalance < toSend)
      {
        notify({
          message: 'You dont have enough USDC',
          type: "error",
        });
        return;
      }
      if (SuperBbalance*(10**SUPERB_DECIMALS)  < superB_fee)
      {
        notify({
          message: 'You dont have enough SuperB to pay for transaction fee',
          type: "error",
        });
        return;
      }
      //Confirmation Message
      let Proceed = false;
      let Value_Message = bondYield > 0 ? bondValue : bondValueMaturity;
      let Fee_Message = bondYield > 0 ? bondValue*trade_fee_USDC : bondValueMaturity*trade_fee_USDC;
      // let message =
      // 'Pool: <strong>' + poolName + '</strong><br/>' +
      // 'Yield: <strong>' + bondYield + '%</strong><br/>'+
      // 'USDC Value: <strong>' + Value_Message.toFixed(3) + ' & fee: '+ Fee_Message.toFixed(3) + '</strong><br/>' +
      // 'SuperB fee: <strong>' + (superB_fee / (10**SUPERB_DECIMALS)).toFixed(3) + '</strong>';

      const message = `
      <div class="bg-gray-200 py-3 p-4 mt-3 sm:p-1 rounded-md">
        <div class="w-full p-4 rounded-md" style="background: linear-gradient(0deg, rgba(124, 250, 76, 0.2), rgba(124, 250, 76, 0.2)), rgb(31, 41, 51);">
          <table class="w-full">
            <tr>
              <th class="text-left">
                <span class="th_span">
                  Yield:</span>
              </th>
              <td class="text-right">
                <span class="td_span span_green">
                  ${superbondsStatus ? Math.floor(bondYield*superbondsRate*100)/100 : bondYield}%</span>
              </td>
            </tr>
          </table>
        </div>
        <div class="table2">
          <table class="w-full mt-2">
              <tr>
                <th class="text-left">
                  <span class="th_span small_font_td_span">
                    Pool:</span>
                </th>
                <td class="text-right">
                  <span class="td_span small_font_td_span">
                    ${poolName}</span>
                </td>
              </tr>
              <tr>
                <th class="text-left">
                  <span class="th_span small_font_td_span">
                    USDC Value: </span>
                </th>
                <td class="text-right">
                  <span class="td_span small_font_td_span">
                    ${Value_Message.toFixed(3)}</span>
                </td>
              </tr>
              <tr>
                <th class="text-left">
                  <span class="th_span small_font_td_span">
                    Fee: </span>
                </th>
                <td class="text-right">
                  <span class="td_span small_font_td_span">
                    ${Fee_Message.toFixed(3)} USDC</span>
                </td>
              </tr>
              <tr>
                <th class="text-left">
                  <span class="th_span small_font_td_span">
                    SB fee:</span>
                </th>
                <td class="text-right">
                  <span class="td_span small_font_td_span">
                    ${(superB_fee / (10**SUPERB_DECIMALS)).toFixed(3)}</span>
                </td>
              </tr>
          </table>
        </div>
      </div>
      `
      await Swal.fire({
        title: 'Trade Confirmation',
        html:message,
        showCancelButton: true,
        confirmButtonText: 'Trade',
        confirmButtonColor:'#7cfa4d'
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          Proceed = true;
          //console.log(Proceed);
        }
      })
      //console.log('here',Proceed);
      if (!Proceed) return;

      const NFT_Mint_account = new Account();
      //console.log('NFT_Mint_account',NFT_Mint_account.publicKey.toBase58());
      const createNFT_Mint_accountIx = SystemProgram.createAccount({
          programId: TOKEN_PROGRAM_ID,
          space: MintLayout.span,
          lamports: await connection.getMinimumBalanceForRentExemption(MintLayout.span, 'singleGossip'),
          fromPubkey: publicKey,
          newAccountPubkey: NFT_Mint_account.publicKey
      });
      const initNFT_TokenIx = Token.createInitMintInstruction(
        TOKEN_PROGRAM_ID,
        NFT_Mint_account.publicKey,
        0,
        publicKey,
        null);
      let nft_associated_token_account_address = await findAssociatedTokenAddress(publicKey,NFT_Mint_account.publicKey);
      //console.log('nft_associated_token_account_address',nft_associated_token_account_address.toBase58());

      let nft_associated_token_account_creationIx = Token.createAssociatedTokenAccountInstruction(
          SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
          TOKEN_PROGRAM_ID,
          NFT_Mint_account.publicKey,
          nft_associated_token_account_address,
          publicKey,
          publicKey
      );

      const Mint_one_NFT_Ix = Token.createMintToInstruction(
        TOKEN_PROGRAM_ID,
        NFT_Mint_account.publicKey,
        nft_associated_token_account_address,
        publicKey,
        [],
        1
      );

      const Disable_Mint_Ix = Token.createSetAuthorityInstruction(
        TOKEN_PROGRAM_ID,
        NFT_Mint_account.publicKey,
        null,
        'MintTokens',
        publicKey,
      []);

      //Create Trade State Account to save trade information
      const trade_state_account = new Account();
      //console.log('trade_state_account',trade_state_account.publicKey.toString());
      const createTradeStateAccountIx = SystemProgram.createAccount({
          programId: SUPERBONDS_PROGRAM_ID,
          space: TRADE_DATA_LAYOUT.span,
          lamports: await connection.getMinimumBalanceForRentExemption(TRADE_DATA_LAYOUT.span),
          fromPubkey: publicKey,
          newAccountPubkey: trade_state_account.publicKey
      });

      //Create new USDC token Account and transfer trade amount to it
      let usdc_associated_token_account_address = await findAssociatedTokenAddress(publicKey,USDC_MINT_ADDRESS);

      //let [USDC_PDA, USDC_nonce] = await PublicKey.findProgramAddress([USDC_traders_provided_ADDRESS.toBuffer()], BONDEX_PROGRAM);

      //Create new SuperB token Account and transfer fee amount to it
      let superB_associated_token_account_address = await findAssociatedTokenAddress(publicKey,SUPERB_MINT_ADDRESS);

      const buffers = [
        Buffer.from(Uint8Array.of(15, ...new Numberu64(Math.round(toSend * (10**USDC_DECIMALS))).toBuffer()))
      ];
      let datapool = pool == 30 ? data30pool : data90pool;
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
      //console.log('resp',resp);
      //return;
      let [SUPERBONDS_REWARD_PDA, SUPERBONDS_REWARD_NONCE] = await PublicKey.findProgramAddress([new PublicKey(datapool.SuperBonds_Rewards_Pool).toBuffer()], SUPERBONDS_PROGRAM_ID);

      const encodedStakingDataState = (await connection.getAccountInfo(PLATFORM_DATA_ACCOUNT, 'singleGossip'))!.data;
      const decodedStakingDataState = PLATFORM_DATA_LAYOUT.decode(encodedStakingDataState) as PlatformDataLayout;

      let [SuperB_pda_address,SuperB_pda_NONCE] = await PublicKey.findProgramAddress([new PublicKey(decodedStakingDataState.SuperB_Account).toBuffer()], SUPERBONDS_PROGRAM_ID);

      if (resp.length == 0){
        //console.log('Initializing Trader Data Account and Stake...');
        trader_Data_account = new Account();
        //console.log('trader_Data_account',trader_Data_account.publicKey.toBase58());
        const createTraderDataAccountIx = SystemProgram.createAccount({
            programId: SUPERBONDS_PROGRAM_ID,
            space: TRADER_LAYOUT.span,
            lamports: await connection.getMinimumBalanceForRentExemption(TRADER_LAYOUT.span),
            fromPubkey: publicKey,
            newAccountPubkey: trader_Data_account.publicKey
        });
        const TradeIx = new TransactionInstruction({
            programId: SUPERBONDS_PROGRAM_ID,
            keys: [
              { pubkey: PLATFORM_DATA_ACCOUNT, isSigner: false, isWritable: true },
              { pubkey: STAKING_DATA_ACCOUNT, isSigner: false, isWritable: true },
              { pubkey: pool_address, isSigner: false, isWritable: true },
              { pubkey: trader_Data_account.publicKey, isSigner: false, isWritable: true },
              { pubkey: publicKey, isSigner: true, isWritable: false },
              { pubkey: new PublicKey(decodedStakingDataState.SuperB_Account), isSigner: false, isWritable: true },
              { pubkey: trade_state_account.publicKey, isSigner: false, isWritable: true },
              { pubkey: usdc_associated_token_account_address, isSigner: false, isWritable: true },
              { pubkey: superB_associated_token_account_address, isSigner: false, isWritable: true },
              { pubkey: nft_associated_token_account_address, isSigner: false, isWritable: false },
              { pubkey: NFT_Mint_account.publicKey, isSigner: false, isWritable: false },
              { pubkey: new PublicKey(datapool.LP_Pool), isSigner: false, isWritable: true },
              { pubkey: new PublicKey(stakingPool.SuperB_Pool), isSigner: false, isWritable: true },
              { pubkey: new PublicKey(datapool.Traders_Pool), isSigner: false, isWritable: true },
              { pubkey: new PublicKey(datapool.SuperBonds_Rewards_Pool), isSigner: false, isWritable: true },
              { pubkey: new PublicKey(stakingPool.Treasury), isSigner: false, isWritable: true },
              { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
              { pubkey: SUPERB_MINT_ADDRESS, isSigner: false, isWritable: true},
              { pubkey: lp_token_mint_address, isSigner: false, isWritable: true},
              { pubkey: new PublicKey(SUPERBONDS_REWARD_PDA.toString()), isSigner: false, isWritable: false},
              { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false},
              { pubkey: SuperB_pda_address, isSigner: false, isWritable: true},
            ],
            data: Buffer.concat(buffers)
        });
        notify({
          message: 'Step 1: Creating accounts for the trade...',
          type: "success",
        });
        let txid1 = await sendTransaction(connection,wallet,
            [
              createNFT_Mint_accountIx,
              initNFT_TokenIx,
              nft_associated_token_account_creationIx,
              Mint_one_NFT_Ix,
              Disable_Mint_Ix,
              createTradeStateAccountIx,
              createTraderDataAccountIx
          ]
          ,[trade_state_account,NFT_Mint_account,trader_Data_account],false);

        if (!txid1){
          notify({
            message: 'Something wrong with your request!',
            type: "error",
          });
        }else{
          notify({
            message: 'Step 2: Creating the trade ...',
            type: "success",
          });
          let txid2 = await sendTransaction(connection,wallet,
              [
                TradeIx
              ]
            ,[trade_state_account,NFT_Mint_account,trader_Data_account],false);
          if (!txid1){
            notify({
              message: 'Something wrong with your request!',
              type: "error",
            });
          }else{
            notify({
              message: 'Added Trade successfully',
              type: "success",
            });
            await delay(2000);
            readPoolData_30();
            readPoolData_90();
            getStakingPoolData();
            //onShowAllTrades(2);
            await delay(2000);
            fetchPrivateAPI(10,0);
            fetchPublicAPI(10,0);
            setOffset(0)
          }
        }
      }
      else{

        const TradeIx = new TransactionInstruction({
            programId: SUPERBONDS_PROGRAM_ID,
            keys: [
              { pubkey: PLATFORM_DATA_ACCOUNT, isSigner: false, isWritable: true },
              { pubkey: STAKING_DATA_ACCOUNT, isSigner: false, isWritable: true },
              { pubkey: pool_address, isSigner: false, isWritable: true },
              { pubkey: resp[0].pubkey, isSigner: false, isWritable: true },
              { pubkey: publicKey, isSigner: true, isWritable: false },
              { pubkey: new PublicKey(decodedStakingDataState.SuperB_Account), isSigner: false, isWritable: true },
              { pubkey: trade_state_account.publicKey, isSigner: false, isWritable: true },
              { pubkey: usdc_associated_token_account_address, isSigner: false, isWritable: true },
              { pubkey: superB_associated_token_account_address, isSigner: false, isWritable: true },
              { pubkey: nft_associated_token_account_address, isSigner: false, isWritable: false },
              { pubkey: NFT_Mint_account.publicKey, isSigner: false, isWritable: false },
              { pubkey: new PublicKey(datapool.LP_Pool), isSigner: false, isWritable: true },
              { pubkey: new PublicKey(stakingPool.SuperB_Pool), isSigner: false, isWritable: true },
              { pubkey: new PublicKey(datapool.Traders_Pool), isSigner: false, isWritable: true },
              { pubkey: new PublicKey(datapool.SuperBonds_Rewards_Pool), isSigner: false, isWritable: true },
              { pubkey: new PublicKey(stakingPool.Treasury), isSigner: false, isWritable: true },
              { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
              { pubkey: SUPERB_MINT_ADDRESS, isSigner: false, isWritable: true},
              { pubkey: lp_token_mint_address, isSigner: false, isWritable: true},
              { pubkey: new PublicKey(SUPERBONDS_REWARD_PDA.toString()), isSigner: false, isWritable: false},
              { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false},
              { pubkey: SuperB_pda_address, isSigner: false, isWritable: true},
            ],
            data: Buffer.concat(buffers)
        });
        notify({
          message: 'Step 1: Creating accounts for the trade...',
          type: "success",
        });
        let txid1 = await sendTransaction(connection,wallet,
            [
              createNFT_Mint_accountIx,
              initNFT_TokenIx,
              nft_associated_token_account_creationIx,
              Mint_one_NFT_Ix,
              Disable_Mint_Ix,
              createTradeStateAccountIx
          ]
          ,[trade_state_account,NFT_Mint_account],false);

        if (!txid1){
          notify({
            message: 'Something wrong with your request!',
            type: "error",
          });
        }else{
          notify({
            message: 'Step 2: Creating the trade ...',
            type: "success",
          });
          let txid2 = await sendTransaction(connection,wallet,
              [
                TradeIx
              ]
            ,[trade_state_account,NFT_Mint_account],false);
          if (!txid1){
            notify({
              message: 'Something wrong with your request!',
              type: "error",
            });
          }else{
            notify({
              message: 'New trade request sent successfully',
              type: "success",
            });
            await delay(2000);
            readPoolData_30();
            readPoolData_90();
            getStakingPoolData();
            //onShowAllTrades(2);
            await delay(2000);
            fetchPublicAPI(10,0);
            fetchPrivateAPI(10,0);
            setOffset(0);
            getAllBalances();
          }
        }

      }
    };

    const fetchPublicAPI=async (limit:Number,offset:Number)=>{
      //Get All Trades
      try {
        const data = {limit,offset};
        const response:AxiosResponse<any> = await axios.post('https://api.superbonds.finance/getAllTrades',data);
        if(response.data.trades.length===0 && offset>0) {
          fetchPublicAPI(10,0)
          setOffset(0)
          return;
        }
        setAllTradeData(response?.data?.trades);
      } catch (error) {
        console.error(error);
      }
      //Get All Pending Redemptions
      // try {
      //   const data = {limit,offset};;
      //   const response:AxiosResponse<any> = await axios.post('https://api.superbonds.finance/getAllPendings',data);

      // } catch (error) {
      //   console.error(error);
      // }
    }

    const fetchPrivateAPI=async (limit:Number,offset:Number)=>{
      let publicKey = wallet.publicKey;
      if(publicKey){
        if(showAllTrade===2){
          try {
            const data = {limit,offset,trade_owner:publicKey.toString()};
            const response:AxiosResponse<any> = await axios.post('https://api.superbonds.finance/getTrades',data);
            if(response.data.trades.length===0 && offset>0) {
              fetchPrivateAPI(10,0)
              setOffset(0)
              return;
            }
            setMyTradeData(response?.data?.trades)

          } catch (error) {
            console.error(error);
          }
        }

        //Get My Pendings
        if(showAllTrade===3){
          try {
            const data = {limit,offset,owner:publicKey.toString()};
            const response:AxiosResponse<any> = await axios.post('https://api.superbonds.finance/getPendings',data);
            if(response.data.pendings.length===0 && offset>0) {
              fetchPrivateAPI(10,0);
              setOffset(0)
              return;
            }
            setMyPendingData(response?.data?.pendings)

          } catch (error) {
            console.error(error);
          }
        }
      }
    }


    useEffect(()=>{
      let publicKey = wallet.publicKey;
      if(wallet && publicKey) fetchPrivateAPI(10,0)
    },[wallet])

    useEffect(()=>{
      fetchPublicAPI(10,0);
      fetchPrivateAPI(10,0);
    },[showAllTrade])

    useInterval(() => {
      let publicKey = wallet.publicKey;
      if(wallet && publicKey){
        superBondsProcess();
      }
    }, 1000);


    const onSettle = async (pool:any,owner:any,usdc_account:any,data_account:any,amount:number) =>{
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
      let SOL_balance = await connection.getBalance(publicKey)/(10**9);
      if (SOL_balance <= 0.001){
        notify({
          message: 'You have low Sol balance',
          type: "info",
        });
        return;
      }
      if (!data30pool || !data90pool){
        notify({
          message: 'Please connect to Solana network',
          type: "error",
        });
        return;
      }
      //console.log(pool,POOL_30_ADDRESS,POOL_90_ADDRESS);

      const encodedPoolDataState = (await connection.getAccountInfo(new PublicKey(pool), 'singleGossip'))!.data;
      const decodedPoolDataState = POOL_DATA_LAYOUT.decode(encodedPoolDataState) as PoolDataLayout;

      if (pool == POOL_30_ADDRESS){
        const encodeTraders_Pool_Account_ADDRESS = (await connection.getAccountInfo(new PublicKey(data30pool.Traders_Pool), 'singleGossip'))!.data;
        const decodedTraders_Pool_Account = AccountLayout.decode(encodeTraders_Pool_Account_ADDRESS);
        let Traders_Pool_Balance = new BN(decodedTraders_Pool_Account.amount, 10, "le").toNumber() / (10**USDC_DECIMALS);
        if (Traders_Pool_Balance < amount){
          notify({
            message: 'Please try again later',
            type: "error",
          });
          return;
        }

      }
      else if (pool == POOL_90_ADDRESS){
        const encodeTraders_Pool_Account_ADDRESS = (await connection.getAccountInfo(new PublicKey(data90pool.Traders_Pool), 'singleGossip'))!.data;
        const decodedTraders_Pool_Account = AccountLayout.decode(encodeTraders_Pool_Account_ADDRESS);
        let Traders_Pool_Balance = new BN(decodedTraders_Pool_Account.amount, 10, "le").toNumber() / (10**USDC_DECIMALS);
        if (Traders_Pool_Balance < amount){
          notify({
            message: 'Please try again later',
            type: "error",
          });
          return;
        }
      }
      //Settle

      const buffers = [
        Buffer.from(Uint8Array.of(39))
      ];
      let [TRADER_POOL_TOKEN_PDA, TRADER_POOL_TOKEN_NONCE] = await PublicKey.findProgramAddress([new PublicKey(decodedPoolDataState.Traders_Pool).toBuffer()], SUPERBONDS_PROGRAM_ID);
      const settleIx = new TransactionInstruction({
          programId: SUPERBONDS_PROGRAM_ID,
          keys: [
            { pubkey: new PublicKey(pool), isSigner: false, isWritable: false },
            { pubkey: new PublicKey(data_account), isSigner: false, isWritable: true },
            { pubkey: new PublicKey(owner), isSigner: false, isWritable: true },
            { pubkey: new PublicKey(usdc_account), isSigner: false, isWritable: true },
            { pubkey: new PublicKey(TRADER_POOL_TOKEN_PDA.toString()), isSigner: false, isWritable: false},
            { pubkey: new PublicKey(decodedPoolDataState.Traders_Pool), isSigner: false, isWritable: true},
            { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false }
          ],
          data: Buffer.concat(buffers)
      });
      let txid = await sendTransaction(connection,wallet,
          [
            settleIx
        ]
        ,[],false);

      if (!txid){
        notify({
          message: 'Something wrong with your request!',
          type: "error",
        });
      }else{
        notify({
          message: 'Settle Request Sent',
          type: "success",
        });
        await delay(2000);
      }
    }

    const superBondsProcess = () =>{
      if (data30pool){
        if (data30pool.is_superbonds_time){
          if (SuperBonds_Rewards_Pool_30_Balance <= 1){
            setsuperBonds_status30('INACTIVE');
            if (superbondsStatus30){
              setSuperBondsStatus30(false);
              setSuperBondsRate30(1);
            }
          }
          else{
            setsuperBonds_status30('ACTIVE');
            if (!superbondsStatus30){
              setSuperBondsStatus30(true);
            }
            let bondValue = bondValueMaturity_30 / ((1 + (bond_yield30/100))**(30/365));

            let BV_before_SB = bondValueMaturity_30;
            let BV_after_SB = bondValue * ((1 + (data30pool.superBonds_rate * bond_yield30/10000))**(30/365));
            let diff = BV_after_SB - BV_before_SB;
            let superbonds_rate = 1;
            if (diff > SuperBonds_Rewards_Pool_30_Balance / 10) {
                //find yield at max rate
                let max_BV_at_maturity = BV_before_SB + SuperBonds_Rewards_Pool_30_Balance / 10;
                let YpowerX = max_BV_at_maturity / bondValue;
                //ln(y^x) = x ln (y)
                let lny = Math.log(YpowerX) / (30.0/365.0);
                //e^lny = y
                superbonds_rate = ((Math.pow(Math.E,lny) - 1) * 100) / bond_yield30;
            }
            else if (diff >0) {
                superbonds_rate = data30pool.superBonds_rate/100;
            }
            //console.log('superbonds_rate',superbonds_rate);
            setSuperBondsRate30(superbonds_rate);

            bondValue = bondValueMaturity_30 / ((1 + (superbonds_rate*bond_yield30/100))**(30/365))
            setBondValue_30(bondValue);
          }

        }
        else setsuperBonds_status30('INACTIVE');

      }
      if (data90pool){
        if (data90pool.is_superbonds_time){
          if (SuperBonds_Rewards_Pool_90_Balance <= 1){
            setsuperBonds_status90('INACTIVE');
            if (superbondsStatus90){
              setSuperBondsStatus90(false);
              setSuperBondsRate90(1);
            }
          }
          else{
            setsuperBonds_status90('ACTIVE');
            if (!superbondsStatus90){
              setSuperBondsStatus90(true);
            }
            let bondValue = bondValueMaturity_90 / ((1 + (bond_yield90/100))**(90/365));

            let BV_before_SB = bondValueMaturity_90;
            let BV_after_SB = bondValue * ((1 + (data90pool.superBonds_rate * bond_yield90/10000))**(90/365));
            let diff = BV_after_SB - BV_before_SB;
            let superbonds_rate = 1;
            if (diff > SuperBonds_Rewards_Pool_90_Balance / 10) {
                //find yield at max rate
                let max_BV_at_maturity = BV_before_SB + SuperBonds_Rewards_Pool_90_Balance / 10;
                let YpowerX = max_BV_at_maturity / bondValue;
                //ln(y^x) = x ln (y)
                let lny = Math.log(YpowerX) / (90.0/365.0);
                //e^lny = y
                superbonds_rate = ((Math.pow(Math.E,lny) - 1) * 100) / bond_yield90;
            }
            else if (diff >0) {
                superbonds_rate = data90pool.superBonds_rate/100;
            }
            //console.log('superbonds_rate',superbonds_rate);
            setSuperBondsRate90(superbonds_rate);
            bondValue = bondValueMaturity_90 / ((1 + (superbonds_rate*bond_yield90/100))**(90/365))
            setBondValue_90(bondValue);
          }

        }
        else setsuperBonds_status90('INACTIVE');
      }


    }
    const handlePagination=(limit:number,x_paginationcursor:number)=>{
     // console.log(offset)
      if(x_paginationcursor>0) {
        setOffset(offset+x_paginationcursor);
        showAllTrade==1?fetchPublicAPI(limit,offset+x_paginationcursor):fetchPrivateAPI(limit,offset+x_paginationcursor);
      }
      else if(x_paginationcursor<0 && offset+x_paginationcursor>(-1)) {
        setOffset(offset+x_paginationcursor);
        showAllTrade==1?fetchPublicAPI(limit,offset+x_paginationcursor):fetchPrivateAPI(limit,offset+x_paginationcursor);
      }
      else{
        console.log("aasasas")
         setOffset(offset+0);
         showAllTrade==1?fetchPublicAPI(limit,x_paginationcursor):fetchPrivateAPI(limit,x_paginationcursor);
        }     
   }

  const findTradeUnit=(yld:number,day:number)=>{
    const powPart2=day/365;
    const powPart1=1+(yld/100);
    const denominator=Math.pow(powPart1,powPart2)
    const result=1000/denominator;

    return 1000-result;
  }

    return (
        <div className="w-screen h-screen bg-black">
            <div  className="w-9/12 my-0 mx-auto pt-20 2xl:w-9/12 lg:w-11/12 xl:w-10/12 min-xxl:w-7/12  max-2xl:w-8/12">
                <div className='flex flex-col' >
                    <HeaderCard
                      text='Trade'
                      USDCbalance={USDCbalance}
                      SuperBbalance={SuperBbalance}
                      divStyle=''
                    />
                    <div className='flex pt-6 justify-center md:flex-wrap'>
                        <div className={`flex w-6/12 md:w-full flex-col bg-gray-300 py-7 px-7 rounded-md sm:py-3 sm:px-2  ${superBonds_status30 ==='ACTIVE'?'box':'neon-bottom-card selected-box-neon'}` }>

                          <div className="text-center select-none">
                            <Text weight={'true'} size ={"16px"} transform={"true"} color={"#7CFA4C"} style={{ fontFamily:"Archivo"}}>30-day pool</Text>
                          </div>

                          <div className="grid grid-cols-3 gap-2 mt-3 rounded-md" style={{height:'152px'}}>
                            <div className="flex flex-col items-center text-center justify-center">
                              {superBonds_status30 ==='ACTIVE' && <Text   size='20px' weight color='#7CFA4C' className="blink-text select-none">SuperBonds Active</Text>}
                              {superBonds_status30 ==='INACTIVE' && <Text className='select-none' size='20px' weight color='#7CFA4C'>SuperBonds Inactive</Text>}
                            </div>

                            <div className="flex flex-col items-center">
                              {superBonds_status30 ==='ACTIVE' &&
                                <div className="flex flex-col text-center bg-no-repeat bg-center justify-center" style={{wordWrap:'break-word', width:'100%', height:'147px',backgroundSize:'cover',backgroundImage: `url(${'https://res.cloudinary.com/drr1rnoxf/image/upload/v1639999845/Polygon_9_h2mqxc.png'})`}}>
                                  <Text className='w-9/12 mx-auto px-2' size='12px' weight='600' color='#7CFA4C'>{(SuperBonds_Rewards_Pool_30_Balance).toFixed(2)} USDC</Text>
                                </div>
                              }
                              {superBonds_status30 ==='INACTIVE' &&
                               <div className="flex flex-col text-center bg-no-repeat mt-3 bg-center justify-center" style={{wordWrap:'break-word', width:'100%', height:'127px',backgroundSize:'contain', backgroundImage: `url(${'https://res.cloudinary.com/drr1rnoxf/image/upload/v1640187604/Polygon_9_1_qkkbl1.png'})`}}>
                                 <Text className='w-9/12 mx-auto px-2' size='12px' weight='600' color={'#7CFA4C'}>{(SuperBonds_Rewards_Pool_30_Balance).toFixed(2)} USDC</Text>
                               </div>}
                            </div>

                            <div className="flex flex-col items-center justify-center">
                              <Text opacity='0.7' size='16px'>Pool Value</Text>
                              <Text className='mt-1' size='19px' weight='600' color='white'>{(SuperBonds_Rewards_Pool_30_Balance).toFixed(2)}</Text>
                              <Text size='12px' opacity='0.7'>USDC</Text>
                            </div>
                          </div>

                            <div className="bg-gray-200 py-3 p-4 sm:p-1 mt-5 rounded-md">
                                <div className="w-full p-4 rounded-md" style={{"background":'linear-gradient(0deg, rgba(124, 250, 76, 0.2), rgba(124, 250, 76, 0.2)), #1F2933'}}>
                                    <table className="w-full">
                                        <tr>
                                            <th className="float-left"><Text opacity={"0.75"} >Annualized Yield:</Text></th>
                                            <td  className="float-right"><Text size={"19px"} color={"#9CF61C"}><span style={{color: bond_yield30>=0 ? "#9CF61C" : "red"}}><strong>{superbondsStatus30 ? Math.floor(bond_yield30*superbondsRate30*100)/100 : bond_yield30}%</strong></span></Text></td>
                                        </tr>
                                        <tr>
                                            <th className="float-left">  <Text opacity={"0.75"}>Days to Maturity:</Text></th>
                                            <td className="float-right" ><Text className='mr-4' size={"19px"}color={'white'}>30</Text></td>
                                        </tr>
                                    </table>
                                </div>
                                <div className="w-full p-4 rounded-md">
                                    <table className="w-full">
                                        <tr>
                                            <th className="float-left"><Text opacity={"50%"} >Max Trade:</Text></th>
                                            <td className="float-right"><Text size='15px'>{bond_yield30 ?formatNumberWithoutRounding.format((adjustedLiquidity30 * tradeLiquidityAvailability30)/findTradeUnit((superbondsStatus30 ? Math.floor(bond_yield30*superbondsRate30*100)/100 : bond_yield30),30)):"0.00"}</Text><Text className='ml-1' size='12px'>UNITS</Text></td>
                                        </tr>
                                        <tr>
                                            <th className="float-left">  <Text opacity={"0.5"}>Bond Value at Entrance:</Text></th>
                                            <td className="float-right"><Text size='15px'>{formatNumberWithoutRounding.format(bondValue_30)}</Text><Text className='ml-1' size='12px'>USDC</Text></td>
                                        </tr>
                                        <tr>
                                            <th className="float-left"><Text opacity={"0.5"}>Bond Value at Maturity:</Text></th>
                                            <td className="float-right"><Text size='15px'>{formatNumberWithoutRounding.format(bondValueMaturity_30)}</Text></td>
                                        </tr>
                                    </table>
                                </div>

                            </div>

                            <div className=" bg-gray-200 py-3 px-3 border rounded-md mt-3 align-middle">
                              <div className='grid grid-cols-3 gap-2'>
                                <div className="flex flex-col">
                                  <Text size='15px' weight className="" opacity={"0.5"}>Par Units</Text>
                                  <Text size='12px' className="" opacity={"0.5"}>1 Unit=1000 USDC</Text>
                                </div>
                                <div className="col-span-2">
                                  <input
                                  maxLength={20}
                                  onKeyDown={numOnly}
                                  onKeyPress={noSpecial}
                                  type='tel'
                                  value={lq_amount30}
                                  onChange={onChangePar_value_30}
                                  className="w-full py-2 px-2 h-10 float-right rounded-md bg-gray-400
                                  focus:outline-none ring-2 ring-green-100 border-transparent placeholder-green-100" placeholder="Enter Amount" />
                                </div>

                              </div>

                            </div>
                            {/* <Text opacity="0.5">*Max Interest: {numberFormatter.format(adjustedLiquidity30 * tradeLiquidityAvailability30)}</Text> */}

                            <div>
                                <button className="rounded-sm mt-4 text-center bg-green-100 py-2 w-full  transform transition hover:scale-105"  onClick={()=>onTrade(30)}>
                                    <Text color={"#000000"} weight='true'>BUY</Text>
                                </button>
                            </div>
                        </div>

                        <div className={`flex w-6/12 md:w-full md:mt-3 flex-col bg-gray-300 py-7 px-7 ml-4 rounded-md   md:ml-0 sm:py-3 sm:px-2  ${superBonds_status90 ==='ACTIVE'?'box':'neon-bottom-card selected-box-neon'}`}>
                            <div className="text-center select-none">
                                <Text weight={'true'} size ={"16px"} transform={"true"} color={"#7CFA4C"}>90-day pool</Text>
                            </div>


                            <div className="grid grid-cols-3 gap-2 mt-3 rounded-md" style={{height:'152px'}}>
                              <div className="flex flex-col items-center text-center justify-center">
                                {superBonds_status90 ==='ACTIVE' && <Text size='20px' weight color='#7CFA4C' className="blink-text select-none">SuperBonds Active</Text>}
                                {superBonds_status90 ==='INACTIVE' && <Text size='20px' className='select-none' weight color='#7CFA4C'>SuperBonds Inactive</Text>}
                              </div>

                              <div className="flex flex-col items-center">
                                {superBonds_status90 ==='ACTIVE' &&
                                  <div className="flex flex-col text-center bg-no-repeat bg-center justify-center" style={{wordWrap:'break-word', width:'100%', height:'147px',backgroundSize:'cover',backgroundImage: `url(${'https://res.cloudinary.com/drr1rnoxf/image/upload/v1639999845/Polygon_9_h2mqxc.png'})`}}>
                                    <Text className='w-9/12 mx-auto px-2' size='12px' weight='600' color='#7CFA4C'>{(SuperBonds_Rewards_Pool_90_Balance).toFixed(2)} USDC</Text>
                                  </div>
                                }
                                {superBonds_status90 ==='INACTIVE' &&
                                <div className="flex flex-col text-center bg-no-repeat mt-3 bg-center justify-center" style={{wordWrap:'break-word', width:'100%', height:'127px',backgroundSize:'contain', backgroundImage: `url(${'https://res.cloudinary.com/drr1rnoxf/image/upload/v1640187604/Polygon_9_1_qkkbl1.png'})`}}>
                                  <Text className='w-9/12 mx-auto px-2' size='12px' weight='600' color={'#7CFA4C'}>{(SuperBonds_Rewards_Pool_90_Balance).toFixed(2)} USDC</Text>
                                </div>}
                              </div>

                              <div className="flex flex-col items-center justify-center">
                                <Text opacity='0.7' size='16px'>Pool Value</Text>
                                <Text className='mt-1' size='19px' weight='600' color='white'>{(SuperBonds_Rewards_Pool_90_Balance).toFixed(2)}</Text>
                                <Text size='12px' opacity='0.7'>USDC</Text>
                              </div>
                            </div>


                            <div className="bg-gray-200 py-3 p-4  sm:p-1 mt-5 rounded-md">
                                <div className="w-full p-4 rounded-md" style={{"background":'linear-gradient(0deg, rgba(124, 250, 76, 0.2), rgba(124, 250, 76, 0.2)), #1F2933'}}>
                                    <table className="w-full">
                                        <tr>
                                            <th className="float-left"><Text opacity={"0.75"} >Annualized Yield:</Text></th>
                                            <td  className="float-right"><Text size={"19px"} color={"#9CF61C"}><span style={{color: bond_yield90>=0 ? "#9CF61C" : "red"}}><strong>{superbondsStatus90 ? Math.floor(bond_yield90*superbondsRate90*100)/100 : bond_yield90}%</strong></span></Text></td>
                                        </tr>
                                        <tr>
                                            <th className="float-left">  <Text opacity={"0.75"}>Days to Maturity:</Text></th>
                                            <td className="float-right" ><Text className='mr-4' size={"19px"}color={'white'}>90</Text></td>
                                        </tr>
                                    </table>
                                </div>
                                <div className="w-full p-4 rounded-md">
                                    <table className="w-full">
                                        <tr>
                                            <th className="float-left"><Text opacity={"50%"} >Max Trade:</Text></th>
                                            <td className="float-right"><Text size='15px'>{bond_yield90 ?formatNumberWithoutRounding.format((adjustedLiquidity90 * tradeLiquidityAvailability90)/findTradeUnit((superbondsStatus90 ? Math.floor(bond_yield90*superbondsRate90*100)/100 : bond_yield90),90)):"0.00"}</Text><Text className='ml-1' size='12px'>UNITS</Text></td>
                                        </tr>
                                        <tr>
                                            <th className="float-left">  <Text opacity={"0.5"}>Bond Value at Entrance:</Text></th>
                                            <td className="float-right"><Text size='15px'>{formatNumberWithoutRounding.format(bondValue_90)}</Text><Text className='ml-1' size='12px'>USDC</Text></td>
                                        </tr>
                                        <tr>
                                            <th className="float-left"><Text opacity={"0.5"}>Bond Value at Maturity:</Text></th>
                                            <td className="float-right"><Text size='15px'>{formatNumberWithoutRounding.format(bondValueMaturity_90)}</Text></td>
                                        </tr>
                                    </table>
                                </div>

                            </div>

                            <div className=" bg-gray-200 py-3 px-3 border rounded-md mt-3 align-middle">
                              <div className='grid grid-cols-3 gap-2'>
                                <div className="flex flex-col">
                                  <Text  size='15px' weight className="" opacity={"0.5"}>Par Units</Text>
                                  <Text size='12px' className="" opacity={"0.5"}>1 Unit=1000 USDC</Text>
                                </div>
                                <div className="col-span-2">
                                  <input maxLength={20}
                                    onKeyDown={numOnly}
                                    onKeyPress={noSpecial}
                                    type='tel'
                                    value={lq_amount90}
                                    onChange={onChangePar_value_90} className="w-full py-2 px-2 h-10 float-right rounded-md bg-gray-400
                                  focus:outline-none ring-2 ring-green-100 border-transparent placeholder-green-100" placeholder="Enter Amount" />
                                </div>
                              </div>
                            </div>
                            {/* <Text opacity="0.5">*Max Interest:{numberFormatter.format(adjustedLiquidity90 * tradeLiquidityAvailability90)}</Text> */}

                            <div>
                                <button className="rounded-sm mt-4 text-center bg-green-100 py-2 w-full transform transition hover:scale-105" onClick={()=>onTrade(90)}>
                                    <Text color={"#000000"} weight='true'>BUY</Text>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-11/12 my-0 mx-auto pb-5 pt-20 xxl:flex xxl:flex-col xxl:items-center">
                <div className="mt-2">
                  <div className="pb-3 flex justify-between">
                    <div>
                      <Text className={"cursor-pointer ml-2 py-1 " + (showAllTrade == 2? 'border-b-2 border-green-100' : '')} transform  size='14px' onClick={()=>onShowAllTrades(2)}>MY Trades</Text>
                      <Text className={"cursor-pointer ml-2 py-1 " + (showAllTrade == 3? 'border-b-2 border-green-100' : '')} transform  size='14px' onClick={()=>onShowAllTrades(3)}>MY Pending Redemptions</Text>
                      <Text className={"cursor-pointer ml-2 py-1 " + (showAllTrade == 1? 'border-b-2 border-green-100' : '')} transform size='14px' onClick={()=>onShowAllTrades(1)}>Recent Trades</Text>
                    </div>
                    <div>
                      <div className="bg-gray-300 items-center align-middle py-2 px-5 rounded-md">
                      <i onClick={()=>handlePagination(10,offset>0?-10:0)}  className="fas fa-chevron-left mr-4 inline-block cursor-pointer text-green-100 transform transition hover:scale-150"></i>
                       <i onClick={()=>handlePagination(10,10)} className="fas fa-chevron-right inline-block ml-4 cursor-pointer text-green-100  transform transition hover:scale-150"></i>
                        {/* <img src={left} alt="prev" className="inline-block mr-4 cursor-pointer" />  */}
                        {/* <img src={right} alt="next" onClick={()=>handlePagination(10,10)} className="ml-4 inline-block cursor-pointer" /> */}
                      </div>
                    </div>
                  </div>
                  {showAllTrade==2 &&
                    <TradeTableComponent
                      tradeType='my_trade'
                      data={myTradeData}
                      onSettle={onSettle}
                    />
                   }
                  {showAllTrade==1 &&
                    <TradeTableComponent
                      tradeType='all_trade'
                      data={allTradeData}
                      onSettle={onSettle}
                    />
                   }
                  {showAllTrade==3 &&
                    <TradeTableComponent
                      tradeType='my_pending_trade'
                      data={myPendingData}
                      onSettle={onSettle}
                    />
                  }
                     
                </div>
            </div>
            <GlobalStyle maxWidth='400px' />
        </div>
    )
}
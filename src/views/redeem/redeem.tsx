/* eslint-disable eqeqeq */
/* eslint-disable react/jsx-no-target-blank */
import { Button, Col, Row, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useParams,useHistory } from "react-router-dom";
import { notify } from "../../utils/notifications";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection,sendTransaction } from "../../contexts/connection";
import { SUPERBONDS_PROGRAM_ID,
         USDC_MINT_ADDRESS,
         SUPERB_MINT_ADDRESS,
         POOL_30_ADDRESS,
         USDC_DECIMALS,
         SUPERB_DECIMALS,
         PLATFORM_DATA_ACCOUNT,
       } from "../../utils/ids";
import { findAssociatedTokenAddress } from "../../contexts/accounts";
import { useUserBalance } from "../../hooks";
import {POOL_DATA_LAYOUT,PoolDataLayout} from "../../utils/pool_data_layout";
import {TRADE_DATA_LAYOUT} from "../../utils/trade_data_layout";
import {PLATFORM_DATA_LAYOUT,PlatformDataLayout} from "../../utils/platform_data_layout";
import BN from "bn.js";
import { truncateStr,convertTimeStamp,delay } from "../../utils/utils";
import {
  PublicKey,
  SYSVAR_RENT_PUBKEY,
  TransactionInstruction,
} from '@solana/web3.js';
import {  AccountLayout,
          Token,
          TOKEN_PROGRAM_ID,
 } from "@solana/spl-token";
import Swal from 'sweetalert2';

interface ParamTypes {
  trade_account: string
}

export const RedeemView = () => {
  const connection = useConnection();
  const wallet = useWallet();
  const { trade_account } = useParams<ParamTypes>();
    const history = useHistory();

  const USDC = useUserBalance(USDC_MINT_ADDRESS);
  const SUPERB = useUserBalance(SUPERB_MINT_ADDRESS);

  const [Trade_columns] = useState([
      {
        title: 'Pool',
        dataIndex: 'pool',
        key: 'pool'
      },
      {
        title: 'Owner',
        dataIndex: 'owner',
        key: 'owner',
        render: (text:any) => <a target="_blank" href={"https://explorer.solana.com/address/"+text+"?cluster=devnet"}>{truncateStr(text,5)}</a>
      },
      {
        title: 'NFT',
        dataIndex: 'nft',
        key: 'nft',
        render: (text:any) => <a target="_blank" href={"https://explorer.solana.com/address/"+text+"?cluster=devnet"}>{truncateStr(text,5)}</a>
      },
      {
        title: 'Trade Account',
        dataIndex: 'trade_account',
        key: 'trade_account',
        render: (text:any) => <a href={"#/redeem/"+text}>{truncateStr(text,5)}</a>
      },
      {
        title: 'Type',
        dataIndex: 'trade_type',
        key: 'trade_type',
      },
      {
        title: 'Yield',
        dataIndex: 'yield',
        key: 'yield',
        render: (text:any) => parseFloat(text) < 0 ? <span style={{color:"red"}}>{parseFloat(text).toFixed(2)}%</span> : <span style={{color:"green"}}>{parseFloat(text).toFixed(2)}%</span>
      },
      {
        title: 'Issued at',
        dataIndex: 'issued_at',
        key: 'issued_at',
        render: (text:any) => convertTimeStamp(text)
      },
      {
        title: 'Maturity',
        dataIndex: 'maturity_at',
        key: 'maturity_at',
        render: (text:any) => convertTimeStamp(text)
      },
      {
        title: 'Bond Value at Entrance',
        dataIndex: 'bond_value',
        key: 'bond_value',
        render: (text:any) => parseFloat(text).toFixed(1)
      },
      {
        title: 'Bond Value at Maturity',
        dataIndex: 'bond_value_maturity',
        key: 'bond_value_maturity',
        render: (text:any) => parseFloat(text).toFixed(1)
      },
      {
        title: 'Current Bond Value',
        dataIndex: 'current_bond_value',
        key: 'current_bond_value',
        render: (text:any) => parseFloat(text).toFixed(1)
      },
      {
        title: 'Profit at Maturity',
        dataIndex: 'profit_loss_maturity',
        key: 'profit_loss_maturity',
        render: (text:any) => parseFloat(text) < 0 ? <span style={{color:"red"}}>{parseFloat(text).toFixed(1)}</span> : <span style={{color:"green"}}>{parseFloat(text).toFixed(1)}</span>
      },
      {
        title: 'Current Profit',
        dataIndex: 'current_profit_loss',
        key: 'current_profit_loss',
        render: (text:any) => parseFloat(text) < 0 ? <span style={{color:"red"}}>{parseFloat(text).toFixed(1)}</span> : <span style={{color:"green"}}>{parseFloat(text).toFixed(1)}</span>
      }

  ]);
  const [Trade_dataSource,setTrade_dataSource] = useState<any>([]);

  // const [bond_yield,setBond_Yield] = useState(0);
  const [isMyTrade,setIsMytrade] = useState(false);
  const [tradeData,setTradeData] = useState<any>(null);
  useEffect(() => {
    if (!wallet.publicKey) return;
    console.log('Here');
    onShowTradeInformation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet]);
  const onShowTradeInformation = async () => {
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
    let trade_data_info = (await connection.getAccountInfo(new PublicKey(trade_account), 'singleGossip'));
    if (!trade_data_info) {
      notify({
        message: 'Cannot retrieve Trade Account',
        type: "error",
      });
      return;
    }
    const encodedTradeDataState = trade_data_info.data;
    const decodedTradeDataState = TRADE_DATA_LAYOUT.decode(encodedTradeDataState);
    console.log(decodedTradeDataState);
    setTradeData(decodedTradeDataState);

    const NFT_info = await connection.getAccountInfo(decodedTradeDataState.NFT);
    if (!NFT_info) return;
    const NFT_data = AccountLayout.decode(NFT_info.data);
    let pool = decodedTradeDataState.pool;
    let owner = new PublicKey(NFT_data.owner);
    if (owner.toBase58() == publicKey.toBase58()) setIsMytrade(true);

    let entrance_yield = decodedTradeDataState.bond_yield/10000;

    let bond_value = new BN(decodedTradeDataState.bond_value, 10, "le").toNumber()/(10**USDC_DECIMALS);
    let Bond_at_maturity = new BN(decodedTradeDataState.bond_value_at_maturity, 10, "le").toNumber()/(10**USDC_DECIMALS);

    var maturity_at = 1000* new BN(decodedTradeDataState.maturity_date, 10, "le").toNumber();
    var now = new Date();
    const diffDays = Math.round(Math.abs((maturity_at - now.getTime()) / (1000)));
    console.log(maturity_at,now,diffDays);
    let current_bond_value = 0;
    if (diffDays<0) current_bond_value = Bond_at_maturity;
    else
      current_bond_value = Bond_at_maturity / ((1 + entrance_yield)**(diffDays/(365*24*60*60)));
    let tableData:any[] = [];
    tableData.push(
      {
        key: 0,
        pool: pool.toBase58() == POOL_30_ADDRESS.toBase58() ? "30-day" : "90-day",
        nft: decodedTradeDataState.NFT.toBase58(),
        owner: owner.toBase58(),
        trade_type: "LONG",
        trade_account: trade_account,
        yield: entrance_yield * 100,
        issued_at: 1000* new BN(decodedTradeDataState.issued_date, 10, "le").toNumber(),
        maturity_at:1000* new BN(decodedTradeDataState.maturity_date, 10, "le").toNumber(),
        bond_value: bond_value,
        bond_value_maturity: Bond_at_maturity,
        current_bond_value: current_bond_value,
        profit_loss_maturity: Bond_at_maturity-bond_value,
        current_profit_loss: current_bond_value-bond_value,

      }
    )
    setTrade_dataSource(tableData);
  }
  const onRedeem = async () => {
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

    if (!tradeData) return;

    const encodedPoolDataState = (await connection.getAccountInfo(tradeData.pool, 'singleGossip'))!.data;
    const decodedPoolDataState = POOL_DATA_LAYOUT.decode(encodedPoolDataState) as PoolDataLayout;

    const encodedStakingDataState = (await connection.getAccountInfo(PLATFORM_DATA_ACCOUNT, 'singleGossip'))!.data;
    const decodedStakingDataState = PLATFORM_DATA_LAYOUT.decode(encodedStakingDataState) as PlatformDataLayout;


    let superB_fee = new BN(decodedPoolDataState.transaction_fee_SuperB, 10, "le").toNumber();
    if (SUPERB?.balance*(10**SUPERB_DECIMALS)  < superB_fee)
    {
      notify({
        message: 'You dont have enough SuperB to pay for transaction fee',
        type: "error",
      });
      return;
    }
    let Proceed = false;

    var now = new Date();
    let isAtMaturity = now.getTime()/1000 > tradeData.maturity_date ? true : false;
    let USDC_fee_rate = isAtMaturity ? parseInt(decodedPoolDataState.mature_redemption_fee_USDC.toString())/ 100 : parseInt(decodedPoolDataState.early_redemption_fee_USDC.toString())/ 100;

    let message =
    'USDC fee: <strong>' + USDC_fee_rate + '%</strong><br/>' +
    'SuperB fee: <strong>' + superB_fee / (10**SUPERB_DECIMALS) + '</strong>';
    // not in use
    await Swal.fire({
      title: 'Redeem Confirmation',
      html:message,
      showCancelButton: true,
      confirmButtonText: 'Redeem'
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Proceed = true;
        console.log(Proceed);
      }
    })
    console.log('here',Proceed);
    if (!Proceed) return;

    //Create new SuperB token Account and transfer fee amount to it
    let superB_associated_token_account_address = await findAssociatedTokenAddress(publicKey,SUPERB_MINT_ADDRESS);

    let usdc_associated_token_account_address = await findAssociatedTokenAddress(publicKey,USDC_MINT_ADDRESS);

    let [LP_POOL_TOKEN_PDA] = await PublicKey.findProgramAddress([new PublicKey(decodedPoolDataState.LP_Pool).toBuffer()], SUPERBONDS_PROGRAM_ID);
    let [TRADER_POOL_TOKEN_PDA] = await PublicKey.findProgramAddress([new PublicKey(decodedPoolDataState.Traders_Pool).toBuffer()], SUPERBONDS_PROGRAM_ID);
    let [TREASURY_TOKEN_PDA] = await PublicKey.findProgramAddress([new PublicKey(decodedStakingDataState.Treasury).toBuffer()], SUPERBONDS_PROGRAM_ID);

    const buffers = [
      Buffer.from(Uint8Array.of(17))
    ];
    console.log('pool',tradeData.pool.toBase58(),'trade_account',trade_account,'NFT',tradeData.NFT.toBase58());
    console.log('usdc_associated_token_account_address',usdc_associated_token_account_address.toBase58());
    console.log('superB_associated_token_account_address',superB_associated_token_account_address.toBase58());

    const NFT_info = await connection.getAccountInfo(tradeData.NFT);
    if (!NFT_info) return;
    const NFT_data = AccountLayout.decode(NFT_info.data);
    console.log(new PublicKey(NFT_data.mint));

    const Burn_one_NFT_Ix = Token.createBurnInstruction(
      TOKEN_PROGRAM_ID,
      new PublicKey(NFT_data.mint),
      tradeData.NFT,
      publicKey,
      [],
      1
    );
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
    if (resp.length == 0 ){
      notify({
        message: 'Cannot find Trader Data Account',
        type: "error",
      });
      return;
    }
    console.log(tradeData.pool.toBase58(),resp[0].pubkey.toBase58(),trade_account);
    const RedeemIx = new TransactionInstruction({
        programId: SUPERBONDS_PROGRAM_ID,
        keys: [
          { pubkey: PLATFORM_DATA_ACCOUNT, isSigner: false, isWritable: true },
          { pubkey: new PublicKey(tradeData.pool), isSigner: false, isWritable: true },
          { pubkey: resp[0].pubkey, isSigner: false, isWritable: true },
          { pubkey: publicKey, isSigner: true, isWritable: false },
          { pubkey: new PublicKey(trade_account), isSigner: false, isWritable: true },
          { pubkey: new PublicKey(tradeData.NFT), isSigner: false, isWritable: true },
          { pubkey: superB_associated_token_account_address, isSigner: false, isWritable: true },
          { pubkey: usdc_associated_token_account_address, isSigner: false, isWritable: true },
          { pubkey: new PublicKey(decodedPoolDataState.LP_Pool), isSigner: false, isWritable: true },
          { pubkey: new PublicKey(decodedStakingDataState.SuperB_Pool), isSigner: false, isWritable: true },
          { pubkey: new PublicKey(decodedPoolDataState.Traders_Pool), isSigner: false, isWritable: true },
          { pubkey: new PublicKey(decodedPoolDataState.SuperBonds_Rewards_Pool), isSigner: false, isWritable: true },
          { pubkey: new PublicKey(decodedStakingDataState.Treasury), isSigner: false, isWritable: true },
          { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
          { pubkey: SUPERB_MINT_ADDRESS, isSigner: false, isWritable: true},
          { pubkey: new PublicKey(decodedPoolDataState.LP_Mint_Account), isSigner: false, isWritable: true },

          { pubkey: new PublicKey(LP_POOL_TOKEN_PDA.toString()), isSigner: false, isWritable: false},
          { pubkey: new PublicKey(TRADER_POOL_TOKEN_PDA.toString()), isSigner: false, isWritable: false},
          { pubkey: new PublicKey(TREASURY_TOKEN_PDA.toString()), isSigner: false, isWritable: false},
          { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false},
          //{ pubkey: SYSVAR_CLOCK_PUBKEY, isSigner: false, isWritable: false }
        ],
        data: Buffer.concat(buffers)
    });
    let txid = await sendTransaction(connection,wallet,
        [
          RedeemIx,
          Burn_one_NFT_Ix
      ]
      ,[],false);

    if (!txid){
      notify({
        message: 'Something wrong with your request!',
        type: "error",
      });
    }else{
      notify({
        message: 'Redeemed Trade successfully',
        type: "success",
      });
      await delay(2000);
      history.push("/trade");
    }
  }
  return (
    <Row gutter={[16, 16]} align="middle">
      <Col span={24}>
        <br/>
        <h2>Redeem your NFT Bond Trade Token</h2>
        <p>{trade_account}</p>
        <Button type="primary" onClick={()=>onShowTradeInformation()} style={{ marginRight: '10px' }}>
          Refresh Trade Information
        </Button>
        {isMyTrade ?
            <div>
              <br/>
              <p>Your USDC Balance: <strong>{USDC.balance}</strong></p>
              <p>Your SuperB Balance: <strong>{SUPERB.balance}</strong></p>
              <Button type="primary" onClick={()=>onRedeem()} style={{ marginRight: '10px' }}>
                Redeem
              </Button>
            </div>

           : null}
      </Col>

      <Col span={24}>
        <Table dataSource={Trade_dataSource} columns={Trade_columns} />
      </Col>
    </Row>
  );
};

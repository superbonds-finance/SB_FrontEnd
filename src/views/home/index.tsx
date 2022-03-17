import React, { useEffect } from "react";
// import { useHistory} from "react-router-dom";
import { useConnectionConfig } from "../../contexts/connection";
import { useMarkets } from "../../contexts/market";
import { Text, TextDoc, BtnText, NewText, BoldFont } from "./home.styled";
// import { Tooltip } from 'antd';
import bgimage from "../../assets/bg.png";
import "./home.css";

export const HomeView = () => {
  const { marketEmitter, midPriceInUSD } = useMarkets();
  const { tokenMap } = useConnectionConfig();
  // const SRM_ADDRESS = "SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt";
  // const history = useHistory();

  useEffect(() => {
    const refreshTotal = () => {};

    const dispose = marketEmitter.onMarket(() => {
      refreshTotal();
    });

    refreshTotal();

    return () => {
      dispose();
    };
  }, [marketEmitter, midPriceInUSD, tokenMap]);

  const handlePush=(route:string)=>{
    window.location.assign('https://devnet.superbonds.finance/#/trade');
  }

  return (
    <div className="w-screen h-screen  bg-black hero-section" >
      <div className="flex flex-col absolute trade_sb_token_wrapper">

      <div className="rounded-md max-w-xs  w-64 z-50">
          <div className="offer_wrapper_1 flex flex-col text-center rounded-md">
            <div className="flex justify-center w-9/12 my-0 mx-auto">
              {/* <img
                src={
                  "https://res.cloudinary.com/drr1rnoxf/image/upload/v1643874041/ambassador_illustration_2_uncu3e.svg"
                }
                alt="..."
                style={{ width: "65px", height: "60px" }}
              /> */}
              <NewText
                color="white"
                size="24px"
                transform=""
                className=" mt-2 select-none font-bold text-white "
              >
                Become an <span style={{ color: "#01A0FC" }}>S</span>
                <span style={{ color: "#7CFA4C" }}>B</span> Ambassador
              </NewText>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() =>
                  window.open(
                    "https://superbonds.medium.com/the-ambassador-program-from-superbonds-8d11f5063bac"
                  )
                }
                className="hover:bg-green-100 text-white hover:text-black  border-2 z-40 w-36 rounded-md border-green-100 px-2 py-2 inline-block"
                style={{ marginTop: "18px" }}
              >
                <TextDoc transform="" className="" size="16px" weight="true">
                  Join Now
                </TextDoc>
              </button>
            </div>
          </div>
        </div>
        <div className="rounded-md max-w-xs w-64 z-50 mt-3">
          <div className="trade_sb_token_wrapper_1 flex flex-col justify-start ">
            <Text
              color="#586779"
              size="16px"
              weight="true"
              transform="true"
              className="my-0 mt-3 select-none"
            >
              Trade SB token
            </Text>
            <div className="flex flex-col justify-start">
              <img
                onClick={() =>
                  window.open("https://www.mexc.com/exchange/SB_USDT")
                }
                className=" my-0  select-none mr-12 cursor-pointer Z-40  mt-3 left-auto right-auto"
                src={
                  "https://res.cloudinary.com/drr1rnoxf/image/upload/v1643366156/full-logo-normal-mexc_cllivy.svg"
                }
                alt="..."
                style={{ height: "38px", width: "131px" }}
              />
              <img
                onClick={() =>
                  window.open(
                    "https://dex.raydium.io/#/market/E3cNotFPoECwQvacT2D7u3C3tKRkGtUxv8WFYazBEx4X"
                  )
                }
                className=" -ml-5 select-none my-0  mr-12 cursor-pointer mt-2 Z-40 "
                src={
                  "https://res.cloudinary.com/drr1rnoxf/image/upload/v1643366716/logo-text.cf5a7a0_lx0ueg.svg"
                }
                alt="..."
                style={{ height: "38px", width: "176px" }}
              />

              <div className="flex my-0 mt-4">
                <img
                  onClick={() => window.open("https://jup.ag/swap/USDC-SB")}
                  className="w-8 select-none cursor-pointer Z-40"
                  src={
                    "https://res.cloudinary.com/drr1rnoxf/image/upload/v1643366783/jupiter-logo_vi90us.svg"
                  }
                  alt="..."
                  style={{ height: "38px" }}
                />

                <Text
                  onClick={() => window.open("https://jup.ag/swap/USDC-SB")}
                  className="ml-2 mt-2 cursor-pointer Z-40 select-none '"
                  size="16px"
                  weight="true"
                >
                  Jupiter
                </Text>
              </div>
            </div>
          </div>

          <div className="trade_sb_token_wrapper_2 flex flex-col  justify-start ">
            <Text
              color="#586779"
              size="16px"
              weight="true"
              transform="true"
              className="my-0 select-none"
            >
              Track markets
            </Text>
            <div className="flex flex-col justify-start">
              <img
                onClick={() =>
                  window.open("https://www.coingecko.com/en/coins/superbonds")
                }
                className=" select-none  -ml-1 my-0  mr-10 mt-3 cursor-pointer Z-40  "
                src={
                  "https://res.cloudinary.com/drr1rnoxf/image/upload/v1643368369/coingecko-logo-white-3f2aeb48e13428b7199395259dbb96280bf47ea05b2940ef7d3e87c61e4d8408_jlbfa3.png"
                }
                alt="..."
                style={{ height: "35px", width: "130px" }}
              />
              <img
                onClick={() =>
                  window.open(
                    "https://coinmarketcap.com/currencies/superbonds/"
                  )
                }
                className=" select-none my-0  mr-12 mt-3 cursor-pointer Z-40 "
                src={
                  "https://res.cloudinary.com/drr1rnoxf/image/upload/v1643903985/CoinMarketCap_tp16rh.png"
                }
                alt="..."
                style={{ height: "45px", width: "165px" }}
              />
            </div>
          </div>
        </div>

      </div>

      <div
        className="flex relative justify-center w-full p-0 m-0  h-4/5 bg-no-repeat bg-cover py-3 home-section"
        style={{ backgroundImage: `url(${bgimage})`,   }}  
      >
        <div className="absolute md:hidden">
          <img
            src={
              "https://res.cloudinary.com/drr1rnoxf/image/upload/v1636998507/leftPolygon_kcbqsu.png"
            }
            alt=""
            style={{
              width: "500px",
              height: "600px",
              marginRight: "48vw",
              marginTop: "35vh",
              userSelect: "none",
            }}
          />
        </div>

        <div
          className="main-bg flex flex-col w-full h-full  text-center bg-no-repeat bg-center justify-center"
          style={{
            backgroundImage: `url(${"https://res.cloudinary.com/drr1rnoxf/image/upload/v1636998508/Polygon_qqqvbm.png"})`,
            backgroundSize: "contain",
          }}
        >
          <div className="py-1 ">
            <div className="flex justify-center ">
              <Text transform="" size="42px" weight="true">
                SuperBonds
              </Text>
              <img
                className="ml-3"
                src={
                  "https://res.cloudinary.com/drr1rnoxf/image/upload/v1636998509/solana_ffxt3n.svg"
                }
                alt="..."
              />
            </div>
            <Text className="block my-8" size="24px" weight="true">
              Financial NFT Market
            </Text>
          </div>
          <div className="flex justify-center">
            <button
              onClick={() =>
                handlePush("https://devnet.superbonds.finance/#/trade")
              }
              className="w-48  z-40 rounded-md bg-green-100 px-4 py-2 inline-block text-center"
            >
              <BtnText
                className=""
                transform=""
                size="16px"
                weight="true"
                color="black"
              >
                Launch Devnet
              </BtnText>
              {/* <img  className=' mt-0.5' src={arrow}  /> */}
            </button>

            <button
              onClick={() =>
                window.open("https://superbonds.gitbook.io/superbonds/")
              }
              className="hover:bg-green-100  text-white hover:text-black  border-2 z-40 w-44 rounded-md border-green-100 px-4 py-2 inline-block ml-3"
            >
              <TextDoc transform="" className="" size="16px" weight="true">
                Docs
              </TextDoc>
            </button>
          </div>
        </div>

        <div className="absolute md:hidden">
          <img
            src={
              "https://res.cloudinary.com/drr1rnoxf/image/upload/v1636998509/rightPolygon_pq5wrn.png"
            }
            alt=""
            style={{
              width: "400px",
              height: "400px",
              marginLeft: "46vw",
              marginTop: "-1vh",
              userSelect: "none",
            }}
          />
        </div>
      </div>

      <section>
        <div className="flex flex-col mt-12 text-center justify-center select-none">
          <div className="flex justify-center items-center">
            <div>
              <img
                className="home-line-left"
                src={
                  "https://res.cloudinary.com/drr1rnoxf/image/upload/v1644226260/Group_101_bre4ta.png"
                }
                width="100%"
                height="100%"
                alt="trade"
              />
            </div>
            <div className="flex flex-col px-5">
              <BtnText color="#7CFA4C" size="28px" weight="true">
                MetaYielder
              </BtnText>
              {/* <BtnText className="mt-2" color="white" size="14px" weight="true">
                Q1 2022
              </BtnText> */}
            </div>
            <div>
              <img
                className="home-line-right"
                src={
                  "https://res.cloudinary.com/drr1rnoxf/image/upload/v1644226260/Group_1334_gmxlrb.png"
                }
                width="100%"
                height="100%"
                alt="trade"
              />
            </div>
          </div>
          <div className="flex flex-wrap w-9/12 mx-auto my-0 pt-5 2xl:w-11/12 xl:w-full justify-center">
            <div className="flex flex-col justify-center my-0 mx-3 sm:w-full">
              <div className="z-50">
                <img
                  className="my-0 mx-auto w-24 z-50"
                  src={
                    "https://res.cloudinary.com/drr1rnoxf/image/upload/v1644309050/Trade_irbh1a.svg"
                  }
                  alt="trade"
                />
              </div>
              <div className="flex flex-col justify-start yielder-below-Q1 mx-auto my-0 px-3 py-16 rounded-md w-64 -z-50 -mt-14 sm:w-full h-full">
                <div className="flex flex-col ">
                  <BtnText
                    className="mt-2"
                    color="white"
                    size="21px"
                    weight="true"
                  >
                    Always Earn
                  </BtnText>
                  <Text
                    letterSpacing="1px"
                    className="tracking-normal mt-3"
                    size="15px"
                    opacity="0.5"
                  >
                     Multiple on-chain reward streams, Multiplied Yields
                  </Text>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center my-0 mx-3 sm:w-full">
              <div className="z-50">
                <img
                  className="my-0 mx-auto w-24 z-50"
                  src={
                    "https://res.cloudinary.com/drr1rnoxf/image/upload/v1644309050/Yield_vdeosl.svg"
                  }
                  alt="trade"
                />
              </div>
              <div className="flex flex-col justify-start yielder-below-Q1 mx-auto my-0 px-3 py-16 rounded-md w-64 -z-50 -mt-14 sm:w-full h-full">
                <div className="flex flex-col">
                  <BtnText
                    className="mt-2"
                    color="white"
                    size="21px"
                    weight="true"
                  >
                    Fixed or Floating
                  </BtnText>
                  <Text
                    letterSpacing="1px"
                    className="tracking-normal mt-3"
                    size="15px"
                    opacity="0.5"
                  >
                    Earn fixed yield or underwrite it to earn flexible rewards
                  </Text>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center my-0 mx-3 sm:w-full">
              <div className="z-50">
                <img
                  className="my-0 mx-auto  w-24  z-50"
                  src={
                    "https://res.cloudinary.com/drr1rnoxf/image/upload/v1644309050/NFT_wfsjbl.svg"
                  }
                  alt="trade"
                />
              </div>
              <div className="flex flex-col justify-start yielder-below-Q1 mx-auto my-0 px-3 py-16 rounded-md w-64 -z-50 -mt-14 sm:w-full h-full">
                <div className="flex flex-col">
                  <BtnText
                    className="mt-2"
                    color="white"
                    size="21px"
                    weight="true"
                  >
                    Financial NFTs
                  </BtnText>
                  <Text
                    letterSpacing="1px"
                    className="tracking-normal mt-3"
                    size="15px"
                    opacity="0.5"
                  >
                    A known future value, in your custody: a new form of
                    collateral
                  </Text>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center my-0 mx-3 sm:w-full">
              <div className="z-50">
                <img
                  className="my-0 mx-auto  w-24  z-50"
                  src={
                    "https://res.cloudinary.com/drr1rnoxf/image/upload/v1644405667/SuperB_tgvltb.svg"
                  }
                  alt="trade"
                />
              </div>
              <div className="flex flex-col justify-start yielder-below-Q1 mx-auto my-0 px-3 py-16 rounded-md w-64 -z-50 -mt-14 sm:w-full h-full">
                <div className="flex flex-col">
                  <BtnText
                    className="mt-2"
                    color="white"
                    size="21px"
                    weight="true"
                  >
                    SB Token
                  </BtnText>
                  <Text
                    letterSpacing="1px"
                    className="tracking-normal mt-3"
                    size="15px"
                    opacity="0.5"
                  >
                    The key to the ecosystem in a deflationary gas model
                  </Text>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="flex flex-col mt-16 text-center justify-center select-none">
          <div className="flex justify-center">
            <button
              onClick={() =>
                handlePush("https://devnet.superbonds.finance/#/trade")
              }
              className="text-black bg-green-100 rounded-md px-6 py-4"
            >
              <TextDoc transform="" className="" size="16px" weight="true">
                LAUNCH DEVNET
              </TextDoc>
            </button>
          </div>
        </div>
      </section>

      <section>
        <div className="flex flex-col mt-12 text-center justify-center select-none">
          <div className="flex justify-center items-center">
            <div>
              <img
                className="home-line-left"
                src={
                  "https://res.cloudinary.com/drr1rnoxf/image/upload/v1644210559/Group_1335_qxg5xu.png"
                }
                width="100%"
                height="100%"
                alt="trade"
              />
            </div>
            <div className="flex flex-col px-5">
              <BtnText color="#01A0FC" size="28px" weight="true">
                MetaLend
              </BtnText>
              {/* <BtnText className="mt-2" color="white" size="14px" weight="true">
                Q2 2022
              </BtnText> */}
            </div>
            <div>
              <img
                className="home-line-right"
                src={
                  "https://res.cloudinary.com/drr1rnoxf/image/upload/v1644210546/Group_1336_nedhlq.png"
                }
                width="100%"
                height="100%"
                alt="trade"
              />
            </div>
          </div>
          <div className="flex flex-col justify-center yielder-below mx-auto my-0 py-14 px-20 rounded-md mt-5">
            <div>
              <BtnText color="white" size="21px" weight="true">
                Coming Soon
              </BtnText>
            </div>

            <div className="py-5">
              <button
                onClick={() =>
                  window.open(
                    "https://res.cloudinary.com/drr1rnoxf/image/upload/v1642360290/SB_Whitepaper-compressed_lafdtl.pdf#page=13"
                  )
                }
                className="text-white border-2 rounded-md border-purple-100 px-8 py-4"
              >
                <TextDoc transform="" className="" size="16px" weight="true">
                  READ MORE
                </TextDoc>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-5" style={{ marginTop: "7rem" }}>
        <div
          className="mt-10 w-1/12 text-center border-b-4 border-white"
          style={{ margin: "0 auto" }}
        ></div>

        <div
          className="flex justify-around   mt-5   rounded-md flex-wrap w-8/12  2xl:w-9/12  maxWidth-lg my-0 mx-auto pb-1 pt-1 lg:w-12/12"
          style={{ maxWidth: "1400px" }}
        >
          <div className="w-56 xl:w-56 bg-transparent rounded-lg sahdow-lg flex flex-col justify-center items-center max-w-xs w-64  min-h-16">
            <img
              className="object-center object-cover rounded-full h-52 w-full"
              style={{ marginBottom: "" }}
              src="https://res.cloudinary.com/drr1rnoxf/image/upload/v1637925580/COMMONCROPPED_onwv85.svg"
              alt="home-page-card"
            />
          </div>

          <div className="w-56 xl:w-56 bg-transparent rounded-lg sahdow-lg flex flex-col justify-center items-center max-w-xs  min-h-16">
            <img
              className="object-center object-cover rounded-full h-52 w-full"
              style={{ marginBottom: "" }}
              src="https://res.cloudinary.com/drr1rnoxf/image/upload/v1637925580/LVNACROPPED_dsoyzg.svg"
              alt="home-page-card"
            />
          </div>

          <div className="w-56 xl:w-56 bg-transparent rounded-lg sahdow-lg  flex flex-col justify-center items-center max-w-xs  min-h-16">
            <img
              className="object-center object-cover rounded-full h-52 w-full"
              style={{ marginBottom: "" }}
              src="https://res.cloudinary.com/drr1rnoxf/image/upload/v1637925580/POLYCHAINCROPPED_nug9cn.svg"
              alt="home-page-card"
            />
          </div>

          <div className="w-56 xl:w-56 bg-transparent rounded-lg sahdow-lg  flex flex-col justify-center items-center max-w-xs min-h-16">
            <img
              className="object-center object-cover rounded-full h-52 w-full"
              style={{ marginTop: "" }}
              src="https://res.cloudinary.com/drr1rnoxf/image/upload/v1637925580/KUBIKCROPPED_uhhbyu.svg"
              alt="home-page-card"
            />
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className=" flex justify-center">
          <Text>
            Copyright © 2021 <strong>SuperBonds</strong>
          </Text>
        </div>
      </footer>
    </div>
  );
};
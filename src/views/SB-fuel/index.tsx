import React from "react";
import { Wrapper, GlobalStyle } from "./style";
import polygon4 from "../../assets/landing-page/polygon_3.png";
import orHex from "../../assets/landing-page/or-hex.png";
import downArrow from "../../assets/landing-page/bxs_down-arrow.png";

import { Col, Row } from "antd";
import { BtnText, CardText } from "../home/home.styled";
import { useHistory } from "react-router-dom";

import Collapsible from "react-collapsible";
import { BsInfoCircleFill } from "react-icons/bs";
import { Tooltip } from "antd";
import { AntdTooltip } from "./style";

export const SBFuel = () => {
  const history = useHistory();

  return (
    <Wrapper>
      <div className="top-div select-none">
        <div className="polygen1">
          <img alt="bg-hexagon" className="blur1" src={polygon4} />
          <img alt="bg-hexagon1" className="blur" src={polygon4} />
          <Row className="pl-10 sm:pl-0 custom-row">
            <Col className="col1 flex flex-col">
              <div>
                <div className="main-title">
                  SB Token <br />
                  Fuel for the Platform
                </div>
                <div className="sub-title">
                  A predictable yield on your stablecoins
                </div>
              </div>
              <div className="icon-desc flex sm:flex-col justify-between sm:text-2xl">
                <div className="flex mr-6 sm:mb-14">
                  <img
                    className="sb-fuel-logo"
                    src={
                      "https://res.cloudinary.com/drr1rnoxf/image/upload/v1655985378/Vector_mxmvtt.svg"
                    }
                    alt="..."
                  />
                  <text className="sb-logo-text">
                    SB is the gas of the <br /> SuperStable Platform
                  </text>
                </div>
                <div className="flex mr-6 sm:mb-14">
                  <img
                    className="sb-fuel-logo"
                    src={
                      "https://res.cloudinary.com/drr1rnoxf/image/upload/v1655985365/Frame_329_u7weo5.svg"
                    }
                    alt="..."
                  />
                  <text className="sb-logo-text">
                    It is required and burned <br /> in every transaction
                  </text>
                </div>
                <div className="flex mr-6 sm:mb-14">
                  <img
                    className="sb-fuel-logo"
                    src={
                      "https://res.cloudinary.com/drr1rnoxf/image/upload/v1655985357/Frame_329_xkxcna.svg"
                    }
                    alt="..."
                  />
                  <text className="sb-logo-text">
                    Without SB, the platform <br /> would not be usable
                  </text>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      <Row className="supply-data">
        <Col span={24} className="text-center">
          <h1 className="title-2">A maximum supply of</h1>
          <text className="supply-text">10 Billion</text>
        </Col>
      </Row>

      <div className="supply-data-main flex justify-around align-middle sm:grid sm:grid-cols-2 sm:place-items-center sm:justify-center items-center w-6/12 sm:w-8/12 md:w-8/12 mx-auto my-0 md:flex-wrap">
        <div className="sm:w-full flex  sm:col-span-2 sm:ml-4 items-center sm:justify-center sm:items-center">
        <AntdTooltip margin="-3.3rem">
          <Tooltip
            getPopupContainer={(triggerNode) => triggerNode}
            placement="bottom"
            title={`Protocol Rewards Distributed Over years with Real-Time Settlement`}
            overlayStyle={{ top: "-4.5rem" }}
          >
            <div className="bg-gray-300  mr-4 w-40 h-40 lg:mb-4 md:mb-4 md:mr-4 border supply-6b supply-circle1 flex flex-col justify-center select-none">
              <BsInfoCircleFill
                className="supply-6b-icon"
                style={{ fontSize: "9px" }}
              />
              <text className="supply-data-value text-6xl">6B</text>
            </div>
            </Tooltip>
        </AntdTooltip>
        </div>

        {/* <div className="sm:w-full flex items-center sm:justify-between sm:items-center"> */}
        <AntdTooltip margin="-3.3rem">
          <Tooltip
            getPopupContainer={(triggerNode) => triggerNode}
            placement="bottom"
            title={"Dev/Team rewards"}
            overlayStyle={{ top: "-4.5rem" }}
          >
            <div className="bg-gray-300 mr-4   w-28 h-28 lg:mb-4 md:mb-4 md:mr-4 sm:mr-2 border  supply-6b  supply-circle1 flex flex-col justify-center select-none">
              <BsInfoCircleFill
                className="supply-6b-icon"
                style={{ fontSize: "9px" }}
              />
              <text className="supply-data-value text-4xl">1.5B</text>
            </div>
          </Tooltip>
        </AntdTooltip>
        <AntdTooltip margin="-2.7rem">
          <Tooltip
            getPopupContainer={(triggerNode) => triggerNode}
            placement="bottom"
            title={"Sale in USDC"}
            overlayStyle={{ top: "-3.5rem" }}
          >
            <div className="bg-gray-300 mr-4  w-24 h-24 lg:mb-4 md:mb-4 md:mr-4 sm:mr-2 border supply-circle1 flex flex-col justify-center select-none">
              <BsInfoCircleFill
                className="supply-6b-icon"
                style={{ fontSize: "9px" }}
              />
              <text className="supply-data-value text-3xl">1.04B</text>
            </div>
          </Tooltip>
        </AntdTooltip>
        {/* </div> */}

        {/* <div className="sm:w-full flex items-center sm:px-8 sm:justify-between sm:items-center"> */}
        <AntdTooltip margin="-2.3rem">
          <Tooltip
            getPopupContainer={(triggerNode) => triggerNode}
            placement="bottom"
            title={"Marketing"}
            overlayStyle={{ top: "-3rem" }}
          >
            <div className="bg-gray-300 mr-4  w-20 h-20 lg:mb-4 md:mb-4 md:mr-4 sm:mr-2 border supply-circle1 flex flex-col justify-center select-none">
              <BsInfoCircleFill
                className="supply-6b-icon"
                style={{ fontSize: "9px" }}
              />
              <text className="supply-data-value text-2xl">0.5B</text>
            </div>
          </Tooltip>
        </AntdTooltip>

        <AntdTooltip margin="-2rem">
          <Tooltip
            getPopupContainer={(triggerNode) => triggerNode}
            placement="bottom"
            title={"treasury"}
            overlayStyle={{ top: "-4rem" }}
          >
            <div className="bg-gray-300 mr-4 w-16 h-16 lg:mb-4 md:mb-4 md:mr-4 sm:mr-2 border supply-circle1 flex flex-col justify-center select-none">
              <BsInfoCircleFill
                className="supply-6b-icon"
                style={{ fontSize: "9px" }}
              />
              <text className="supply-data-value text-xl">0.46B</text>
            </div>
          </Tooltip>
        </AntdTooltip>
        {/* </div> */}
        {/* <div className="sm:w-full flex items-center sm:px-14 sm:justify-between sm:items-center"> */}
        <AntdTooltip margin="-1.5rem">
          <Tooltip
            getPopupContainer={(triggerNode) => triggerNode}
            placement="bottom"
            title={`Maximum a5t unlocked
            conversion rate:
            1a5t = 20 SB`}
            overlayStyle={{ top: "-4rem" }}
          >
            <div className="bg-gray-300 mr-4  w-14 h-14 lg:mb-4 md:mb-4 md:mr-4 sm:mr-2 border supply-circle1 flex flex-col justify-center select-none">
              <BsInfoCircleFill
                className="supply-6b-icon"
                style={{ fontSize: "9px" }}
              />
              <text className="supply-data-value text-base">0.37B</text>
            </div>
          </Tooltip>
        </AntdTooltip>
        <AntdTooltip margin="-1rem">
          <Tooltip
            getPopupContainer={(triggerNode) => triggerNode}
            placement="bottom"
            title={`
            maximum a5t locked
            conversion rate: 
            1a5t = 10 SB`}
            overlayStyle={{ top: "-4rem" }}
          >
            <div className="bg-gray-300 mr-4 w-12 h-12 lg:mb-4 md:mb-4 md:mr-4 sm:mr-2 border supply-circle1 flex flex-col justify-center select-none">
              <BsInfoCircleFill
                className="supply-6b-icon"
                style={{ fontSize: "9px" }}
              />
              <text className="supply-data-value text-sm align-middle">
                0.13B
              </text>
            </div>
          </Tooltip>
        </AntdTooltip>
        {/* </div> */}
      </div>
      <Row>
        <Col span={24}>
          <h1 className="title-2 select-none">Trade SB</h1>
        </Col>
      </Row>
      <div
        className="flex flex-wrap w-9/12 mx-auto my-0 pt-5 2xl:w-11/12 xl:w-full justify-center"
        style={{ backgroundColor: "none" }}
      >
        <div
          className="flex flex-col justify-center my-0 mx-3 sm:w-full bg-transparent"
          style={{ backgroundColor: "none" }}
        >
          <div className="z-50">
            <img
              className="my-0 mx-auto  w-24  z-50 select-none"
              src={
                "https://res.cloudinary.com/drr1rnoxf/image/upload/v1656006454/Frame_234_zkmwgy.svg"
              }
              alt="trade"
            />
          </div>
          <div className="select-none flex flex-col justify-start yielder-below-Q2 mx-auto my-0 px-3 pb-4 pt-16  rounded-md  -z-50 -mt-14 sm:w-full h-full">
            <div className="flex flex-col">
              <BtnText
                className="mt-1"
                color="white"
                size="21px"
                weight="true "
              >
                Become an SB Ambassador
              </BtnText>

              <button
                onClick={() =>
                  window.open(
                    "https://superbonds.medium.com/the-ambassador-program-from-superbonds-8d11f5063bac"
                  )
                }
                style={{ boxShadow: "0px 3px 9px 0px #40ba12" }}
                className="button-hover-change mx-auto mt-14 w-36 z-40 rounded-md px-2 py-2 inline-block text-center"
              >
                <BtnText
                  transform
                  size="15px"
                  weight="true"
                  color="black"
                  height="32px"
                >
                  JOIN NOW
                </BtnText>
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center my-0 mx-3 sm:w-full">
          <div className="z-50">
            <img
              className="my-0 mx-auto w-24 z-50 select-none"
              src={
                "https://res.cloudinary.com/drr1rnoxf/image/upload/v1656006477/Group_1348_esybja.svg"
              }
              alt="trade"
            />
          </div>
          <div className="flex flex-col justify-start yielder-below-Q1 mx-auto my-0 px-3 pb-4 pt-16  rounded-md w-96 -z-50 -mt-14 sm:w-full h-full">
            <div className="flex flex-col justify-center">
              <BtnText className="mt-1" color="white" size="21px" weight="true">
                Trade SB Token
              </BtnText>
              <button
                className="sb-market-button mt-5 items-center mx-auto my-0 rounded"
                style={{ border: "1px solid #3D4F61", width: "70%" }}
              >
                <img
                  onClick={() =>
                    window.open("https://www.mexc.com/exchange/SB_USDT")
                  }
                  className="mx-auto my-0 select-none cursor-pointer  "
                  src={
                    "https://res.cloudinary.com/drr1rnoxf/image/upload/v1643366156/full-logo-normal-mexc_cllivy.svg"
                  }
                  alt="..."
                  style={{ height: "50px", width: "130px" }}
                />
              </button>
              <button
                className="sb-market-button py-1.5 mt-2 w-15  mx-auto my-0 rounded"
                style={{ border: "1px solid #3D4F61", width: "70%" }}
              >
                <img
                  onClick={() =>
                    window.open(
                      "https://dex.raydium.io/#/market/E3cNotFPoECwQvacT2D7u3C3tKRkGtUxv8WFYazBEx4X"
                    )
                  }
                  className="mx-auto my-0 select-none  cursor-pointer Z-40 "
                  src={
                    "https://res.cloudinary.com/drr1rnoxf/image/upload/v1643366716/logo-text.cf5a7a0_lx0ueg.svg"
                  }
                  alt="..."
                  style={{ height: "38px", width: "150px" }}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex bg-gray-300 w-6/12 mx-auto my-0 sm:w-11/12 md:w-9/12 py-10 ve-sb-section justify-center select-none">
        <div className="flex flex-col">
          <img
            className="my-0 mx-auto  w-24  z-50 select-none"
            src={
              "https://res.cloudinary.com/drr1rnoxf/image/upload/v1656076683/Group_1412_bj46qa.svg"
            }
            style={{ marginTop: "-5.7rem" }}
            alt="trade"
          />
          <div className="text-center mt-8 ">
            <text className="vesb-text1 block text-gray-110">
              <span className=" text-green-100 vesb-text">veSB</span> is the
              governance token of SuperStable. <br /> It is acquirable by
              staking and locking SB.
            </text>
            <text className="vesb-text1 block text-gray-110 py-3">
              More details on veSB can be found under <br />
              <span className="text-white">Governance</span> .{" "}
            </text>
          </div>
        </div>
      </div>
      <GlobalStyle />
    </Wrapper>
  );
};

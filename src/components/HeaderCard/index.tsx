import React from "react";

import { HeaderText, Text } from "../../views/trade/trade.styled";
import { numberFormatter, formatNumberWithoutRounding } from "../../utils/utils";

export const HeaderCard = (props: {
  text: string;
  divStyle: string;
  USDCbalance: React.ReactElement;
  SuperBbalance: React.ReactElement;
}) => {
  return (
    <div className={'flex pt-4 justify-between sm:flex-col' + props.divStyle}>
      <div><HeaderText>{props.text}</HeaderText></div>
      <div className="flex">
        <div className="py-2 pl-2 pr-14 md:pr-3 rounded-md" style={{ 'background': ' linear-gradient(89.52deg, rgba(124, 250, 76, 0.1) 15.18%, rgba(124, 250, 76, 0) 76.06%), #1F2933' }}>
          <Text className='block' size="12px" opacity="0.5">USDC Balance:</Text>
          <Text>{formatNumberWithoutRounding.format(parseFloat(props.USDCbalance.toString()))}</Text>
        </div>
        <div className="py-2 pl-2 pr-14 md:pr-3 rounded-md ml-2" style={{ 'background': ' linear-gradient(89.52deg, rgba(124, 250, 76, 0.1) 15.18%, rgba(124, 250, 76, 0) 76.06%), #1F2933' }}>
          <Text className='block' size="12px" opacity="0.5">SB Balance:</Text>
          <Text>{numberFormatter.format(parseFloat(props.SuperBbalance.toString()))}</Text>
        </div>
      </div>
    </div>
  );
};

import { PublicKey } from "@solana/web3.js";

export const SUPERBONDS_PROGRAM_ID = new PublicKey(
  "3uYxUhAgj5Bho1xtY9Sq64R5QpPagbG2yDBmxkjsek5J"
);

//Store Staking Data
export const STAKING_DATA_ACCOUNT = new PublicKey(
  "29bneiPt3BDoFzUr3eLnungJG1dzGjNLZMhFu5YHroRE"
);

//Store Platform Data
export const PLATFORM_DATA_ACCOUNT = new PublicKey(
  "95YooxeA75GwP3D8jmBoyiYFWm3wyJKstd53R9T8dMhx"
);

//Hold 6B SuperB
export const SUPERB_REWARDS_POOL_ADDRESS = new PublicKey(
  "FBdwnLwpV8sUAaRrH2qdEDU59WnicT4KVtZxgUBmce5y"
);
// Treasury Account hold USDC
export const TREASURY_ADDRESS = new PublicKey(
  "Bw9fSnsk7oPt3yafZpcj4ev4WdyB1S8hcRgAAntErL3c"
);
// Treasury Account hold SuperB
export const TREASURY_SUPERB_ADDRESS = new PublicKey(
  "8uUZrJvXsk24bXXsvfho8e1tCa6PQtMzRBNwcC3TQWWh"
);
// Account that holds the SuperB fee
export const SUPERB_POOL_ADDRESS = new PublicKey(
  "HNXUoCY5Jn52a3pHrNcQpU9eMsX7o3xBrkR98R9eNDTv"
);

export const POOL_30_ADDRESS = new PublicKey(
  "AJovBREZN4cwpm4NUoUX6onhbeRq3op7HAgTmFBgVuCG"
);
export const POOL_90_ADDRESS = new PublicKey(
  "FD1sLSXULZZVRn91wd6b4XwZLdg87hQpNCsNsKywttGw"
);

export const LP_TOKEN_30_MINT_ADDRESS = new PublicKey(
  "BM3wZwXZ33JM8oXR9SXFL7jdhdMY5qunwjuzDFHNxHhT"
);

export const LP_TOKEN_90_MINT_ADDRESS = new PublicKey(
  "EW4nZZLxGPNBiSuuM1JWYUmwrABGKiWdh4Bz5xnCS5hm"
);


//DEVNET SUPERB and USDC
export const SUPERB_MINT_ADDRESS = new PublicKey(
  "H8pSXLW192Q8jzc272yQCCRrpphbZCGR3id8XEEw6JSa"
);

// export const USDT_MINT_ADDRESS = new PublicKey(
//   "EJwZgeZrdC8TXTQbQBoL6bfuAnFUUy1PVCMB4DYPzVaS"
// );

export const USDC_MINT_ADDRESS = new PublicKey(
  "2tWC4JAdL4AxEFJySziYJfsAnW2MHKRo98vbAPiRDSk8"
);


export const SUNNY_MINT_ADDRESS = new PublicKey(
  "SUNNYWgPQmFxe9wTZzNK7iPnJ3vYDrkgnxJRJm1s3ag"
);
export const SABER_MINT_ADDRESS = new PublicKey(
  "Saber2gLauYim4Mvftnrasomsv6NvAuncvMEZwcLpD1"
);
export const ORCA_MINT_ADDRESS = new PublicKey(
  "orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE"
);

//Free Tokens for DevNet
export const FREE_TOKEN_PROGRAM_ID = new PublicKey(
  "4e92qqeZREeSGro67eiZbmvSofSSME1E33U8B7Cq1R3y"
);
export const FREE_TOKEN_DATA_ADDRESS = new PublicKey(
  "BYtBJrfUYHwFma5cY1DMRmhFFPJMiSgBSUA9CdkgdjuP"
);
export const FREE_SUPERB_ADDRESS = new PublicKey(
  "8TprUYLmtaypkoQwa3xXZED1gHWekRZZeFCv4AKyDmsK"
);
export const FREE_USDC_ADDRESS = new PublicKey(
  "74guvaeJ9VBo7j8FRtDv77wrKecCJAaF4rAWSFn3yyrY"
);


export const USDT_DECIMALS = 6;
export const USDC_DECIMALS = 6;
export const SUPERB_DECIMALS = 6;
export const LP_TOKEN_DECIMALS = 6;
export const SUNNY_TOKEN_DECIMALS = 6;
export const SABER_TOKEN_DECIMALS = 6;
export const ORCA_TOKEN_DECIMALS = 6;

/*
    END OF SUPERBONDS IDS
*/
export const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new PublicKey(
  'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
);

export const WRAPPED_SOL_MINT = new PublicKey(
  "So11111111111111111111111111111111111111112"
);
export let TOKEN_PROGRAM_ID = new PublicKey(
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
);

export let LENDING_PROGRAM_ID = new PublicKey(
  "TokenLending1111111111111111111111111111111"
);

export let SWAP_PROGRAM_ID = new PublicKey(
  "SwaPpA9LAaLfeLi3a68M4DjnLqgtticKg6CnyNwgAC8"
);

export const PROGRAM_IDS = [
  {
    name: "mainnet-beta",
  },
  {
    name: "testnet",
  },
  {
    name: "devnet",
  },
  {
    name: "localnet",
  },
];

export const setProgramIds = (envName: string) => {
  let instance = PROGRAM_IDS.find((env) => env.name === envName);
  if (!instance) {
    return;
  }
};

export const programIds = () => {
  return {
    token: TOKEN_PROGRAM_ID,
  };
};

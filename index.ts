import { Squid } from "@0xsquid/sdk";
import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

const privateKey = process.env.PK!;
if (!privateKey)
  throw new Error("No private key provided, pls include in .env file");

(async () => {
  // instantiate the SDK

  const squid = new Squid({
    baseUrl: "https://api.0xsquid.com", // for testnet use "https://testnet.api.0xsquid.com"
  });

  // init the SDK
  await squid.init();
  console.log("Squid inited");

  // use the RPC provider of the "from" chain
  const provider = ethers.getDefaultProvider(
    "https://api.avax.network/ext/bc/C/rpc"
  );

  const signer = new ethers.Wallet(privateKey, provider);

  const params = {
    fromChain: 43114,
    fromToken: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    fromAmount: "5000000000000000",
    toChain: 137,
    toToken: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    toAddress: "0xb13CD07B22BC5A69F8500a1Cb3A1b65618d50B22",
    slippage: 3.0, // 3.00 = 3% max slippage across the entire route, acceptable value range is 1-99
    enableForecall: false, // instant execution service, defaults to true
    quoteOnly: false, // optional, defaults to false
  };

  const { route } = await squid.getRoute(params);

  const tx = await squid.executeRoute({
    signer,
    route,
  });

  const txReceipt = await tx.wait();

  console.log(txReceipt);
})();

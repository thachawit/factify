const { SignProtocolClient, SpMode, EvmChains } = require("@ethsign/sp-sdk");
const { privateKeyToAccount } = require("viem/accounts");

const privateKey = "0xc44f89924070f06206a4c1465e87ea1551111be5fd8d6405a1978bb519356520";
const client = new SignProtocolClient(SpMode.OnChain, {
  chain: EvmChains.baseSepolia,
  account: privateKeyToAccount(privateKey), // Optional, depending on environment
});

const res = await client.createSchema({
  name: "SDK Test",
  data: [
    { name: "contractDetails", type: "string" },
    { name: "signer", type: "address" },
  ],
});

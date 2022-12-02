import sdk from "./1-initialize-sdk.js";
import { ethers } from "ethers";

// Importing and configuring our .env file that we use to securely store our environment variables
// Done to fix Gas error
import dotenv from "dotenv";
dotenv.config();

(async () => {
  try {
    // This is our governance contract.
    const vote = await sdk.getContract("0xAE0Db4731f231791BbB66EbC5d078999FE4C833c", "vote");
    // This is our ERC-20 contract.
    const token = await sdk.getContract("0x6170e5FFFb2b5841D11936b59bC8AE56682b1663", "token");
    // Gas error solution code
    await token.delegateTo(process.env.WALLET_ADDRESS);
    // Create proposal to mint 420 new token to the treasury.
    const amount = 420;
    const description = "Should DefiDAO mint an additional " + amount + " tokens into the treasury?";
    const executions = [
      {
        // Our token contract that actually executes the mint.
        toAddress: token.getAddress(),
        // Our nativeToken is ETH. nativeTokenValue is the amount of ETH we want
        // to send in this proposal. In this case, we're sending 0 ETH.
        // We're just minting new tokens to the treasury. So, set to 0.
        nativeTokenValue: 0,
        // We're doing a mint! And, we're minting to the vote, which is
        // acting as our treasury.
        // in this case, we need to use ethers.js to convert the amount
        // to the correct format. This is because the amount it requires is in wei.
        transactionData: token.encoder.encode(
          "mintTo", [
          vote.getAddress(),
          ethers.utils.parseUnits(amount.toString(), 18),
        ]
        ),
      }
    ];

    await vote.propose(description, executions);

    console.log("✅ Successfully created proposal to mint tokens");
  } catch (error) {
    console.error("failed to create first proposal", error);
    process.exit(1);
  }

  try {
    // This is our governance contract.
    const vote = await sdk.getContract("0xAE0Db4731f231791BbB66EbC5d078999FE4C833c", "vote");
    // This is our ERC-20 contract.
    const token = await sdk.getContract("0x6170e5FFFb2b5841D11936b59bC8AE56682b1663", "token");
    // Create proposal to transfer ourselves 690 tokens for being awesome.
    const amount = 690;
    const description = "Should DefiDAO transfer " + amount + " tokens from the treasury to " +
      process.env.WALLET_ADDRESS + " for being awesome?";
    const executions = [
      {
        // Again, we're sending ourselves 0 ETH. Just sending our own token.
        nativeTokenValue: 0,
        transactionData: token.encoder.encode(
          // We're doing a transfer from the treasury to our wallet.
          "transfer",
          [
            process.env.WALLET_ADDRESS,
            ethers.utils.parseUnits(amount.toString(), 18),
          ]
        ),
        toAddress: token.getAddress(),
      },
    ];

    await vote.propose(description, executions);

    console.log(
      "✅ Successfully created proposal to reward ourselves from the treasury, let's hope people vote for it!"
    );
  } catch (error) {
    console.error("failed to create second proposal", error);
  }
})();
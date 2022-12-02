import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

(async () => {
  try {
    const editionDrop = await sdk.getContract("0xfA80d6dE618b53A5E97962021df7be43cC3B157B", "edition-drop");
    await editionDrop.createBatch([
      {
        name: "Defi Cohort Graduate",
        description: "This NFT will give you access to the DefiDAO",
        image: readFileSync("scripts/assets/space.png"),
      },
    ]);
    console.log("✅ Successfully created a new NFT in the drop!");
  } catch (error) {
    console.error("failed to create the new NFT", error);
  }
})();

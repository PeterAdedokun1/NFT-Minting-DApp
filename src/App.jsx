import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import nftABIArtifact from "./MyNFTABI.json";
import { ethers } from "ethers";

const nftABI = nftABIArtifact.output.abi;
// Replace with your deployed NFT contract address
const nftAddress = import.meta.env.VITE_NFT_CONTRACT_ADDRESS
const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY
const PINATA_SECRET_API_KEY =import.meta.env.VITE_PINATA_SECRET_API_KEY
function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  const connectWallet = async () => {
    const [acc] = await window.ethereum.request({ method: "eth_requestAccounts" });
    setAccount(acc);

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    setContract(new ethers.Contract(nftAddress, nftABI, signer));
  };

  // Upload file to Pinata
  const uploadToIPFS = async () => {
    if (!file) return null;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_API_KEY,
      },
      body: formData,
    });

    const data = await res.json();
    return `ipfs://${data.IpfsHash}`;
  };

  // Upload metadata (JSON) to Pinata
  const uploadMetadata = async (imageUrl) => {
    const metadata = {
      name: "Dynamic NFT",
      description: "Minted directly from frontend!",
      image: imageUrl,
    };

    const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_API_KEY,
      },
      body: JSON.stringify(metadata),
    });

    const data = await res.json();
    return `ipfs://${data.IpfsHash}`;
  };

  const mintNFT = async () => {
    setStatus("Uploading to IPFS...");

    const imageUrl = await uploadToIPFS();
    if (!imageUrl) return alert("Upload failed");

    const metadataUrl = await uploadMetadata(imageUrl);

    setStatus("Minting NFT...");
    const tx = await contract.mintNFT(account, metadataUrl);
    await tx.wait();

    setStatus("✅ NFT Minted Successfully!");
  };

  return (
    <div className="p-6 max-w-md mx-auto shadow-lg rounded-lg bg-white">
      <h1 className="text-2xl font-bold mb-4">🖼 NFT Minting DApp</h1>

      {!account ? (
        <button
          onClick={connectWallet}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Connect Wallet
        </button>
      ) : (
        <div>
          <p><b>Connected:</b> {account}</p>

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="border p-2 w-full my-2"
          />

          <button
            onClick={mintNFT}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Mint NFT
          </button>

          <p className="mt-2">{status}</p>
        </div>
      )}
    </div>
  );
}

export default App
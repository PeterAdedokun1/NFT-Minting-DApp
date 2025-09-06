// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.22;

// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";

// contract MyNFT is ERC721URIStorage, Ownable {
//     uint256 public tokenCounter;

//     constructor(address initialOwner) ERC721("MyNFT", "MNFT") Ownable(initialOwner) {
//         tokenCounter = 0;
//     }

//     function mintNFT(address recipient, string memory tokenURI) public onlyOwner returns (uint256) {
//         uint256 newTokenId = tokenCounter;
//         _safeMint(recipient, newTokenId);
//         _setTokenURI(newTokenId, tokenURI);
//         tokenCounter++;
//         return newTokenId;
//     }

//     // ✅ Helper to get all minted token URIs
//     function getAllTokenURIs() public view returns (string[] memory) {
//         string[] memory uris = new string[](tokenCounter);
//         for (uint256 i = 0; i < tokenCounter; i++) {
//             uris[i] = tokenURI(i);
//         }
//         return uris;
//     }
// }

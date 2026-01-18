// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IBasingCounter {
    function achievementsClaimed(address user, uint256 milestone) external view returns (bool);
}

contract BasingNFT is ERC721, Ownable {
    uint256 private _nextTokenId;

    // Адрес контракта счетчика
    IBasingCounter public basingCounter;

    // Mapping от milestone к tokenId для пользователя
    mapping(address => mapping(uint256 => uint256)) public userMilestoneTokens;

    // Mapping от tokenId к milestone
    mapping(uint256 => uint256) public tokenMilestone;

    // Base URI для метаданных
    string private _baseTokenURI;

    // События
    event NFTMinted(address indexed user, uint256 indexed tokenId, uint256 milestone);

    constructor(address _basingCounter) ERC721("Still Basing Achievement", "BASING") Ownable(msg.sender) {
        basingCounter = IBasingCounter(_basingCounter);
        _baseTokenURI = "ipfs://QmYourBaseURIHere/";
    }

    // Минт NFT за достижение
    function mintAchievement(uint256 milestone) external {
        require(
            basingCounter.achievementsClaimed(msg.sender, milestone),
            "Achievement not unlocked"
        );
        require(
            userMilestoneTokens[msg.sender][milestone] == 0,
            "NFT already minted for this achievement"
        );

        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);

        userMilestoneTokens[msg.sender][milestone] = tokenId;
        tokenMilestone[tokenId] = milestone;

        emit NFTMinted(msg.sender, tokenId, milestone);
    }

    // Получить все NFT пользователя
    function getUserTokens(address user) external view returns (uint256[] memory) {
        uint256 balance = balanceOf(user);
        uint256[] memory tokens = new uint256[](balance);
        uint256 index = 0;

        for (uint256 i = 0; i < _nextTokenId; i++) {
            if (_ownerOf(i) == user) {
                tokens[index] = i;
                index++;
            }
        }

        return tokens;
    }

    // Обновить base URI (только владелец)
    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }

    // Переопределение _baseURI
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    // Token URI с учетом milestone
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");

        string memory baseURI = _baseURI();
        uint256 milestone = tokenMilestone[tokenId];

        return bytes(baseURI).length > 0
            ? string(abi.encodePacked(baseURI, _toString(milestone), ".json"))
            : "";
    }

    // Helper функция для конвертации uint256 в string
    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}

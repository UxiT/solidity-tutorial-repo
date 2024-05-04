// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

interface IERC721 {
    function transferFrom(address _from, address _to, uint256 _tokenId) external;
}

contract Escrow {

    address public nftAddress;
    uint256 public nftId;
    uint256 public purchasePrice;
    uint256 public escrowAmount;
    address payable public seller;
    address payable public buyer;
    address public lender;
    address public inspector;

    constructor(
        address _nftAddress,
        uint256 _nftId,
        uint256 _purchasePrice,
        uint256 _escrowAmount,
        address payable _seller,
        address payable _buyer,
        address _lender,
        address  _inspector
    ) {
        nftAddress = _nftAddress;
        nftId = _nftId;
        purchasePrice = _purchasePrice;
        escrowAmount = _escrowAmount;
        seller = _seller;
        buyer = _buyer;
        lender = _lender;
        inspector = _inspector;
    }

    function finalizeSale() public {
        IERC721(nftAddress).transferFrom(seller, buyer, nftId);
    }
}

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

    bool public inspectionPassed = false;
    mapping (address => bool) public approval;

    modifier onlyBuyer {
        require(msg.sender == buyer, 'Only buyer can call this function');
        _;
    }

    modifier onlyLender {
        require(msg.sender == lender, 'Only lender can call this function');
        _;
    }

    modifier onlyInspector  {
        require(msg.sender == inspector, 'Only inspector can call this function');
        _;
    }

    // receive() external payable  {}

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

    function depositEarnest() public payable onlyBuyer {
        require(msg.value >= escrowAmount, 'deposit value must be > or == ');
    }

    function depositLenderFunds() public payable onlyLender {
        require(msg.value + address(this).balance >= purchasePrice);

        uint diff = (msg.value + address(this).balance) - purchasePrice;

        if (diff > 0) {
            payable(lender).transfer(diff);
        }
    }

    function updateInspectionStatus(bool _inspectionPassed) public onlyInspector {
        inspectionPassed = _inspectionPassed;
    }

    function approveSale() public {
        approval[msg.sender] = true;
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function finalizeSale() public {
        require(inspectionPassed, 'must pass inspection');
        require(approval[buyer], 'must be approved by buyer');
        require(approval[seller], 'must be approved by seller');
        require(approval[lender], 'must be approved by lender');
        require(address(this).balance >= purchasePrice, 'must have enough eth');

        (bool success, ) = payable(seller).call{value: address(this).balance}(""); 
        require (success);

        IERC721(nftAddress).transferFrom(seller, buyer, nftId);
    }
}

// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "hardhat/console.sol";
import "./FlashLoan.sol";
import "./Token.sol";

contract FlashLoanReceiver {
    FlashLoan private pool;
    address private owner;

    event LoanReceived(address token, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can execute flash loan");
        _;
    }

    constructor(address _poolAddress) {
        pool = FlashLoan(_poolAddress);
        owner = msg.sender;
    }

    function receiveTokens(address _tokenAddress, uint256 _amount) external {
        require(msg.sender == address(pool), 'Sender must be token pool');
        require(Token(_tokenAddress).balanceOf(address(this)) == _amount, 'failed to get loan');

        emit LoanReceived(_tokenAddress, _amount);

        require(Token(_tokenAddress).transfer(msg.sender, _amount), "Transfer of tokens failed");

    }

    function executeFlashLoan(uint _amount) external onlyOwner {
        pool.flashLoan(_amount);
    }
} 
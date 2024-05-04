// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

contract Counter {
    string public name;
    uint public count;

    constructor(string memory _name, uint _initialCount) {
        name = _name;
        count = _initialCount;
    }

    function getCount() public view returns (uint newCount) {
        return count;
    }

    function increment() public returns (uint newCount) {
        count ++;
        return count;
    }

    function decrement() public returns (uint newCount) {
        count --;
        return count;
    }

    function getName() public view returns (string memory cuurentName) {
        return name;
    }

    function setName(string memory _newName) public returns (string memory newName) {
        name = _newName;
        return name;
    }
}
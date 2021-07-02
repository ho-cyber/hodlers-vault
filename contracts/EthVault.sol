// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./BaseVault.sol";

contract EthVault is BaseVault{
    constructor(address registryAddress, uint _releaseTimestampInSeconds) BaseVault(registryAddress, _releaseTimestampInSeconds) {
    }
    
    function transfer() override internal {
        owner.transfer(address(this).balance);
    }
    
    function fund() public payable {
        require(owner == msg.sender, "You are not the owner of this vault");
        require(msg.value > 0, "Value must be greater than zero");
    }
}
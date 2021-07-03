// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Registry.sol";

abstract contract BaseVault {
    address payable public owner;
    uint public releaseTimestampInSeconds;
    
    constructor(address registryAddress, string memory tokenSymbol, uint _releaseTimestampInSeconds) {
        owner = payable(msg.sender);
        releaseTimestampInSeconds = _releaseTimestampInSeconds;
        
        Registry registry = Registry(registryAddress);
        registry.register(address(this), tokenSymbol);
    }
    
    function release() public {
        require(msg.sender == owner, "You are not the owner of this vault");
        require(releaseTimestampInSeconds < block.timestamp, "Vault is not ready to be released");
        
        transfer();
    }
    
    function transfer() virtual internal;
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Registry.sol";

abstract contract BaseVault {
    address payable public owner;
    uint public releaseTimestampInSeconds;
    
    constructor(address registryAddress, uint _releaseTimestampInSeconds) {
        owner = payable(msg.sender);
        releaseTimestampInSeconds = _releaseTimestampInSeconds;
        
        // Note: this implementation is not perfect, but it's best for UX.
        Registry registry = Registry(registryAddress);
        registry.register(address(this));
    }
    
    function release() public {
        require(msg.sender == owner, "You are not the owner of this vault");
        require(releaseTimestampInSeconds < block.timestamp, "Vault is not ready to be released");
        
        transfer();
    }
    
    function transfer() virtual internal;
}
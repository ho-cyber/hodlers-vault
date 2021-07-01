// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

abstract contract BaseVault {
    address payable public owner;
    uint internal releaseTimestampInSeconds;
    
    constructor(uint _releaseTimestampInSeconds) {
        owner = payable(msg.sender);
        releaseTimestampInSeconds = _releaseTimestampInSeconds;
    }
    
    function release() public {
        require(msg.sender == owner, "You are not the owner of this vault");
        require(releaseTimestampInSeconds < block.timestamp, "Vault is not ready to be released");
        
        transfer();
    }
    
    function transfer() virtual internal;
}
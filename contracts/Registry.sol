// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./BaseVault.sol";

contract Registry {
    mapping(address => address[]) ownerToVaults;
    
    function register(address vaultAddress) public {
        BaseVault vault = BaseVault(vaultAddress);
        
        require(msg.sender == vault.owner(), "You are not the owner of this vault");
        
        address[] storage vaultAddresses = ownerToVaults[msg.sender];
        vaultAddresses.push(vaultAddress);
    }
    
    function getVaults() public view returns (address[] memory) {
        return ownerToVaults[msg.sender];
    }
}
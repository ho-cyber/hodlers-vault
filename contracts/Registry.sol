// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./BaseVault.sol";

contract Registry {
    struct Vault {
        address vaultAddress;
        string tokenSymbol;
    }
    
    // Keep track of which owner keeps which vaults.
    mapping(address => Vault[]) ownerToVaults;
    
    function register(address vaultAddress, string memory tokenSymbol) public {
        Vault[] storage vaultAddresses = ownerToVaults[tx.origin];
        vaultAddresses.push(Vault(vaultAddress, tokenSymbol));
    }
    
    function getVaults() public view returns (Vault[] memory) {
        return ownerToVaults[msg.sender];
    }
}
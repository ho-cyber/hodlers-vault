// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Registry {
    // Keep track of which owner keeps which vaults.
    mapping(address => address[]) ownerToVaults;
    
    function register(address vaultAddress) public {
        // Use tx.origin rather than msg.sender because this method can be called from another contract.
        // In such a case, its owner is associated with the signer (original sender) that initated the call chain.
        address[] storage vaultAddresses = ownerToVaults[tx.origin];
        vaultAddresses.push(vaultAddress);
    }
    
    function getVaults() public view returns (address[] memory) {
        return ownerToVaults[msg.sender];
    }
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./BaseVault.sol";
import "./IERC20.sol";

contract ERC20Vault is BaseVault{
    IERC20 immutable internal token;
 
    constructor(address tokenAddress, uint _releaseTimestampInSeconds) BaseVault(_releaseTimestampInSeconds) {
        token = IERC20(tokenAddress);
    }
    
    function transfer() override internal {
        token.transfer(owner, token.balanceOf(address(this)));
    }
}
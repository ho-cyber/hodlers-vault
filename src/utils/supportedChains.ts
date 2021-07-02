import tokens from './tokens';

export function chainIdToString(chainId: string) {
    switch(chainId) {
        case "0x1": 
            return "Mainnet"
        case "0x4":
            return "Rinkeby"
        default:
            return "Unknown"
    }
}

export function getTokenContractAddress(token: string, chainId: string) {
    return tokens[chainId][token];
}

export const chains = [
    "0x1", // Mainnet
    "0x4"  // Rinkeby
]
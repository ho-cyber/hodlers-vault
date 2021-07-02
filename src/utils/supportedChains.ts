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

export const chains = [
    "0x1", // Mainnet
    "0x4"  // Rinkeby
]
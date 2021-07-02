import Web3 from "web3";
import Registry from "../abis/Registry.json";

const web3 = new Web3(Web3.givenProvider);
export default new web3.eth.Contract(Registry.abi as any, "0x12a3b1B24f0e4f7A036A16a2aF8Fa46Ab7031676");
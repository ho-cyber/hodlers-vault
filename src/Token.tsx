import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import Web3 from "web3";
import ERC20Vault from './abis/ERC20Vault.json';
import BaseVault from './abis/BaseVault.json';
import EthVault from './abis/EthVault.json';
import IERC20 from './abis/IERC20.json';
import { selectWallet } from "./slices/walletSlice";
import { getSelectedAddress } from "./utils/metaMask";
import { getTokenContractAddress } from "./utils/supportedChains";

export default function Token(props: { token: string }) {
    const wallet = useSelector(selectWallet);
    const [loading, setLoading] = useState(false);
    const [funding, setFunding] = useState(false);
    const [releasing, setReleasing] = useState(false);
    const [balance, setBalance] = useState("N/A");

    useEffect(() => {
        (async () => {
            await getEthBalance("0xb79e9b1084a41052ba5e0585e23a1b953e77b9f1");
        })();
    });

    async function getBalanceOf(address: string) {
        const web3 = new Web3(Web3.givenProvider);
        const link = getTokenContract(web3);
        link.methods.balanceOf(address)
        .call((err: any, res: string) => res !== null && setBalance(web3.utils.fromWei(res)));
    }

    async function getEthBalance(address: string) {
        const web3 = new Web3(Web3.givenProvider);
        const ethVault = new web3.eth.Contract(EthVault.abi as any, address);
        web3.eth.getBalance(address, (err: any, res: string) => res !== null && setBalance(web3.utils.fromWei(res)));
    }

    async function createVault(e: any, token: string) {
        e.preventDefault();
        setLoading(true);
        const web3 = new Web3(Web3.givenProvider);
    
        if(token === "ETH"){
            const contract = new web3.eth.Contract(EthVault.abi as any);
            contract.deploy({
                data: EthVault.bytecode,
                arguments: ["0x12a3b1B24f0e4f7A036A16a2aF8Fa46Ab7031676", 0]
            })
            .send({
                from: await getSelectedAddress()
            })
            .finally(() => setLoading(false));
        }

        if(token === "LINK") {
            const contract = new web3.eth.Contract(ERC20Vault.abi as any);
            contract.deploy({
                data: ERC20Vault.bytecode,
                arguments: [ getTokenContractAddress(token, wallet.chainId as string), "0x12a3b1B24f0e4f7A036A16a2aF8Fa46Ab7031676", 0]
            })
            .send({
                from: await getSelectedAddress()
            })
            .finally(() => setLoading(false));
        }
    }

    async function fund(contractAddress: string, amount: number) {
        const web3 = new Web3(Web3.givenProvider);
        const link = getTokenContract(web3);
        link.methods.transfer(contractAddress, web3.utils.toWei(amount.toString()))
        .send({
            from: await getSelectedAddress()
        });
    }

    async function fundEth(vaultAddress: string, amount: number) {
        const web3 = new Web3(Web3.givenProvider);
        const ethVault = new web3.eth.Contract(EthVault.abi as any, vaultAddress);
        ethVault.methods.fund()
        .send({
            from: await getSelectedAddress(),
            value: web3.utils.toWei(amount.toString())
        });
    }

    async function release(address: string) {
        const web3 = new Web3(Web3.givenProvider);
        const contract = new web3.eth.Contract(BaseVault.abi as any, address);

        contract.methods.release()
        .send({
            from: await getSelectedAddress()
        });
    }

    function getTokenContract(web3: Web3) {
        // LINK token contract on Rinkeby: 0x01BE23585060835E02B77ef475b0Cc51aA1e0709
        return new web3.eth.Contract(IERC20.abi as any, "0x01BE23585060835E02B77ef475b0Cc51aA1e0709");
    }

    return <>
        <p>
            <button disabled={loading} onClick={e => createVault(e, props.token)}>Create Vault</button>
            {
                loading && <span>&nbsp; Creating {props.token} Vault...</span>
            }
        </p>
    
        <table>
            <thead>
                <th>Vault</th>
                <th>Balance</th>
                <th>Release Date</th>
                <th>Action</th>
            </thead>
            <tbody>
                <tr>
                    <td>0x52b0069e28e1e09e8873cc968fc996236f6df3a6 </td>
                    <td>{balance} LINK</td>
                    <td>2030-01-01</td>
                    <td><button onClick={() => fund("0x52b0069e28e1e09e8873cc968fc996236f6df3a6", 1)}>Fund</button> &nbsp; <button onClick={() => release("0x52b0069e28e1e09e8873cc968fc996236f6df3a6")}>Release</button></td>
                </tr>
                <tr>
                    <td>0x52b0069e28e1e09e8873cc968fc996236f6df3a6 </td>
                    <td>{balance} ETH</td>
                    <td>2030-01-01</td>
                    <td><button onClick={() => fundEth("0xb79e9b1084a41052ba5e0585e23a1b953e77b9f1", 1)}>Fund</button> &nbsp; <button onClick={() => release("0xb79e9b1084a41052ba5e0585e23a1b953e77b9f1")}>Release</button></td>
                </tr>
            </tbody>
        </table>
    </>
}
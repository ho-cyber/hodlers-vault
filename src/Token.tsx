import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import Web3 from "web3";
import ERC20Vault from './abis/ERC20Vault.json';
import BaseVault from './abis/BaseVault.json';
import EthVault from './abis/EthVault.json';
import IERC20 from './abis/IERC20.json';
import Registry from './abis/Registry.json';
import { selectWallet } from "./slices/walletSlice";
import { getSelectedAddress } from "./utils/metaMask";
import { getTokenContractAddress } from "./utils/supportedChains";

interface IVaults {
    [key: string] : Array<{
        address: string;
        balance: string;
        releaseDate: Date;
    }>
};

export default function Token(props: { token: string }) {
    const wallet = useSelector(selectWallet);
    const [loading, setLoading] = useState(false);
    const [funding, setFunding] = useState(false);
    const [releasing, setReleasing] = useState(false);
    const [vaults, setVaults] = useState({} as IVaults);
    const now = new Date();

    const registryAddress = "0x64e3A6F2443d135176F2c82FA9303DA6B4606412";
    const ethVault = "0x51c0caAE265E0Ec56c3D76516F1Ba094475AD0AD";

    useEffect(() => {
        (async () => {
            await getEthBalance(ethVault);
            await getVaults();
        })();
    }, []);

    async function parseVaults(web3: Web3, rawShit: Array<string>) {
        const vaults: IVaults = {};
        const vaultCount = rawShit.length;
        for (let i = 0; i < vaultCount; i++) {
            const vault = rawShit[i];
            const vaultAddress = vault[0];
            const tokenSymbol = vault[1];

            let balance: string;
            const releaseDate = new Date(await getReleaseTimestamp(vaultAddress) * 1000);
            if(tokenSymbol === "ETH"){
                balance = await getEthBalance(vaultAddress);
            }else{
                balance = await getBalanceOf(vaultAddress);
            }

            const vaultObject = {
                address: vaultAddress,
                balance,
                releaseDate
            };

            if (vaults[tokenSymbol]) {
                vaults[tokenSymbol].push(vaultObject);
            }else{
                vaults[tokenSymbol] = [vaultObject];
            }
        }
        return vaults;
    }

    async function getVaults() {
        const web3 = new Web3(Web3.givenProvider);
        const registry = new web3.eth.Contract(Registry.abi as any, registryAddress);

        registry.methods.getVaults().call({
            from: await getSelectedAddress()
        }, async (err: any, res: any) => setVaults(await parseVaults(web3, res)));
    }

    async function getReleaseTimestamp(address: string) {
        const web3 = new Web3(Web3.givenProvider);
        const contract = new web3.eth.Contract(BaseVault.abi as any, address);
        return await contract.methods.releaseTimestampInSeconds().call();
    }

    async function getBalanceOf(address: string) {
        const web3 = new Web3(Web3.givenProvider);
        const link = getTokenContract(web3);
        return web3.utils.fromWei(await link.methods.balanceOf(address).call());
    }

    async function getEthBalance(address: string) {
        const web3 = new Web3(Web3.givenProvider);
        return web3.utils.fromWei(await web3.eth.getBalance(address));
    }

    async function createVault(e: any, token: string) {
        e.preventDefault();
        setLoading(true);
        const web3 = new Web3(Web3.givenProvider);
    
        if(token === "ETH"){
            const contract = new web3.eth.Contract(EthVault.abi as any);
            contract.deploy({
                data: EthVault.bytecode,
                arguments: [registryAddress, 0]
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
                arguments: [ getTokenContractAddress(token, wallet.chainId as string), "LINK", registryAddress, 0]
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

    function formatDate(date: Date){
        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
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
                <th>Token</th>
                <th>Vault</th>
                <th>Balance</th>
                <th>Release Date</th>
                <th>Action</th>
            </thead>
            <tbody>
                {
                    Object.keys(vaults).map(token => 
                        vaults[token].map(vault => {
                            return <tr>
                            <td>{token}</td>
                            <td>{vault.address}</td>
                            <td>{vault.balance} {token}</td>
                            <td>{formatDate(vault.releaseDate)}</td>
                            <td><button onClick={() => token === "ETH" ? fundEth(vault.address, 1) : fund(vault.address, 1)}>Fund</button> &nbsp; <button disabled={now < vault.releaseDate} onClick={() => vault}>Release</button></td>
                        </tr>
                    }))
                }
            </tbody>
        </table>
    </>
}
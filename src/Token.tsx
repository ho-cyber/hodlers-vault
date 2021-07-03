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
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface IVaults {
    [key: string] : Array<{
        address: string;
        balance: string;
        releaseDate: Date;
    }>
};

export default function Token(props: { token: string }) {
    const wallet = useSelector(selectWallet);

    const [createMode, setCreateMode] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedToken, setSelectedToken] = useState("ETH");

    const [fundMode, setFundMode] = useState({} as {[key:string]: boolean});
    const [selectedAmount, setSelectedAmount] = useState("0");

    function setFundModeForVault(address: string, isFundMode: boolean) {
        setFundMode({
            [address]: isFundMode
        });
    }

    const [creatingVault, setCreatingVault] = useState(false);
    const [funding, setFunding] = useState({} as {[key:string]: boolean});
    const [releasing, setReleasing] = useState({} as {[key:string]: boolean});

    function setFundingForVault(address: string, isFunding: boolean) {
        setFunding({
            ...funding,
            [address]: isFunding
        });
    }

    function setReleasingForVault(address: string, isReleasing: boolean) {
        setReleasing({
            ...releasing,
            [address]: isReleasing
        });
    }

    const [vaults, setVaults] = useState({} as IVaults);
    const now = new Date();

    const registryAddress = "0x64e3A6F2443d135176F2c82FA9303DA6B4606412";
    const ethVault = "0x51c0caAE265E0Ec56c3D76516F1Ba094475AD0AD";

    useEffect(() => {
        (async () => {
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

    async function createVault(token: string) {
        setCreatingVault(true);
        const web3 = new Web3(Web3.givenProvider);
    
        if(token === "ETH"){
            const contract = new web3.eth.Contract(EthVault.abi as any);
            contract.deploy({
                data: EthVault.bytecode,
                arguments: [registryAddress, selectedDate.getTime() / 1000]
            })
            .send({
                from: await getSelectedAddress()
            })
            .finally(() => resetVaultFlags());
        }

        if(token === "LINK") {
            const contract = new web3.eth.Contract(ERC20Vault.abi as any);
            contract.deploy({
                data: ERC20Vault.bytecode,
                arguments: [ getTokenContractAddress(token, wallet.chainId as string), "LINK", registryAddress, selectedDate.getTime() / 1000]
            })
            .send({
                from: await getSelectedAddress()
            })
            .finally(() => resetVaultFlags());
        }
    }

    function resetVaultFlags() {
        setCreatingVault(false); setCreateMode(false)
    }

    async function fund(vaultAddress: string, amount: string) {
        setFundingForVault(vaultAddress, true);
        const web3 = new Web3(Web3.givenProvider);
        const link = getTokenContract(web3);
        link.methods.transfer(vaultAddress, web3.utils.toWei(amount.toString()))
        .send({
            from: await getSelectedAddress()
        })
        .finally(() => resetFundFlags(vaultAddress));
    }

    async function fundEth(vaultAddress: string, amount: string) {
        setFundingForVault(vaultAddress, true);
        const web3 = new Web3(Web3.givenProvider);
        const ethVault = new web3.eth.Contract(EthVault.abi as any, vaultAddress);
        ethVault.methods.fund()
        .send({
            from: await getSelectedAddress(),
            value: web3.utils.toWei(amount.toString())
        })
        .finally(() => resetFundFlags(vaultAddress));
    }

    function resetFundFlags(address: string) {
        setFundMode({});
        setSelectedAmount("0");
        setFundingForVault(address, false);
    }

    async function release(address: string) {
        setReleasingForVault(address, true);
        const web3 = new Web3(Web3.givenProvider);
        const contract = new web3.eth.Contract(BaseVault.abi as any, address);

        contract.methods.release()
        .send({
            from: await getSelectedAddress()
        })
        .finally(() => setReleasingForVault(address, false));
    }

    function getTokenContract(web3: Web3) {
        // LINK token contract on Rinkeby: 0x01BE23585060835E02B77ef475b0Cc51aA1e0709
        return new web3.eth.Contract(IERC20.abi as any, "0x01BE23585060835E02B77ef475b0Cc51aA1e0709");
    }

    function formatDate(date: Date){
        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    }

    function renderFundButton(token: string, vaultAddress: string) {
        return fundMode[vaultAddress] ? <> 
            <input type="number" value={selectedAmount} onChange={e=>setSelectedAmount(e.target.value)}/> &nbsp; 
            <button onClick={() => token === "ETH" ? fundEth(vaultAddress, selectedAmount) : fund(vaultAddress, selectedAmount)}>Go</button> &nbsp; 
            <button onClick={() => setFundModeForVault(vaultAddress, false)}>Cancel</button>
        </> : <button onClick={()=>setFundModeForVault(vaultAddress, true)}>Fund</button>
    }

    return <>
        <div>
            {
                !createMode ? <button disabled={creatingVault} onClick={() => setCreateMode(true)}>Create Vault</button> : <>
                    {
                        creatingVault ? <p>Creating {selectedToken} Vault. It could take up to 1 minute. Please wait...</p> : <>
                            <p>Choose the Release date. Please note that you can only do this ONCE. After that, you fund won't be available until the Release date and you won't be able to change it!</p>
                            <select onChange={e => setSelectedToken(e.target.value)} defaultValue={selectedToken}>
                                <option value="ETH">ETH</option>
                                <option value="LINK">LINK</option>
                            </select> &nbsp;
                            <DatePicker minDate={now} selected={selectedDate} onChange={(value: any) => setSelectedDate(value)}/> &nbsp; <button  onClick={e => createVault(selectedToken)}>Create Vault</button> &nbsp; <button onClick={() => setCreateMode(false)}>Cancel</button>
                        </>
                    }
                </>
            }
        </div>
    
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
                            <td>
                                {
                                    funding[vault.address] ? <span>Funding. It could take up to 1 minute...</span> :
                                    releasing[vault.address] ? <span>Releasing. It could take up to 1 minute...</span> : <>
                                        {renderFundButton(token, vault.address)} &nbsp; <button disabled={now < vault.releaseDate} onClick={() => release(vault.address)}>Release</button>
                                    </>
                                }
                            </td>
                        </tr>
                    }))
                }
            </tbody>
        </table>
    </>
}
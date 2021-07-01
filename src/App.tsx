import Web3 from 'web3';
import DatePicker from 'react-datepicker';
import ERC20Vault from './contracts/ERC20Vault.json';
import { useState } from 'react';
import "react-datepicker/dist/react-datepicker.css";

function App() {
  const [date, setDate] = useState(new Date());
  const [vaultContract, setVaultContract] = useState("");

  async function deploy(e: any) {
    e.preventDefault();
    console.log(date.getTime() / 1000);

    const web3 = new Web3(Web3.givenProvider);
    const accounts = await web3.eth.getAccounts();

    const contract = new web3.eth.Contract(ERC20Vault.abi as any);

    console.log(accounts);
    console.log(contract);

    contract.deploy({
      data: ERC20Vault.bytecode,
      arguments: [ "0x01BE23585060835E02B77ef475b0Cc51aA1e0709", 0]
    })
    .send({
      from: accounts[0]
    })
    .then(inst => setVaultContract(inst.options.address));
  }

  async function transfer() {
    // Transfer fund to the vault
  }

  function connect() {
    (window as any).ethereum.request({ method: 'eth_requestAccounts' });
  }


  return (
    <div className="App">
      <button onClick={() => connect()}>Connect</button><br/>
      <form onSubmit={e => deploy(e)}>
        <label>Choose the Release date. Please note that you can only do this ONCE. After that, you fund won't be available until the Release date and you won't be able to change it!</label><br/>
        <DatePicker selected={date} onChange={(value: any) => setDate(value)}/><br/>
        <button>Create Vault</button>
      </form>
      <button onClick={() => transfer()}>Transfer fund to your Vault </button>
    </div>
  );
}

export default App;

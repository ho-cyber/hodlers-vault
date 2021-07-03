import { Button, Container, Message } from "semantic-ui-react";
import imageHodl from "../assets/hodl.jpg";
import imageVault from '../assets/vault.jpg';
import imageDip from '../assets/dip.jpg';
import imageEthereum from '../assets/2586005.png';
import imageIPFS from '../assets/ipfs.png';

export default function LandingPage() 
{
    const block = {
        display: "block",
        width: "300px",
        fontSize: "1.1em",
    }

    return  <Container style={{ width: '650px', marginTop: '20px'}}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <Message style={block}>Welcome to HODLer's Vault. HODLing is hard. But don't worry, we got you.</Message>
            <div style={{ ...block, textAlign: 'center' }}>
                <img src={imageHodl} width='80%' height='80%'/>
            </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div style={{ ...block, textAlign: 'center' }}>
                <img src={imageVault} width='30%' height='30%'/>
            </div>
            <Message style={block}>With HODLer's Vault, your tokens are locked in a vault that YOU own and only YOU have access to.</Message>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <Message style={block}>You cannot withdraw your tokens until the Release date that you set, and this prevents you from premature selling.</Message>
            <div style={{ ...block, textAlign: 'center' }}>
                <img src={imageDip} width='70%' height='70%'/>
            </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div style={{ ...block, textAlign: 'center' }}>
                <img src={imageEthereum} width='30%' height='30%'/>
                <img src={imageIPFS} width='30%' height='30%'/>
            </div>
            <Message style={block}>HODLer's Vault is secured by the Ethereum blockchain and hosted on IPFS. We don't run on any centralized server, or have access to your funds. It's fully decentralized.</Message>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', margin: 50}}>
            <Button primary>
                So what are you waiting for? Join the Diamond Hand League.
            </Button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end'}}>
            <small>Currently, for the testing purpose, we support ETH and LINK on the Rinkeby network. More are comming soon.</small>
        </div>
    </Container>
}
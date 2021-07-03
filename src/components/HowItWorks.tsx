import { Container, Divider, Header } from "semantic-ui-react";
import imageCreateVault from '../assets/createVault.png';
import imageOwnership from '../assets/ownership.png';
import imageFund from '../assets/fund.png';
import imageRelease from '../assets/release.png';
import imageEvil from '../assets/evil.png';

export function HowItWorks() {
    return <Container style={{ marginTop: 50, textAlign: 'center', fontSize: '1.1em', width: 700}} >
        <div>
            <Header as="h1">Creating Vault</Header>
            <p>
                When you create a new vault, it will be deployed by YOU as a smart contract on the Ethereum blockchain, with YOU being the owner of it.
            </p>
            <p>Only the owner can fund and release the vault.</p>
        </div>
        <div>
            <img src={imageCreateVault}/>
            <img src={imageOwnership}/>
        </div>
        <Divider/>
        <div>
            <Header as="h1">Funding</Header>
            <p>
                The owner can fund the vault with Ether or any other token on the Ethereum blockchain.
            </p>
        </div>
        <div>
            <img src={imageFund}/>
        </div>
        <Divider/>
        <div>
            <Header as="h1">Releasing</Header>
            <p>The owner can release the fund from the vault when the Release date is reached.</p>
        </div>
        <div>
            <img src={imageRelease}/>
        </div>
        <Divider/>
        <div>
            <Header as="h1">Ownership</Header>
            <p>Nobody can fund or withdraw from the Vault without being an owner. That means we don't have access to your funds, neither do any other people.</p>
        </div>
        <div>
            <img src={imageEvil}/>
        </div>
    </Container>
}
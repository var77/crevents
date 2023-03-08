# Web3Events

## Setup

```
npm install
```

## Run

1. Run local hardhat blockchain
```
npx nx serve smart-contracts
```
2. Deploy smart contract on local hardhat blockchain
```
npx nx build smart-contracts
```
3. Start front end
```
npx nx serve evnets-ui
```


## Change network on metamask
1. If there's no `localhost:8545` network, click add network and manually set address to `localhost:8545`

2. Then import accounts you got when running hardhat blockchain to metamask

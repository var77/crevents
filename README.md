# Crevents - Crypto Events

May your next event live on blockchain


## About
Crevetns is an open source project demonstrating a usecase of blockchain for organizing and attending events.



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
npx nx serve events-ui
```
4. Run Cloudflare workers [optional]
```
npx nx run-many --target=server --projects="image-uploader,metadata-server"
```

## Cloudflare Workers
There are two workers `image-uploader` and `metadata-server`

### Image Uploader Worker
This cloudflare worker is used to store event images. It is using R2 buckets to store images and Google Recaptcha v3 to protect againts spam.

### Metadata Server Worker
This cloudflare worker is used to dynamically get data for event **SBT** tokens. Event smart contract is returning this workers URI + chainId + contractId + tokenId as `tokenUri` 
so it will look something like `https://metadata.crevents.xyz/137/0x05242D4AC717Cdf38C36AF290F2b0DA99AA82c67/1`.
This metadata server will call smart contract from corresponding RPC detected from chainId and take event information.
Then it will construct `ERC721` standard json returning it to client, so wallets like metamask may show the event image for the token.
The json then will be cached in `KV` store.

## Change network on metamask
1. If there's no `localhost:8545` network, click add network and manually set address to `localhost:8545`

2. Then import accounts you got when running hardhat blockchain to metamask


## To Use recaptcha
```
cd projects/image-uploader
npx wrangler secret put RECAPTCHA_SECRET
```

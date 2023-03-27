<a name="readme-top"></a>
<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/var77/crevents">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Crevents</h3>

  <p align="center">
    Let your next event live on blockchain
    <br />
    <br />
    <a href="https://crevents.xyz">View Demo</a>
    ·
    <a href="https://github.com/var77/crevents/issues">Report Bug</a>
    ·
    <a href="https://github.com/var77/crevents/issues">Request Feature</a>
  </p>
</div>

# Crevents - Crypto Events

Crevents is a decentralized event management system compatible with EVM blockchains and is done using Solidity smart contracts.

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>


<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]](https://crevents.xyz)

Crevetns is an open source project demonstrating a usecase of blockchain for organizing and attending events.
Crevents allows event organizers to create and manage events using a decentralized platform. 
The system uses a token-based ticketing system that allows event organizers to sell tickets directly to attendees, eliminating the need for intermediaries.
And attendees will get [SBT](https://github.com/var77/erc721a-sbt) tokens which are like NFTs, but can not be transferred.

### Features

- Create and manage events
- Sell tickets directly to attendees
- Set ticket prices and maximum number of participants
- Whitelist registration to restrict event attendance to approved participants (WIP)
- Check-in attendees using the event's smart contract
- Get event ticket with attendee signature (to then use ecRecover for validating event without transaction)
- Verify event QR code using ecRecover to get the address of attendee and check if he exists in participants list or no
- View event information and attendance records


### Built With

* [![Solidity][Solidity]][Solidity-url]
* [![React][React.js]][React-url]
* [![NodeJS][NodeJS]][Node-url]

<!-- USAGE EXAMPLES -->
## Usage

TODO
<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- GETTING STARTED -->
## Getting Started
To install and run the project locally follow the steps
### Installation

Project is using [nx](https://nx.dev/) for monorepo management.


Install dependencies
```
npm install
```

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

### Cloudflare Workers
There are two workers `image-uploader` and `metadata-server`

**Image Uploader Worker**
This cloudflare worker is used to store event images. It is using R2 buckets to store images and Google Recaptcha v3 to protect againts spam.

**Metadata Server Worker**
This cloudflare worker is used to dynamically get data for event **SBT** tokens. Event smart contract is returning this workers URI + chainId + contractId + tokenId as `tokenUri` 
so it will look something like `https://metadata.crevents.xyz/137/0x05242D4AC717Cdf38C36AF290F2b0DA99AA82c67/1`.
This metadata server will call smart contract from corresponding RPC detected from chainId and take event information.
Then it will construct `ERC721` standard json returning it to client, so wallets like metamask may show the event image for the token.
The json then will be cached in `KV` store.

Some RPCs URIs needs to be stored on secrets, check `wrangler.toml` for more information.

**Change network on metamask**
1. If there's no `localhost:8545` network, click add network and manually set address to `localhost:8545`
2. Then import accounts you got when running hardhat blockchain to metamask


**To Use recaptcha**
```
cd projects/image-uploader
npx wrangler secret put RECAPTCHA_SECRET
```

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat(my feature): add some amazing feature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request to `develop` branch

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/var77/crevents.svg?style=for-the-badge
[contributors-url]: https://github.com/var77/crevents/graphs/contributors
[stars-shield]: https://img.shields.io/github/stars/var77/crevents.svg?style=for-the-badge
[stars-url]: https://github.com/var77/crevents
[license-shield]: https://img.shields.io/github/license/var77/crevents.svg?style=for-the-badge
[license-url]: https://github.com/var77/crevents/blob/master/LICENSE.txt
[product-screenshot]: images/screenshot.png
[Solidity] https://img.shields.io/badge/Solidity-e6e6e6?style=for-the-badge&logo=solidity&logoColor=black
[Solidity-url] https://soliditylang.org/
[NodeJS] https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white
[Node-url] https://nodejs.org
[NodeJS] https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white
[Node-url] https://nodejs.org
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/


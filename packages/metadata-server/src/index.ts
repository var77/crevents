import Web3 from 'web3';

const abi = [
  {
    inputs: [
      { internalType: 'uint256', name: 'currTimestamp', type: 'uint256' },
    ],
    name: 'getEventInfo',
    outputs: [
      {
        components: [
          { internalType: 'address', name: 'addr', type: 'address' },
          { internalType: 'address', name: 'organizer', type: 'address' },
          { internalType: 'bool', name: 'registrationOpen', type: 'bool' },
          {
            internalType: 'bool',
            name: 'onlyWhitelistRegistration',
            type: 'bool',
          },
          { internalType: 'bool', name: 'isRegistered', type: 'bool' },
          { internalType: 'bool', name: 'isChecked', type: 'bool' },
          { internalType: 'uint256', name: 'maxParticipants', type: 'uint256' },
          { internalType: 'uint256', name: 'registrationEnd', type: 'uint256' },
          { internalType: 'uint256', name: 'start', type: 'uint256' },
          { internalType: 'uint256', name: 'end', type: 'uint256' },
          { internalType: 'uint256', name: 'ticketPrice', type: 'uint256' },
          {
            internalType: 'uint256',
            name: 'preSaleTicketPrice',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'registeredParticipantCount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'checkedParticipantCount',
            type: 'uint256',
          },
          { internalType: 'string', name: 'name', type: 'string' },
          { internalType: 'string', name: 'description', type: 'string' },
          { internalType: 'string', name: 'link', type: 'string' },
          { internalType: 'string', name: 'image', type: 'string' },
          { internalType: 'string', name: 'location', type: 'string' },
        ],
        internalType: 'struct Utils.EventInfoStruct',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

export interface Env {
  METADATA_STORE: KVNamespace;
}

const RPS_LIST = {
  31337: 'http://127.0.0.1:8545/',
};

const isValidChain = (chain: string) => {
  return !!RPS_LIST[chain];
};
const isValidTokenId = (tokenId: string) => Number.isFinite(+tokenId);
const isValidAddress = (address: string) => {
  try {
    return !!address.toLowerCase().match(/0x[a-f0-9]{40}/g);
  } catch (err) {
    return false;
  }
};

const responseHeaders = { 'content-type': 'application/json' };
const successResponse = (data: object) =>
  new Response(JSON.stringify(data), { headers: responseHeaders });

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
  'Access-Control-Max-Age': '86400',
};
function handleOptions(request: Request) {
  let headers = request.headers;
  if (
    headers.get('Origin') !== null &&
    headers.get('Access-Control-Request-Method') !== null &&
    headers.get('Access-Control-Request-Headers') !== null
  ) {
    let respHeaders = {
      ...corsHeaders,
      'Access-Control-Allow-Headers': request.headers.get(
        'Access-Control-Request-Headers'
      ),
    };
    return new Response(null, {
      headers: respHeaders,
    });
  } else {
    return new Response(null, {
      headers: {
        Allow: 'GET, HEAD, POST, OPTIONS',
      },
    });
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return handleOptions(request);
    }

    const [chain, address, tokenId] = request.url.split('/').slice(-3);
    if (
      !isValidChain(chain) ||
      !isValidAddress(address) ||
      !isValidTokenId(tokenId)
    ) {
      return new Response('Bad request', { status: 400 });
    }

    const provider = new Web3.providers.HttpProvider(RPS_LIST[chain]);
    const web3 = new Web3(provider);
    const cachedJson = await env.METADATA_STORE.get(address);
    if (cachedJson)
      return successResponse({ ...JSON.parse(cachedJson), tokenId });

    const contract = new web3.eth.Contract(abi, address);
    const info = await contract.methods
      .getEventInfo(Math.floor(Date.now() / 1000))
      .call();
    const metadataJson = {
      name: info.name,
      image: info.image,
      attributes: [
        { trait_type: 'location', value: info.location },
        { trait_type: 'description', value: info.description },
        { trait_type: 'link', value: info.link },
        { trait_type: 'price', value: info.ticketPrice },
        {
          trait_type: 'start',
          value: new Date(+info.start * 1000).toLocaleDateString(),
        },
        {
          trait_type: 'end',
          value: new Date(+info.end * 1000).toLocaleDateString(),
        },
      ],
    };
    await env.METADATA_STORE.put(address, JSON.stringify(metadataJson));
    return successResponse({ ...metadataJson, tokenId });
  },
};

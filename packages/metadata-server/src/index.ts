export interface Env {
  METADATA_STORE: KVNamespace;
}

const SIGNATURES = {
  name: '0x06fdde03',
  image: '0xf3ccaac0',
  ticketPrice: '0x1209b1f6',
  start: '0xbe9a6555',
};

const RPS_LIST = {
  31337: 'http://127.0.0.1:8545/',
  80001: MUMBAI_RPC_URL, // this is from secrets
  137: 'https://polygon-rpc.com/',
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

function decodeParameter(type, value) {
  switch (type) {
    case 'string':
      const strLen = parseInt(value.substring(64, 128), 16) * 2; // get string length from hex string
      const hexStr = value.substring(128, 128 + strLen); // get hex string representation of the string
      return hexToString(hexStr).slice(1); // decode hex string to string
    case 'uint256':
      return parseInt(value, 16); // parse hex string to integer
    default:
      throw new Error(`Unsupported type: ${type}`);
  }
}

function hexToString(hex) {
  let str = '';
  for (let i = 0; i < hex.length; i += 2) {
    const charCode = parseInt(hex.substr(i, 2), 16);
    if (charCode === 0) break; // stop decoding when null character is encountered
    str += String.fromCharCode(charCode);
  }
  return str;
}

const doRPCCall = async (url: string, address: string, data: string) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_call',
      params: [
        {
          to: address,
          data,
        },
        'latest',
      ],
    }),
  });
  const json = await response.json();
  return json.result;
};

const getEventInfo = async (url: string, address: string) => {
  const [nameHex, imageHex, priceHex, startHex] = await Promise.all([
    doRPCCall(url, address, SIGNATURES.name),
    doRPCCall(url, address, SIGNATURES.image),
    doRPCCall(url, address, SIGNATURES.ticketPrice),
    doRPCCall(url, address, SIGNATURES.start),
  ]);

  return {
    name: decodeParameter('string', nameHex),
    image: decodeParameter('string', imageHex),
    ticketPrice: decodeParameter('uint256', priceHex),
    start: decodeParameter('uint256', startHex),
  };
};

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

    const cachedJson = await env.METADATA_STORE.get(address);
    if (cachedJson)
      return successResponse({ ...JSON.parse(cachedJson), tokenId });

    const info = await getEventInfo(RPS_LIST[chain], address);
    console.log(info);

    const metadataJson = {
      name: info.name,
      image: info.image,
      attributes: [
        { trait_type: 'price', value: info.ticketPrice },
        {
          trait_type: 'start',
          value: new Date(+info.start * 1000).toLocaleDateString(),
        },
      ],
    };
    await env.METADATA_STORE.put(address, JSON.stringify(metadataJson));
    return successResponse({ ...metadataJson, tokenId });
  },
};

import { Select } from 'antd';
import { Footer } from 'antd/es/layout/layout';
import { useEffect, useState } from 'react';
import {
  getSelectedNetwork,
  changeNetwork,
  AVAILABLE_NETWORKS,
} from '../../utils/helpers';
import './Footer.css';

const year = new Date().getFullYear();
const options = Object.entries(AVAILABLE_NETWORKS).reduce(
  (acc, el: [string, { chainName: string }]) => {
    acc.push({ label: el[1].chainName, value: el[0] });
    return acc;
  },
  []
);
export default function FooterComponent() {
  const [selectedNetwork, setSelectedNetwork] = useState(null);

  const getNetworkId = async () => {
    const chainId = (await getSelectedNetwork()).toString();
    if (AVAILABLE_NETWORKS[chainId]) {
      setSelectedNetwork(chainId);
    }
  };
  useEffect(() => {
    getNetworkId();
  }, []);

  const onSelect = (chainId: string) => {
    setSelectedNetwork(chainId);
    changeNetwork(chainId);
  };

  console.log({ selectedNetwork }, options);
  return (
    <Footer
      style={{
        backgroundColor: 'transparent',
        color: 'white',
        fontWeight: 700,
      }}
    >
      <Select
        value={selectedNetwork}
        style={{ width: 120 }}
        dropdownMatchSelectWidth={false}
        placement="topLeft"
        onSelect={onSelect}
        options={options}
      />
      <div className="footer">
        <div>C {year} Crevents</div>
      </div>
    </Footer>
  );
}

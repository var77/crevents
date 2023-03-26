import { Select } from 'antd';
import { Footer } from 'antd/es/layout/layout';
import {
  getSelectedNetwork,
  changeNetwork,
  AVAILABLE_NETWORKS,
} from '../../utils/helpers';
import './Footer.css';

export default function FooterComponent() {
  return (
    <Footer
      style={{
        backgroundColor: 'transparent',
        color: 'white',
        fontWeight: 700,
      }}
    >
      {!window.isInjectedProvider && (
        <Select
          defaultValue={getSelectedNetwork()}
          style={{ width: 120 }}
          dropdownMatchSelectWidth={false}
          placement="topLeft"
          onSelect={(chainId) => changeNetwork(chainId)}
          options={AVAILABLE_NETWORKS}
        />
      )}
      <div className="footer">
        <div>C 2023 Crevents</div>
      </div>
    </Footer>
  );
}

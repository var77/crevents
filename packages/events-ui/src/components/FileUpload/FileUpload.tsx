import React, { useState } from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
import type { UploadChangeParam } from 'antd/es/upload';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';

type FileUploadTypes = {
  imageUrl: string;
  setImageUrl: (el: string) => void;
};

const FileUpload: React.FC<FileUploadTypes> = ({ imageUrl, setImageUrl }) => {
  const [loading, setLoading] = useState(false);

  const handleChange: UploadProps['onChange'] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    } else {
      setLoading(false);
      setImageUrl(
        'https://image-hots-crevent.s3.us-east-1.amazonaws.com/D4RK7ET_background_for_website_where_you_create_events_and_user_b3e46a28-3201-4bad-8655-c9e019954a06.png'
      );
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Upload
      name="avatar"
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
      onChange={handleChange}
    >
      {imageUrl ? (
        <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
      ) : (
        uploadButton
      )}
    </Upload>
  );
};

export default FileUpload;

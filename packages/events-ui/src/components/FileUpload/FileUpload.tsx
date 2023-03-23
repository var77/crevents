import React, { useState } from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
import type { UploadChangeParam } from 'antd/es/upload';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';

type FileUploadTypes = {
  imageUrl: string;
  setImageUrl: (el: string) => void;
};

const UPLOAD_URL = 'https://image-uploader.crevents-images.workers.dev/upload';
const headers = new Headers({
  // just to avoid crawlers and scanners
  Authorization: `Basic ${btoa('cr3vents:cr3v3nts!')}`,
});

const FileUpload: React.FC<FileUploadTypes> = ({ imageUrl, setImageUrl }) => {
  const [loading, setLoading] = useState(false);

  const onUpload = (options): Promise<string> => {
    return new Promise((resolve, reject) => {
      setLoading(true);
      const reader = new FileReader();
      reader.readAsDataURL(options.file);
      reader.onload = async () => {
        const result = await fetch(UPLOAD_URL, {
          headers,
          method: 'PUT',
          body: JSON.stringify({ body: (reader.result as string).split('base64,')[1] }),
        });
        const url = await result.text();
        setImageUrl(url);
        resolve(url);
      setLoading(false);
      };
      reader.onerror = (error) => reject(error);
    });
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
      customRequest={onUpload}
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

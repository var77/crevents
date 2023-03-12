import React, { useState } from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
import type { UploadChangeParam } from 'antd/es/upload';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';


type FileUploadTypes = {
  imageUrl: string,
  setImageUrl: (el: string) => void
}

const FileUpload: React.FC<FileUploadTypes> = ( { imageUrl, setImageUrl} ) => {
  const [loading, setLoading] = useState(false);

  console.log(imageUrl, 'asdasdasd');
  
  const handleChange: UploadProps['onChange'] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    } else {
      setLoading(false);
      setImageUrl(
        'https://user-images.githubusercontent.com/17221195/223807313-9953d73e-f8a8-42a6-ba74-96efb1da1c0c.png'
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
        <img src={imageUrl}  alt="avatar" style={{ width: '100%' }} />
      ) : (
        uploadButton
      )}
    </Upload>
  );
};

export default FileUpload;

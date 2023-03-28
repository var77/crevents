import React, { useState } from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Modal, Upload } from 'antd';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

type FileUploadTypes = {
  imageUrl: string;
  setImageUrl: (el: string) => void;
};

const UPLOAD_URL = 'https://upload.crevents.xyz/upload';
//const UPLOAD_URL = 'http://localhost:8787/upload';
const headers = new Headers({
  // just to avoid crawlers and scanners
  Authorization: `Basic ${btoa('cr3vents:cr3v3nts!')}`,
});

const FileUpload: React.FC<FileUploadTypes> = ({ imageUrl, setImageUrl }) => {
  const [loading, setLoading] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();

  const onUpload = (options): Promise<string> => {
    return new Promise((resolve, reject) => {
      setLoading(true);
      const reader = new FileReader();
      reader.readAsDataURL(options.file);
      reader.onload = async () => {
        try {
        const img = (reader.result as string).split('base64,')[1];
        const recaptchaToken = await executeRecaptcha('upload');

        const result = await fetch(UPLOAD_URL, {
          headers,
            method: 'PUT',
            body: JSON.stringify({ body: img, recaptchaToken }),
          });
          const url = await result.text(); 
          if(!(result.status === 200)) {            
            throw new Error(url);
          } 
          setImageUrl(url);
          resolve(url);
          setLoading(false);
          console.log(url, result.status, 'url');
          
        }  catch(e) {
          setLoading(false)
          return Modal.error({
            title: e.message,
          });
          
        }
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

'use client'
import React, { useState } from 'react';
import { FaPlus } from "react-icons/fa6";
import { Modal, Upload, message } from 'antd';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { usePathname } from 'next/navigation';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const FormUpload = ({fileList, setFileList}: {fileList:UploadFile[], setFileList: any}) => {

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const pathname = usePathname();

    const uploadButton = (
        <div>
            <button style={{ border: 0, background: 'none' }} type="button">
                <div className='ms-7'><FaPlus /></div>
                <div style={{ marginTop: 8 }}>Subir Imagen</div>
            </button>
        </div>
      );

    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    if(pathname != '/edit'){
        setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
    } else {
        setPreviewTitle('')
    }
    };
    
    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    }

    const beforeUploadFn = (file: any) => {
        const fileType = file.type;
        if(fileType != 'image/jpeg' && fileType != 'image/png'){
            message.error(`El archivo seleccionado no es una imagen .JPEG o .PNG`);
            return Upload.LIST_IGNORE;
        }
    }

    return(
        <>
            <div className=''>
                <Upload
                beforeUpload={(file) => beforeUploadFn(file)}
                maxCount={3}
                listType="picture-card"
                fileList={fileList}
                onChange={handleChange}
                onPreview={handlePreview}>
                    {fileList.length >= 3 ? null : uploadButton}
                </Upload>
                <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        </>
    )
}

export default FormUpload
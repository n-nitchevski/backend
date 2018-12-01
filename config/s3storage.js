import AWS from 'aws-sdk';

import { aws } from './aws';

export default class S3Store {
  constructor(bucket = aws.Bucket) {
    AWS.config.update({
      accessKeyId: aws.accessKeyId,
      secretAccessKey: aws.secretAccessKey,
    });
    AWS.config.update({
      region: aws.region,
    });
    this.s3 = new AWS.S3();
    this.bucket = bucket;
  }

  async upload(key, file) {
    const params = {
      Bucket: this.bucket,
      Key: `${key}/${file.name}`,
      Body: file.data, // req.file.path
            // ContentEncoding: 'base64',
      Metadata: {
        'Content-Type': file.type,
      },
      ACL: 'public-read',
    };
    return new Promise((res, rej) => this.s3.upload(params, (error, data) => {
      if (error) {
        console.log('Error uploading data: ', error);
        rej(error);
      } else {
        console.log('link', data.Location);
        res(data.Location);
      }
    }));
  }

  async multiUpload(key, files) {
    try {
      const arr = Array.isArray(files) ? files : [files];
      const uploadedFiles = arr.map(file => this.upload(key, file));
      return Promise.all(uploadedFiles);
    } catch (error) {
      throw error;
    }
  }

  async removeFiles(key, files) {
    const arrayOfFiles = Array.isArray(files) ? files : [files];
    const params = {
      Bucket: this.bucket,
      Delete: {
        Objects: arrayOfFiles.map((file) => {
          const arr = file.split('/');
          return ({ Key: `${key}/${decodeURI(arr[arr.length - 1])}` });
        }),
      },
    };

    return new Promise((res, rej) => this.s3.deleteObjects(params, (error, data) => {
      if (error) {
        console.log(error, error.stack);
        rej(error);
      } else {
        console.log('deleted object: ', data);
        res(data);
      }
    }));
  }
}

import { Injectable } from '@angular/core';
import { S3 } from 'aws-sdk';
import { Auth } from 'aws-amplify';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})


export class S3Service {
// Function to construct the public URL for a file in the S3 bucket
getPublicUrl(filePath: string): string {
  return `https://${environment.s3Bucket}.s3.${environment.s3Region}.amazonaws.com/${environment.s3Prefix}/${filePath}`;
}
  

  async getSignedUrl(filePath: string): Promise<string> {
    const credentials = await Auth.currentCredentials();
    const s3 = new S3({
      credentials: Auth.essentialCredentials(credentials),
      region: environment.s3Region });

    const params = {
      Bucket: environment.s3Bucket, // your bucket name
      Key: environment.staticImagePath+`/${filePath}`, // file path in bucket
      Expires: 60060 // time in seconds until the pre-signed URL expires
    };

    return new Promise((resolve, reject) => {
      s3.getSignedUrl('getObject', params, (err, url) => {
        if (err) {
          reject(err);
        } else {
          resolve(url);
        }
      });
    });
  }

  async uploadFile(file: File, filePath: string,metadata: any): Promise<void> {
    const credentials = await Auth.currentCredentials();
    const s3 = new S3({
      credentials: Auth.essentialCredentials(credentials),
      region: environment.s3Region
    });

    const params = {
      Bucket: environment.s3Bucket,
      Key: `${filePath}`,
      Body: file,
      Metadata: metadata
    };

    return new Promise((resolve, reject) => {
      s3.upload(params, function(err: Error, data: S3.ManagedUpload.SendData) {
        if (err) {
          reject(err);
        } else {
          // You can use 'data' here as needed. 
          console.log('Upload Success', data);
          resolve();
        }
      });
    });
  }
}

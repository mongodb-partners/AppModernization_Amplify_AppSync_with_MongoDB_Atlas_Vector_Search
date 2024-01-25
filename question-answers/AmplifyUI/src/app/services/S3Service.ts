import { Injectable } from '@angular/core';
import { S3 } from 'aws-sdk';
import { Auth } from 'aws-amplify';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class S3Service {

  async uploadFile(file: File, filePath: string, category: string): Promise<string> {
    const credentials = await Auth.currentCredentials();
    const s3 = new S3({
      credentials: Auth.essentialCredentials(credentials),
      region: environment.s3Region
    });

    const params = {
      Bucket: environment.s3Bucket,
      Key: filePath,
      Body: file,
      ContentType: file.type,
      Metadata: { 
        'category': category  
      }
    };

    return new Promise((resolve, reject) => {
      s3.upload(params, (err: any, data: { Location: string | PromiseLike<string>; }) => {
        if (err) {
          reject(err);
        } else {
          resolve(data.Location);
        }
      });
    });
  }
}

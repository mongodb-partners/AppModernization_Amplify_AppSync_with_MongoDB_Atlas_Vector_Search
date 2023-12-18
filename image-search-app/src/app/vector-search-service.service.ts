import { Injectable } from '@angular/core';
import { API } from 'aws-amplify';
@Injectable({
  providedIn: 'root'
})
export class VectorSearchServiceService {

  async callSageMakerEndpoint(base64String: string): Promise<any> {
    const apiName = 'vectorsearchapi';
    const path = '/dev/vectorsearchresource';
    const myInit = {
      
      body: { "body": base64String },
      headers: {
        'Content-Type': 'application/json'
      },
      responseType: 'json'
    };

    return API.post(apiName, path, myInit);
  }

  
}

# MongoDB Atlas Data API

## Enabling the Data API

1. **Log into MongoDB Atlas**:
   - Navigate to [MongoDB Atlas](https://cloud.mongodb.com/) and log in with your credentials.

2. **Select Your Project**:
   - From the MongoDB Atlas dashboard, select the project you want to enable the Data API for.

3. **Navigate to Data API Settings**:
   - In the left-hand sidebar, click on "Data API".

4. **Enable Data API**:
   - Toggle the switch to enable the Data API for your project.

5. **Note the Base URL**:
   - Once the Data API is enabled, you will see a base URL. This URL is used to interact with the Data API.

## Creating an API Key for Data API

1. **Navigate to API Keys**:
   - In the left-hand sidebar, click on "Access Management" and then select "API Keys".

2. **Create a New API Key**:
   - Click on the "Create API Key" button.

3. **Configure the API Key**:
   - Enter a description for the API Key to help you identify it later.
   - Assign roles to the API Key. For the Data API, you will typically need the `Data API` role. Depending on your use case, you may also need additional roles (e.g., `readWriteAnyDatabase`).

4. **Save the API Key**:
   - Click "Save" to generate the API Key.
   - Make sure to copy the API Key and store it securely, as you won't be able to view it again.
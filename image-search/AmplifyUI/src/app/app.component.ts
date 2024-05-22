import { Component } from '@angular/core';
import { VectorSearchServiceService } from './vector-search-service.service';
import { APIService } from './API.service';
import { S3Service } from './services/S3Service';
import { environment } from '..//environments/environment';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'vector-search-app';
  responseBody: any;
  itemDetails: any[] = [];
  isAuthenticated = false;
  isLoading = false;
  uploadedImageName: string = '';
  uploadedImagePreviewUrl: string | ArrayBuffer | null = null;
  errorMessage: string = '';
  selectedCategory: string = '';
  categories = ['ecommerce', 'furniture', 'electronics','food']; // Define your categories

  

  constructor(
    private vectorSearchService: VectorSearchServiceService,
    
    private s3Service: S3Service,
    private apiService: APIService
  ) {}

  onCategoryChange(category: string) {
    this.selectedCategory = category;
  }
  onDragOver(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    // Add any visual cues if needed
  }
  
  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    
    if (event.dataTransfer?.files) {
      const file = event.dataTransfer.files[0];
      if (!this.isValidImageFile(file)) {
        this.errorMessage = 'Please upload only image files.';
      } else {
        this.handleFile(file);
      }
    }
  }
  

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.handleFile(file);
  }

  handleFile(file: File) {
    if (!this.isValidImageFile(file)) {
      this.errorMessage = 'Please upload only image files.';
      this.isLoading = false;
      return;
    }
    this.itemDetails = []; // Clear existing search results
    this.errorMessage = ''; 
    this.uploadedImageName = file.name;
    this.isLoading = true; // Show loader
  
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.uploadedImagePreviewUrl = e.target.result;
        this.uploadFileToS3(file).then(s3Path => {
          this.callSearchImageApi(s3Path);
        }).catch(error => {
          console.error('Error uploading file:', error);
          this.isLoading = false;
          this.errorMessage = "An error occurred during file upload. Please try again.";
        });
      };
      reader.readAsDataURL(file);
    }
  }
  

  async uploadFileToS3(file: File): Promise<string> {
    const filePath = environment.s3Folder+`/${file.name}`;
    const metadata = { category: this.selectedCategory };
    await this.s3Service.uploadFile(file, filePath,metadata);
    return filePath;
  }

  callSearchImageApi(s3Path: string) {
    this.apiService.SearchImage(s3Path).then(result => {
      // Ensure itemIds is always an array of strings
      const itemIds = result.item_ids ? result.item_ids.filter(id => id !== null) as string[] : [];
      this.fetchItemDetails(itemIds);
    }).catch(error => {
      console.error('Error in SearchImage API:', error);
      this.isLoading = false;
      this.errorMessage = "An error occurred. Please try again.";
    });
  }

  fetchItemDetails(itemIds: string[]) {
    this.itemDetails = [];
    itemIds.forEach(itemId => {
      this.apiService.GetItemById(itemId).then(async item => {
        if (item.path) {
          item.path = await this.s3Service.getSignedUrl(item.path);
        }
        this.itemDetails.push(item);
      }).catch(error => {
        console.error('Error fetching item by ID:', error);
      });
    });
    this.isLoading = false;
  }

  signOut() {
    // Implement sign-out logic here
    this.isAuthenticated = false;
  }

  private isValidImageFile(file: File): boolean {
    return file.type.startsWith('image/');
  }
}

import { S3Service } from './services/S3Service';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { API, graphqlOperation } from 'aws-amplify';
import { GraphQLResult } from '@aws-amplify/api-graphql';
import { environment } from '../environments/environment';
interface ChatMessage {
  type: 'question' | 'answer';
  text: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'document-search-app';
  isLoading = false;
  uploadedImageName: string = '';
  errorMessage: string = '';
  private currentFile: File | null = null;
  uploadMessage: string = '';
  isUploadComplete = false;
  userQuestion: string = '';
  answer: string = '';
  extractedText: string = '';
  pdfKey: string = '';
  chatMessages: ChatMessage[] = [];
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  @ViewChild('stepper') stepper!: MatStepper;
  isFileUploading: boolean = false;
  hasSteppedBack: boolean = false;
  @ViewChild('fileInput') fileInput!: ElementRef;
  selectedCategory: string = '';

  constructor(
    private s3Service: S3Service,
    private http: HttpClient,
    private _formBuilder: FormBuilder,
    private sanitizer: DomSanitizer
  ) {
    this.firstFormGroup = this._formBuilder.group({
    });
    this.secondFormGroup = this._formBuilder.group({
      // Add form control for document upload if necessary
    });
    this.thirdFormGroup = this._formBuilder.group({
    });


  }

  openFileSelector() {
    this.fileInput.nativeElement.click();
  }


  onDragOver(event: Event) {
    event.preventDefault();
    event.stopPropagation();

  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer?.files) {
      const file = event.dataTransfer.files[0];
      this.handleFile(file);
    }
  }

  clearChatMessages() {
    this.chatMessages = [];
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.handleFile(file);
  }

  handleFile(file: File) {
    this.resetState(); // Reset the state before handling a new file
    this.uploadedImageName = file.name;
    this.currentFile = file;
    //this.previewFile(file);
    this.uploadFileToS3(file);
  }



  async uploadFileToS3(file: File) {
    this.isLoading = true;
    this.pdfKey = environment.s3Folder + `/${file.name}`;
    try {
      await this.s3Service.uploadFile(file, this.pdfKey, this.selectedCategory);
      this.uploadMessage = `Upload completed. You can now ask questions about the document "${file.name}".`;
      this.isUploadComplete = true;

    } catch (error: any) { // Cast the error to 'any' type
      this.errorMessage = error.message || 'An error occurred during file upload';
    } finally {
      this.isLoading = false;
    }
  }

  handleAnswer(answer: string) {
    this.answer = answer;
    this.chatMessages.push({ type: 'answer', text: answer });
    this.userQuestion = '';
  }

  submitQuestion() {
    this.errorMessage = "";
    if (!this.userQuestion.trim()) {
      this.errorMessage = 'Please enter a question';
      return;
    }
    this.chatMessages.push({ type: 'question', text: this.userQuestion });
    this.isLoading = true;


    this.askQuestionOpenAI().finally(() => {
      this.isLoading = false;
      this.userQuestion = ''; // Clear the input after submitting
    });



  }

  async askQuestionOpenAI() {
    try {
      const response = await API.graphql(graphqlOperation(`
        query MyQuery($question: String!,$category: String!) {
          getAnswerBasedOnCategoryFromTitan(question: $question,category: $category)
        }
      `, { question: this.userQuestion, category: this.selectedCategory })) as GraphQLResult<any>;



      if ('data' in response && response.data) {
        const answerResponse = response.data.getAnswerBasedOnCategoryFromTitan;
        const cleanedResponse = answerResponse.replace(/\\n/g, "");
        // Attempt to parse the response if it's a string
        let answer;
        try {
          // Assuming the response is a JSON string or similar to an object literal
          const parsed = JSON.parse(cleanedResponse.replace(/=/g, ':'));
          answer = parsed.body;
        } catch (error) {
          // Fallback if the response is not JSON or an object literal
          // This will extract the content after 'body='
          const bodyMatch = /body=([^}]*)/.exec(cleanedResponse);
          answer = bodyMatch ? bodyMatch[1] : cleanedResponse;
        }
        // Remove double quotes at the beginning and end, if present
        if (answer.startsWith("\"") && answer.endsWith("\"")) {
          answer = answer.substring(1, answer.length - 1);
        }
        this.handleAnswer(answer);
      }
    } catch (error: any) {
      this.errorMessage = error.message || 'Error processing your question';
    } finally {
      this.isLoading = false;
    }
  }


  resetState() {
    this.uploadedImageName = '';
    //this.uploadedImagePreviewUrl = null;
    this.errorMessage = '';
    this.uploadMessage = '';
    this.isUploadComplete = false;
    this.currentFile = null;
    this.answer = '';
    this.chatMessages = [];
  }

  uploadNewDocument() {
    // Reset the state for a new upload
    this.resetState();
  }

  signOut() {
    // Implement sign-out logic here if needed
  }
  resetStepper() {
    this.hasSteppedBack = true;
    this.clearChatMessages();
    this.stepper.reset();
    this.resetState();  // Call your existing reset method
  }

  editDocument() {
    this.isUploadComplete = false; // Reset upload completion flag
    this.uploadedImageName = ''; // Reset the uploaded file name
    this.currentFile = null; // Reset the current file
    // Add any additional state resets you need here
  }

  submitQuestionOnEnter(event: Event) {
    event.preventDefault(); // Prevent the default action of the enter key
    this.submitQuestion();
  }


}


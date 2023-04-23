import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom, map } from 'rxjs';
import { ChatBotService } from 'src/app/services/chat-bot.service';

@Component({
  selector: 'app-chat-bubble',
  templateUrl: './chat-bubble.component.html',
  styleUrls: ['./chat-bubble.component.css']
})
export class ChatBubbleComponent {
  message = 'Ask me anything!';
  isLoading = false;
  isActive = true;
  chatInput = '';
  apiKey: string;

  constructor(private http: HttpClient, private chatBotService:ChatBotService) {
    this.apiKey = "";
    this.getApiKey();
  }


  async getApiKey() {
    await new Promise<void>((resolve, reject) => {
      this.chatBotService.getApiKey().pipe(
        map((result) => result as string)
      ).subscribe({
        next: (result) => {
          this.apiKey = result;
          resolve();
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  }


  async sendMessage(message: string): Promise<void> {
    try {
      this.message = message;
      this.isLoading = true;
      this.isActive = true;
      const response = await firstValueFrom(this.chatBotService.sendChatRequest(this.chatInput, this.apiKey));

      if (response.choices && response.choices.length > 0 && response.choices[0].message.content) {
        this.message = response.choices[0].message.content;
      } else {
        this.message = 'Sorry, I could not understand your request.';
      }
    } catch (error) {
      this.message = 'Oops! Something went wrong.';
    } finally {
      this.isLoading = false;
      this.chatInput = '';
    }
  }

  onSubmit(): void {
    const message = this.chatInput.trim();
    if (message) {
      this.sendMessage(message);
    }
  }
}

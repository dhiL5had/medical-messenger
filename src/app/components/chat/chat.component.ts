import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from './chat.service';
import { Location } from '@angular/common';
import { MessageData } from './message.model';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  newMessage!: string;
  messageList: MessageData[] = [];
  pageInfo:any = {roomId: '', user: ''}
  roomInfo:any = {senderId: '', roomId: '', message: ''};
  count = 0;

  @ViewChild('msgHistory', { static: true}) msgHistory!: ElementRef<HTMLInputElement>;

  constructor(private chatService: ChatService, private authService: AuthService, private router: Router, private location: Location) {
    this.pageInfo = this.router.getCurrentNavigation()?.extras.state;
  }
  
  ngOnInit(): void {
    if(!this.pageInfo?.roomId) return this.location.back()
    this.roomInfo.roomId = this.pageInfo.roomId;
    this.roomInfo.senderId = this.authService.getUserId();
    this.chatService.connect(this.roomInfo);
    this.chatService.getChatRoomInfo(this.roomInfo.roomId).subscribe((data) => {
      if (data.chatInfo.length > 0) {
        data.chatInfo.map((message:any) => {
          this.messageList.push(message);
        })
      }
    })
    this.chatService.getNewMessage().subscribe((message: any) => {
      if (message.roomId === this.roomInfo.roomId) this.messageList.push(message);
    })
  }

  sendMessage() {
    if (this.newMessage === '' || this.newMessage == undefined) return;
    this.roomInfo.message = this.newMessage;
    this.chatService.sendMessage(this.roomInfo);
    this.newMessage = '';
  }

  scrollToBottom() {
    try {
      this.msgHistory.nativeElement.scrollTop = this.msgHistory.nativeElement.scrollHeight;
   } catch (err) {
    console.log(err);
   }
  }

  ngOnDestroy(): void {
    this.chatService.disconnect();
  }

}

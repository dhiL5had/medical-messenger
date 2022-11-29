import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from './chat.service';
import { map } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  newMessage!: string;
  currentUser!: string;
  messageList: string[] = [];
  channelList: string[] = [];
  username = '';
  channel: boolean = false;
  chatClient: any;
  receiverId: any;
  roomInfo: any;

  @ViewChild('msgHistory') msgHistory!: ElementRef;

  constructor(private chatService: ChatService, private router: Router, private location: Location) {
    this.roomInfo = this.router.getCurrentNavigation()?.extras.state;
  }

  ngOnInit(): void {
    if(!this.roomInfo?.roomId) return this.location.back()
    this.chatService.getChatRoomInfo(this.roomInfo.roomId).subscribe((data) => {
      
    })
    this.chatService.getNewMessage().subscribe((message: string) => {
      this.messageList.push(message);
    })
  }

  sendMessage() {
    if(this.newMessage === '') return;
    this.chatService.sendMessage(this.newMessage);
    this.newMessage = '';
  }

  joinChat() {
    this.channel = true;
  }

  scrollToBottom() {
    try {
      this.msgHistory.nativeElement.scrollTop = this.msgHistory.nativeElement.scrollHeight;
   } catch (err) {
    console.log(err);
   }
  }

}

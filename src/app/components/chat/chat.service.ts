import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io } from "socket.io-client";
import { environment } from 'src/environments/environment';

const API_URL = environment.baseUrl + '/chat';

const token = localStorage.getItem('token');

@Injectable({providedIn: 'root'})
export class ChatService {
  public message$: BehaviorSubject<string> = new BehaviorSubject('');
  
  socket = io('http://localhost:3333', { auth: {token} });
  
  constructor(private http: HttpClient) {}

  connect(roomInfo: any) {
    this.socket.connect();
    this.socket.emit('join', roomInfo);
  }

  public sendMessage(message: string) {
    this.socket.emit('message', message);
  }

  public getNewMessage = () => {
    this.socket.on('message', (message) =>{
      this.message$.next(message);
    });
    
    return this.message$.asObservable();
  };

  getChatRoomInfo(roomId: string) {
    return this.http.get<{message: string, chatInfo: any}>(API_URL + '/room/' + roomId);
  }

  disconnect() {
    this.socket.removeListener('message');
    this.socket.disconnect();
  }
}
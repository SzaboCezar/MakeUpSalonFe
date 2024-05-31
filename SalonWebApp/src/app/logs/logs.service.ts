import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LogsService {
  constructor() {}

  logs: string[] = [];

  add(log: string) {
    this.logs.push(log);
  }

  clear() {
    this.logs = [];
  }
}

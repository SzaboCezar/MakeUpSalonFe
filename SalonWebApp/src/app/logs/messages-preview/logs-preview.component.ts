import { Component } from '@angular/core';
import {LogsService} from "../logs.service";


@Component({
  selector: 'app-logs-preview',
  standalone: true,
  templateUrl: './logs-preview.component.html',
  styleUrls: ['./logs-preview.component.scss']
})
export class LogsPreviewComponent {
  constructor(public logsService: LogsService) {}
}

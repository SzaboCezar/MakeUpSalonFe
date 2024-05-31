import {Component} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";
import {LogsService} from "./logs.service";

@Component({
  selector: 'app-logs',
  standalone: true,
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss'],
})
export class LogsComponent {
  constructor(
    public logsService: LogsService,
    private route: ActivatedRoute,
    private location: Location,
  ) {}

  onBack() {
    this.location.back();
  }
}

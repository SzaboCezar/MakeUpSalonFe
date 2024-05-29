import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [],
  template:
    '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>',
  styleUrl: './loading-spinner.component.css'
})
export class LoadingSpinnerComponent {

}

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MarkdownModule, HttpClient],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'codepulse';
}

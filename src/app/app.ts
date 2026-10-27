import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router'; // Adicionado RouterLink

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink], // Adicionado RouterLink aqui
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {}
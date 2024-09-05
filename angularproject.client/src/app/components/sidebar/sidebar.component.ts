import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @Output() toggle = new EventEmitter<boolean>();
  isSidebarClosed = false;

  toggleSidebar() {
    this.isSidebarClosed = !this.isSidebarClosed;
    this.toggle.emit(this.isSidebarClosed);
  }
}

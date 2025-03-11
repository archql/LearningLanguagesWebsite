import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { MenuAction } from '../menu-bar/menu-bar.model';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-context-menu',
  standalone: true,
  imports: [
    MatMenuModule,
    MatButtonModule
  ],
  templateUrl: './context-menu.component.html',
  styleUrl: './context-menu.component.scss'
})
export class ContextMenuComponent {
  @Output() contextMenuAction = new EventEmitter<MouseEvent>();
  @ViewChild('menuTrigger') menuTrigger!: MatMenuTrigger;

  private subscription: Subscription;

  x = 0;
  y = 0;
  selectedText? = '';
  
  @Input() menuItems: MenuAction[] = [];
  
  constructor(
    private el: ElementRef, 
    private translate: TranslateService
  ) {
    this.subscription = new Subscription();
  }

  ngOnInit(): void {
    if (this.menuItems.length === 0) return;
    
    // Init Translation Keys
    this.menuItems.forEach((item) => {
      item.trID = `app.context-menu.${item.trID}`;
    });
    //
    this.subscription = this.translate
    .stream((this.menuItems.map((e) => e.trID)))
    .subscribe((translations: Record<string, string>) => {
      this.menuItems.forEach(e => {
        e.label = translations[e.trID]
      });
    });    
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  open(event: MouseEvent) {
    this.selectedText = window.getSelection()?.toString().trim();
    if (!this.selectedText) return;

    console.log("JJJ ", this.selectedText)
    event.preventDefault();
    this.contextMenuAction.emit(event)
    this.x = event.clientX;
    this.y = event.clientY;
    this.menuTrigger.closeMenu();
    this.menuTrigger.openMenu();
  }

  close() {
    this.menuTrigger.closeMenu();
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.el.nativeElement.contains(event.target)) {
      this.close();
    }
  }

  @HostListener('document:contextmenu', ['$event'])
  onRightClick(event: MouseEvent) {
    event.preventDefault();
    this.open(event);
  }
}

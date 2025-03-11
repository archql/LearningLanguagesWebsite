import { Component, HostListener } from '@angular/core';
import { MenuAction } from '../../helpers/menu-bar/menu-bar.model';
import { CanComponentDeactivate } from '../../../guards/can-deactivate.guard';
import { ContextMenuComponent } from '../../helpers/context-menu/context-menu.component';

@Component({
  selector: 'app-lesson-page',
  standalone: true,
  imports: [ContextMenuComponent],
  templateUrl: './lesson-page.component.html',
  styleUrl: './lesson-page.component.scss'
})
export class LessonPageComponent implements CanComponentDeactivate {
  menuItems: MenuAction[] = [
    {
      trID: 'add-to-vocabulary',
      label: '',
      action: (e) => { console.log(e) }
    }
  ]

  canDeactivate(): boolean {
    // save state here
    return confirm('You have unsaved changes. Leave anyway?');
  }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: BeforeUnloadEvent) {
    event.preventDefault();
    return '';
  }

  @HostListener('window:unload', ['$event'])
  onUnload(event: Event): void {
    // save state here
  }
}

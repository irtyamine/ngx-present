import { AfterViewInit, Directive, ElementRef, OnDestroy } from '@angular/core';
import { AdvancedTitleService } from './title.service';

@Directive({
  selector: '[ngxPresentPageTitle]'
})
export class PageTitleDirective implements AfterViewInit, OnDestroy {
  unsetTitle: (() => void) | undefined;

  constructor(private title: AdvancedTitleService,
              private element: ElementRef) { }

  ngAfterViewInit(): void {
    const pageTitle = this.element.nativeElement.innerText;
    this.unsetTitle = this.title.prefixTitle(pageTitle);
    this.element.nativeElement.hidden = true;
  }

  ngOnDestroy(): void {
    if (this.unsetTitle) {
      this.unsetTitle();
    }
  }


}

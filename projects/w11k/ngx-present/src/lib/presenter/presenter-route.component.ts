import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PresentationService } from '../core/presentation.service';
import { componentDestroyed, toAngularComponent } from '@w11k/tydux/dist/angular-integration';
import { map, takeUntil } from 'rxjs/operators';
import { SlideBySlideService } from '../slide-by-slide/slide-by-slide.service';
import { Observable } from 'rxjs';
import { Slide } from '../core/presentation.types';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { SlideAndModeResolver } from '../core/slide-and-mode-resolver.service';
import { SlideBySlideTitleService } from '../slide-by-slide/slide-by-slide-title.service';

@Component({
  selector: 'ngx-present-presenter-route',
  templateUrl: './presenter-route.component.html'
})
export class PresenterRouteComponent implements OnInit, OnDestroy {
  public currentSlide$: Observable<Slide>;
  public nextSlide$: Observable<Slide>;
  public nextSection$: Observable<Slide>;

  constructor(private readonly route: ActivatedRoute,
              private readonly slideRouter: SlideAndModeResolver,
              private readonly presentation: PresentationService,
              private readonly slides: SlideBySlideService,
              private readonly title: SlideBySlideTitleService) {

    this.currentSlide$ = this.slides.selectNonNil(state => state.currentSlide)
      .bounded(toAngularComponent(this));

    this.nextSlide$ = this.slides.nextSlide(-1)
      .pipe(untilComponentDestroyed(this));

    this.nextSection$ = this.slides.nextSlide(-2)
      .pipe(untilComponentDestroyed(this));

    this.title.setupTitleSync('Presenter', this);
  }

  ngOnInit() {

    // TODO: move somewhere else
    this.route.queryParamMap
      .pipe(
        map(params => params.get('id')),
        takeUntil(componentDestroyed(this))
      )
      .subscribe(id => {
        if (id !== null) {
          this.presentation.dispatch.setId(id);
        }
      });
  }

  ngOnDestroy(): void {}
}

//
// [smritii]
//
// Sanjeev Premi <spremi@ymail.com>
//
// BSD-3-Clause License
//


import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideHttpClient(),
    provideRouter(routes),
    provideZoneChangeDetection({ eventCoalescing: true }),
  ]
};

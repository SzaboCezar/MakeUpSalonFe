import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingService } from './loading.service';

/*
 * Interceptor care ajută la afișearea unui spinner de încărcare atunci când se face o cerere HTTP.
 * Setează starea de încărcare în serviciul de încărcare și o resetează când cererea este finalizată.
 * În app.module.ts, acest interceptor este adăugat în lista de providers.
 *
 * În app.component.html, spinner-ul de încărcare este afișat sau ascuns în funcție de starea de încărcare.
 */

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private loadingService: LoadingService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Verifică dacă cererea este pentru autentificare și evită gestionarea încărcării
    if (req.url.includes('/login') || req.url.includes('/treatment/add')) {
      return next.handle(req);
    }


    this.loadingService.setLoading(true);
    return next.handle(req).pipe(
      finalize(() => this.loadingService.setLoading(false))
    );
  }
}

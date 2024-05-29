import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {AuthService} from "../services/auth.service";
import {exhaustMap, take} from "rxjs/operators";

//Nu trebuie provided in Root.
@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) {
  }

  //Take preia doar o valoare a acelui observable, după care se dezabonează automat.
  //În cazul de față priea ultuml user și apoi se dezabonează.
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('AuthInterceptorService intercept() called');

    return this.authService.user.pipe(
      take(1),
      exhaustMap(user => {
        // Verificăm dacă user-ul există și are un token
        if (!user || !user.token) {
          // Dacă nu, pur și simplu continuăm cu următoarea cerere în lanț
          return next.handle(request);
        }

        // Dacă avem un token, clonăm cererea și adăugăm antetul de autorizare
        const modifiedRequest = request.clone({
          headers: new HttpHeaders().set('Authorization', `Bearer ${user.token}`)
        });

        console.log('User token:', user.token);


        console.log(modifiedRequest.headers);

        // Returnăm cererea modificată pentru a fi procesată mai departe
        return next.handle(modifiedRequest);
      })
    );
  }

}

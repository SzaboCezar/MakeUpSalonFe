import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {AuthService} from "./auth.service";
import {exhaustMap, take} from "rxjs/operators";

//Nu trebuie provided in Root.
@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) {
  }

  //Take preia doar o valoare a acelui observable, după care se dezabonează automat.
  //În cazul de față priea ultuml user și apoi se dezabonează.

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (req.url.includes('/password') || req.url.includes('/auth') || req.url.includes('/enrollment')) {
      return next.handle(req);
    }


    return this.authService.user.pipe(
      take(1),
      exhaustMap(user => {
        if (!user || !user.token) {
          console.log('No user or token in interceptor');

          return next.handle(req);
        }
        console.log('User in interceptor:', user);
        console.log('Token in interceptor:', user.token);
        console.log('Token type in interceptor:', typeof user.token)


        // // const userToken: string = user;
        // console.log('User token in interceptor:', userToken)
        // console.log("User token type: ", typeof userToken)



        const modifiedReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${user.token}`
          }
        });

          console.log('Modified req in interceptor:', modifiedReq);
          return next.handle(modifiedReq);
      })
    );
  }







}

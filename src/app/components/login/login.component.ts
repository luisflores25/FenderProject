import { Component, OnInit } from '@angular/core';
import { User } from '../../models/User';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ComunicationLoginService } from '../../services/comunication-login.service';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [AppComponent]
})
export class LoginComponent implements OnInit {
  public login: User;
  public aviso: string = "";
  showFiller = false;
  constructor(
    private notif: AppComponent,
    private _route: ActivatedRoute,
    private _router: Router,
    private data: ComunicationLoginService) {
      this.login = new User("","","","");
  }

  ngOnInit(): void {
  }
  onSubmit(): void {
    this.session();
  }
  session() {
        this.data.login(this.login).subscribe(res => {
          if (res){
            this.login=res.user;
            this.data.enviarMessage(this.login);
            this.data.verifyToken(res.accessToken).subscribe(auth => {
              if(auth){
                //this.alert.exito("Sesión " + res.user.empresa + " iniciada");
                this._router.navigate(['/index']);
              }
            });
          }else
            this.aviso=res.error.message;
        });

  }
}

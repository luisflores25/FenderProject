import { Component, OnInit } from '@angular/core';
import { User } from '../../models/User';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ComunicationLoginService } from '../../services/comunication-login.service';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public login: User;
  public aviso: string = "";
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
    this.data.register(this.login).subscribe(
      response => {
        if (response.dataUser.email != "")
        this.aviso = "Usuario registrado con éxito."
      },
      error => {
        this.aviso = "Error al registrar usuario."
        console.log(error);
      }
    )
  }

}

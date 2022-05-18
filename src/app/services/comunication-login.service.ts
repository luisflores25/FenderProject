import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { User } from '../models/User';
import { JwtResponse } from '../models/jwt';
import{ Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ComunicationLoginService {
  AUTH_SERVER: String = 'http://localhost:3900/api';
  public user: User;
  public aviso: string;
  public token: string | null;
  constructor( private httpClient: HttpClient){
      this.user = new User("","","","")
      this.token = "";
      this.aviso = "";
  }
  enviarMessage(user: User): User{
      this.user=user;
      return user;
  }
  register(user: any=null):Observable<JwtResponse>{
      return this.httpClient.post<JwtResponse>(`${this.AUTH_SERVER}/register`,user).pipe(tap(
          (res:JwtResponse)=>{
              if(res){
                 this.saveToken(res.dataUser.accessToken,res.dataUser.expireIn);
              }
          }
      ));
  }
  login(user: any):Observable<any>{
      return this.httpClient.post<any>(`${this.AUTH_SERVER}/login`,user).pipe(tap(
          (res:any)=>{
              if(res){
                  //guardar token
                  this.saveToken(res.accessToken, res.expiresIn);
                  sessionStorage.setItem("EMAIL",user.email);
                  sessionStorage.setItem("USER",user.usuario);
              }
          }
      ));
  }
  verifyToken(token: string):Observable<any>{
      const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
      return this.httpClient.get<any>(`${this.AUTH_SERVER}/auth`,{headers:headers});
  }
  logout(){
      this.token= '';
      sessionStorage.clear();
  }

  private saveToken (token: string, expiresIn: string): void{
      sessionStorage.setItem("ACCESS_TOKEN",token);
      sessionStorage.setItem("EXPIRES_IN",expiresIn);
      this.token=token;
      }

  private getToken():string | null{
      if(!this.token){
          this.token = sessionStorage.getItem("ACCESS_TOKEN");
      }
      return this.token;
  }
}

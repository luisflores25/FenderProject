export interface JwtResponse{
    dataUser:{
        _id: number,
        email: string,
        usuario: string,
        accessToken: string,
        expireIn: string
    }
  }
import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException, UseGuards } from "@nestjs/common";
import { AUTH_SERVICE } from "./services";
import { ClientProxy, MessagePattern } from "@nestjs/microservices";
import { catchError, Observable, tap } from "rxjs";
import { table } from "console";
import { CurrentUser } from "apps/auth/src/current-user.decorator";
import { User } from "apps/auth/src/users/schemas/user.schema";


@Injectable()
export class JwtAuthGuard implements CanActivate{
    constructor(@Inject(AUTH_SERVICE) private authClient: ClientProxy){}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const authentication= this.getAuthentication(context)
        return this.authClient.send('validate_user',{
            Authentication: authentication
        }).pipe(
            tap((res)=>{
                this.addUser(res,context)
            }),
            catchError(()=>{
                throw new UnauthorizedException()
            })
        )
    } 
    private getAuthentication(context:ExecutionContext){
        let authentication : string
        if(context.getType()==='rpc'){
            authentication = context.switchToRpc().getData().Authentication
        }else if(context.getType()==='http'){
            authentication = context.switchToHttp().getRequest().cookies?.Authentication
        }
        if(!authentication) {
            throw new UnauthorizedException("No Value was provided for authentication")
        }
        return authentication
    }
    private addUser(user:any,context:ExecutionContext){
        if(context.getType()==='rpc'){
            context.switchToRpc().getData().user = user
        }else if(context.getType()==='http'){
            context.switchToHttp().getRequest().user = user 
        }
    }
    @UseGuards(JwtAuthGuard)
    @MessagePattern('validate_user')
    async validateUser(@CurrentUser() user:User){
        return user 
    }
}
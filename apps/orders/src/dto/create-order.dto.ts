import { IsNumber, IsPhoneNumber, IsPositive, IsString } from "class-validator";

export class CreateOrderDto {
    @IsString()
    name : string

    @IsPositive()
    price : number
     
    @IsPhoneNumber()
    phoneNumber: string
}
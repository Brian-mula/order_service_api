import { Type } from "class-transformer";
import { IsArray, IsInt, IsNotEmpty, IsString, Min, ValidateNested } from "class-validator";

class OrderItemDto {
    @IsString({message: 'Product SKU must be a string'})
    @IsNotEmpty({message: 'Product SKU is required'})
    sku: string;

    @IsInt({message: 'Quantity must be an integer'})
    @Min(1, {message: 'Quantity must be at least 1'})
    quantity: number;
}


export class NewOrderDto {
    @IsArray({message: 'Items must be an array'})
    @ValidateNested({each: true})
    @Type(() => OrderItemDto)
    items: OrderItemDto[];

    @IsString()
    @IsNotEmpty()
    clientToken: string;
}
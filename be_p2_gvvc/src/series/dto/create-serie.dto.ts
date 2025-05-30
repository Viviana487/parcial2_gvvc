import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsDefined, IsInt, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Pais } from 'src/paises/entities/pais.entity';

export class CreateSerieDto {
  @ApiProperty()
  @IsDefined({ message: 'El campo idPais debe estar definido' })
  @IsInt({ message: 'El campo idPais debe ser de tipo numérico' })
  readonly idPais: Pais['id'];

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo titulo es obligatorio' })
  @IsString({ message: 'El campo titulo debe ser de tipo cadena' })
  @MaxLength(250, { message: 'El campo titulo no debe ser mayor a 250 caracteres' })
  readonly titulo: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo sinopsis es obligatorio' })
  @IsString({ message: 'El campo sinopsis debe ser de tipo cadena' })
  @MaxLength(5000, { message: 'El campo sinopsis no debe ser mayor a 5000 caracteres' })
  readonly sinopsis: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo director es obligatorio' })
  @IsString({ message: 'El campo director debe ser de tipo cadena' })
  @MaxLength(5000, { message: 'El campo director no debe ser mayor a 5000 caracteres' })
  readonly director: string;

  @ApiProperty()
  @IsDefined({ message: 'El campo temporadas debe estar definido' })
  @IsInt({ message: 'El campo temporadas debe ser de tipo numérico' })
  readonly temporadas: number;

  @ApiProperty()
  @IsDefined({ message: 'El campo fechaEstreno debe estar definido' })
  @IsDateString({}, { message: 'El campo fechaEstreno debe ser tipo fecha' })
  readonly fechaEstreno: Date;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo idiomaPrincipal es obligatorio' })
  @IsString({ message: 'El campo idiomaPrincipal debe ser de tipo cadena' })
  @MaxLength(50, { message: 'El campo idiomaPrincipal no debe ser mayor a 50 caracteres' })
  readonly idiomaPrincipal: string;
}

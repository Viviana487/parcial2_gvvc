import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSerieDto } from './dto/create-serie.dto';
import { UpdateSerieDto } from './dto/update-serie.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Serie } from './entities/serie.entity';

@Injectable()
export class SeriesService {
  constructor(@InjectRepository(Serie) private seriesRepository: Repository<Serie>) {}

  async create(createSerieDto: CreateSerieDto): Promise<Serie> {
    const existe = await this.seriesRepository.findOneBy({
      idPais: createSerieDto.idPais,
      titulo: createSerieDto.titulo.trim(),
      director: createSerieDto.director.trim(),
    });

    if (existe) throw new ConflictException('La serie ya existe');

    const serie = new Serie();
    serie.idPais = createSerieDto.idPais;
    serie.titulo = createSerieDto.titulo.trim();
    serie.sinopsis = createSerieDto.sinopsis.trim();
    serie.director = createSerieDto.director.trim();
    serie.temporadas = createSerieDto.temporadas;
    serie.fechaEstreno = createSerieDto.fechaEstreno;
    return this.seriesRepository.save(serie);
  }

  async findAll(): Promise<Serie[]> {
    return this.seriesRepository.find({
      relations: { pais: true },
      select: {
        id: true,
        titulo: true,
        sinopsis: true,
        director: true,
        temporadas: true,
        fechaEstreno: true,
        pais: {
          id: true,
          descripcion: true,
        },
      },
    });
  }

  async findOne(id: number): Promise<Serie> {
    const serie = await this.seriesRepository.findOne({
      where: { id },
      relations: { pais: true },
    });

    if (!serie) throw new NotFoundException('La serie no existe');

    return serie;
  }

  async update(id: number, updateSerieDto: UpdateSerieDto): Promise<Serie[]> {
    const serie = await this.findOne(id);

    const serieUpdate = Object.assign(serie, updateSerieDto);
    await this.seriesRepository.save(serieUpdate);
    return this.seriesRepository.find({
      where: { id },
      relations: { pais: true },
      select: {
        id: true,
        titulo: true,
        sinopsis: true,
        director: true,
        temporadas: true,
        fechaEstreno: true,
        pais: {
          id: true,
          descripcion: true,
        },
      },
    });
  }

  async remove(id: number) {
    const serie = await this.findOne(id);
    if (serie) return this.seriesRepository.softRemove(serie);
  }
}

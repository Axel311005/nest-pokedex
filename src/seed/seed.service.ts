import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response.interface';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  

  constructor(
    @InjectModel(Pokemon.name)
      private readonly pokemonModel : Model<Pokemon>,
      private readonly http : AxiosAdapter,
  ){}

  async executedSeed(){

    await this.pokemonModel.deleteMany();
    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');

    const pokemonToInsert: {name:string, no:number}[] = [];


    data.results.forEach(({name, url}) => {
      const segments = url.split('/');
      const no : number = +segments[segments.length - 2];

      //const pokemon = await this.pokemonModel.create({name, no});
      pokemonToInsert.push({name, no});

    });

    this.pokemonModel.insertMany(pokemonToInsert);


    return 'Seed Executed';
  }
}

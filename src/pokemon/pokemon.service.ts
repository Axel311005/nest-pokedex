import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {
  private defaultLimit : number | undefined;
  constructor(
    
    @InjectModel(Pokemon.name)
    private readonly pokemonModel : Model<Pokemon>,
    private readonly configService : ConfigService
  ){
    this.defaultLimit = configService.get<number>('defaultLimit');
  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleException(error);

    }
  
  }

  findAll(paginationDto: PaginationDto) {

    const { limit = this.defaultLimit, offset = 0} = paginationDto;


    return this.pokemonModel.find()
    .limit(limit!).skip(offset).sort({
      no:1
    }).select('-__v');
  }

  async findOne(term: string) {

    let pokemon: Pokemon | null = null;
    

    if ( !isNaN(+term) ){
      pokemon = await this.pokemonModel.findOne({no: term});
    }
    //mongo id
    if(!pokemon && isValidObjectId(term)){
      pokemon = await this.pokemonModel.findById(term);
    }

    //name

    if(!pokemon){
      pokemon = await this.pokemonModel.findOne({name : term.toLowerCase().trim()});

    }

    if(!pokemon) throw new NotFoundException(`Pokemon with id ${term} not found`);
    
    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);

    if(updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    }

    try {
      await pokemon.updateOne(updatePokemonDto);
      return {...pokemon.toJSON(), ...updatePokemonDto};
    }catch (error) {
      this.handleException(error);
    }
  }

  async remove(id: string) {
    /* const pokemon = await this.findOne(id);
    await pokemon.deleteOne(); */
    //return {id};
    //const result = await this.pokemonModel.findByIdAndDelete(id);
    const {deletedCount} = await this.pokemonModel.deleteOne({_id: id});
    if(deletedCount === 0 ){
      throw new BadRequestException(`Pokemon with id: ${id} not found`);
    }
    return;
  }

  private handleException (error : any ) {
    if(error.code === 11000){
      throw new BadRequestException(`Pokemon exist in bd ${JSON.stringify(error.KeyValue)}`);

    }
    console.log(error);
    throw new InternalServerErrorException(`Cant create pokemon - Check server logs`);
  }
}

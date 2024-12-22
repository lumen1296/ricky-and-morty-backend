import { Character } from "../entity/character.entity";


export const charactersProviders = 
  {
    provide: 'CHARACTER_REPOSITORY',
    useValue: Character,
  };
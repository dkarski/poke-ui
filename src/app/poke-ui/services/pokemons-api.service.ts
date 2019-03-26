import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Pokemon } from '../pokemons/pokemon.model';

@Injectable({
  providedIn: 'root',
})
export class PokemonsApiService {
  constructor(private httpClient: HttpClient) {}

  getPokemons(query: QueryPokemons): Observable<Pokemon[]> {
    const url = `https://pokeapi.co/api/v2/pokemon/${parseToStringQuery(query)}`;
    return this.httpClient
      .get<PokemonsResponse>(url)
      .pipe(map(response => mapToViewPokemons(response.results)));
  }
}

function parseToStringQuery(query: QueryPokemons): string {
  return Object.keys(query).reduce((prev, key) => `${prev}${key}=${query[key]}&`, `?`);
}

function mapToViewPokemons(results: Result[]): Pokemon[] {
  return results.map(({ name, url }) => {
    return {
      name,
      id: getIdFromUrl(url),
    };
  });
}

function getIdFromUrl(url: string): string {
  const segmentsUrl = url.split('/');
  return segmentsUrl[segmentsUrl.length - 2];
}

interface PokemonsResponse {
  results: Result[];
}

interface Result {
  name: string;
  url: string;
}

export interface QueryPokemons {
  offset: number;
  limit: number;
}

// This file contains DTOs reflecting the backend API response for different entity types.
// The main difference here is that the DTOs include the context of the entity hierarchy, including children.

export interface EntityDto {
  id: string;
  dtype: string;
  childNodes: EntityDto[];
  name: string;
}

export interface EntityL1Dto extends EntityDto {
  childNodes: EntityL2Dto[];
}

export interface EntityL2Dto extends EntityDto {
  childNodes: (EntityL3Dto | EntityL3OtherDto)[];
  rank: number;
}

export interface EntityL3Dto extends EntityDto {
  childNodes: [];
  date: string;
}

export interface EntityL3OtherDto extends EntityDto {
  childNodes: [];
  comment: string;
}

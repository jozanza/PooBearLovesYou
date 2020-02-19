// Support assets being served locally or on csb
const ASSET_PATH = window.location.href.includes('csb.app') ? '/public' : ''
const asset = <T>(a: string) => (`${ASSET_PATH}${a}` as unknown) as T

export enum Font {
  Small = asset<Font>(`/fonts/baby.png`),
  Medium = asset<Font>(`/fonts/thicc.png`),
}

export enum Sound {
  MainTheme = asset<Sound>(`/sounds/main-theme.mp3`),
}

export enum Spritesheet {
  Environment = asset<Spritesheet>(`/sprites/environment.png`),
  Food = asset<Spritesheet>(`/sprites/food.png`),
  Pet = asset<Spritesheet>(`/sprites/pet.png`),
  Player = asset<Spritesheet>(`/sprites/player.png`),
}

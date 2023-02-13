export enum DrawType {
  IMG,
  LINE,
  REC,
  ARC
}

export interface Path2DData {
  path2D: Path2D
  originalWidth: number
  originalHeight: number
}

export interface DrawableItem {
  id: string
  type: DrawType
  img: HTMLImageElement | null
  position: Position
  isSelected: boolean
  drawItem: Function | null
  name: string
  details: string
  description: string
  color: string
}

export interface Position {
  x: number
  y: number
  width: number
  height: number
}

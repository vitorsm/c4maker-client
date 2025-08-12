import { DrawableItem } from '../components/canvas-container/models'
import { getBoolean } from '../utils/typing-utils'
import { DiagramItem, DiagramItemPosition } from './diagram'
import { getEndX, getEndY, getPosition } from './diagram-item-position-utils'

const MARGIN_CHILDREN_COMPONENTS = 50
const DEFAULT_OPENED_ITEM_PROPORTION_SIZE = { width: 2.5, height: 2.5 }

export const updateDiagramItemPosition = (diagramItem: DiagramItem, position: DiagramItemPosition): void => {
  if (diagramItem.data.position == null) {
    diagramItem.data.position = position
  }

  let shouldUpdateLastPosition = true
  if (diagramItem.data.displayPosition == null) {
    setDisplayPosition(diagramItem, position)
    shouldUpdateLastPosition = false
  }

  diagramItem.data.position.x = position.x
  diagramItem.data.position.y = position.y

  if (diagramItem.data.displayPosition != null) {
    const newDisplayPosition = { ...diagramItem.data.displayPosition }
    newDisplayPosition.x = position.x
    newDisplayPosition.y = position.y
    setDisplayPosition(diagramItem, newDisplayPosition, shouldUpdateLastPosition)
  }
}

const updateDiagramItemsSelection = (diagramItem: DiagramItem, drawableItems: Map<string, DrawableItem>): DiagramItem[] => {
  const selectedDiagramItem: DiagramItem[] = []
  const drawableItem = drawableItems.get(diagramItem.workspaceItem.key)

  if (drawableItem !== undefined) {
    diagramItem.isSelected = drawableItem.isSelected
    if (diagramItem.isSelected) {
      selectedDiagramItem.push(diagramItem)
    }
  }

  diagramItem.children.forEach(child => {
    selectedDiagramItem.push(...updateDiagramItemsSelection(child, drawableItems))
  })

  return selectedDiagramItem
}

const setDisplayPosition = (diagramItem: DiagramItem, position: DiagramItemPosition | undefined, updateLastPosition: boolean = true): void => {
  if (updateLastPosition) {
    diagramItem.data.transientLastDisplayPosition = { ...getDisplayPosition(diagramItem) }
  }
  diagramItem.data.displayPosition = getPosition(position)
}

export const updateListDiagramItemSelection = (diagramItems: DiagramItem[], drawableItems: Map<string, DrawableItem>): DiagramItem[] => {
  const selectedDiagramItem: DiagramItem[] = []

  diagramItems.forEach(diagramItem => {
    selectedDiagramItem.push(...updateDiagramItemsSelection(diagramItem, drawableItems))
  })

  return selectedDiagramItem
}

export const getDiagramItemsByKeys = (diagramItems: DiagramItem[], itemsKeys: string[]): DiagramItem[] => {
  const filteredDiagramItems: DiagramItem[] = []

  diagramItems.forEach(diagramItem => {
    if (itemsKeys.includes(diagramItem.workspaceItem.key)) {
      filteredDiagramItems.push(diagramItem)
    }

    filteredDiagramItems.push(...getDiagramItemsByKeys(diagramItem.children, itemsKeys))
  })

  return filteredDiagramItems
}

export const getDiagramItemByKey = (diagramItems: DiagramItem[], itemKey: string): DiagramItem | null => {
  const filteredItems = getDiagramItemsByKeys(diagramItems, [itemKey])
  return filteredItems.length > 0 ? filteredItems[0] : null
}

const getDisplayPositionXShift = (diagramItem: DiagramItem): number => {
  const position = getLastDisplayPosition(diagramItem)
  const displayPosition = getDisplayPosition(diagramItem)

  return getEndX(displayPosition) - getEndX(position)
}

const getDisplayPositionYShift = (diagramItem: DiagramItem): number => {
  const position = getLastDisplayPosition(diagramItem)
  const displayPosition = getDisplayPosition(diagramItem)

  return getEndY(displayPosition) - getEndY(position)
}

const getValidPosition = (diagramItem: DiagramItem): DiagramItemPosition => {
  return getPosition(diagramItem.data.position)
}

const calculatePositionBasedOnChildren = (diagramItem: DiagramItem, newPosition: DiagramItemPosition | null): DiagramItemPosition => {
  newPosition = newPosition ?? getDisplayPosition(diagramItem)

  let minChildrenX = Infinity
  let minChildrenY = Infinity
  let maxChildrenX = 0
  let maxChildrenY = 0

  diagramItem.children.forEach(child => {
    const childPosition = getDisplayPosition(child)

    minChildrenX = Math.min(minChildrenX, childPosition.x)
    minChildrenY = Math.min(minChildrenY, childPosition.y)

    maxChildrenX = Math.max(maxChildrenX, getEndX(childPosition))
    maxChildrenY = Math.max(maxChildrenY, getEndY(childPosition))
  })

  if (maxChildrenX >= getEndX(newPosition)) {
    newPosition.width = maxChildrenX - newPosition.x + MARGIN_CHILDREN_COMPONENTS
  }

  if (maxChildrenY >= getEndY(newPosition)) {
    newPosition.height = maxChildrenY - newPosition.y + MARGIN_CHILDREN_COMPONENTS
  }

  if (minChildrenX <= newPosition.x) {
    newPosition.x = minChildrenX - MARGIN_CHILDREN_COMPONENTS
  }

  if (minChildrenY <= newPosition.y) {
    newPosition.y = minChildrenY - MARGIN_CHILDREN_COMPONENTS
  }

  return newPosition
}

const calculateOpenedPosition = (diagramItem: DiagramItem): DiagramItemPosition => {
  const itemPosition = getValidPosition(diagramItem)
  const newPosition = { ...getDisplayPosition(diagramItem) }
  newPosition.width = itemPosition.width * DEFAULT_OPENED_ITEM_PROPORTION_SIZE.width
  newPosition.height = itemPosition.height * DEFAULT_OPENED_ITEM_PROPORTION_SIZE.height

  const result = calculatePositionBasedOnChildren(diagramItem, newPosition)
  return result
}

export const setIsOpened = (diagramItem: DiagramItem, isOpened: boolean): void => {
  diagramItem.isOpened = isOpened
  if (isOpened) {
    setDisplayPosition(diagramItem, calculateOpenedPosition(diagramItem))
  } else {
    const originalPosition = { ...getValidPosition(diagramItem) }
    const displayPosition = { ...getDisplayPosition(diagramItem) }
    displayPosition.width = originalPosition.width
    displayPosition.height = originalPosition.height
    setDisplayPosition(diagramItem, displayPosition)
  }
}

export const setIsOpenedTree = (diagramItem: DiagramItem, diagramItemKey: string, isOpened: boolean): DiagramItem | null => {
  if (diagramItem.workspaceItem.key === diagramItemKey) {
    setIsOpened(diagramItem, isOpened)
    return diagramItem
  } else {
    let selectedDiagramItem = null
    diagramItem.children.forEach(child => {
      const result = setIsOpenedTree(child, diagramItemKey, isOpened)
      if (result != null) {
        selectedDiagramItem = result
      }
    })

    if (selectedDiagramItem != null) {
      setDisplayPosition(diagramItem, calculatePositionBasedOnChildren(diagramItem, null), false)
    }

    return diagramItem
  }
}

const calculateMovePositionAfterItemOpened = (diagramItem: DiagramItem, openedItem: DiagramItem): DiagramItemPosition => {
  const diagramItemPosition = { ...getDisplayPosition(diagramItem) }
  const openedItemPosition = { ...getDisplayPosition(openedItem) }

  const diffX = getEndX(diagramItemPosition) - openedItemPosition.x
  const diffY = getEndY(diagramItemPosition) - openedItemPosition.y

  if (diffX < 0 || diffY < 0) {
    return diagramItemPosition
  }

  if (diffX > diffY) {
    diagramItemPosition.x += getDisplayPositionXShift(openedItem)
  } else {
    diagramItemPosition.y += getDisplayPositionYShift(openedItem)
  }

  return diagramItemPosition
}

const isItemAInItemBTree = (itemA: DiagramItem, itemB: DiagramItem): boolean => {
  if (itemB.children.some(item => item.workspaceItem.key === itemA.workspaceItem.key)) {
    return true
  }

  return itemB.children.some(item => isItemAInItemBTree(itemA, item))
}

const moveItemTreeAfterOpenOtherItem = (diagramItem: DiagramItem, openedItem: DiagramItem | null, isOpened: boolean): void => {
  if (openedItem === null) {
    return
  }

  if (diagramItem.id === openedItem.id) {
    return
  }

  if (isItemAInItemBTree(openedItem, diagramItem)) {
    return
  }

  const newPosition = calculateMovePositionAfterItemOpened(diagramItem, openedItem)
  setDisplayPosition(diagramItem, newPosition)

  // to uncomment here, we could change the display position of the children when it is opened.
  // if (!getBoolean(diagramItem.isOpened)) {
  //   return
  // }

  diagramItem.children.forEach(child => {
    moveItemTreeAfterOpenOtherItem(child, openedItem, isOpened)
  })
}

export const setIsOpenedInList = (diagramItems: DiagramItem[], diagramItemToUpdate: DiagramItem): DiagramItem[] => {
  const isOpened = getBoolean(diagramItemToUpdate.isOpened)

  let selectedDiagramItem: DiagramItem | null = null
  diagramItems.forEach(diagramItem => {
    const result = setIsOpenedTree(diagramItem, diagramItemToUpdate.workspaceItem.key, isOpened)
    if (result != null) {
      selectedDiagramItem = result
    }
  })

  if (selectedDiagramItem != null) {
    console.log('closed item', (selectedDiagramItem as DiagramItem).workspaceItem.key, JSON.stringify((selectedDiagramItem as DiagramItem).data))
  }

  diagramItems.forEach(diagramItem => {
    moveItemTreeAfterOpenOtherItem(diagramItem, selectedDiagramItem, isOpened)
  })

  return diagramItems.map(d => d)
}

export const getDisplayPosition = (diagramItem: DiagramItem): DiagramItemPosition => {
  if (diagramItem.data.displayPosition != null) {
    return diagramItem.data.displayPosition
  }

  if (diagramItem.data.position != null) {
    return diagramItem.data.position
  }

  return {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  }
}

const getLastDisplayPosition = (diagramItem: DiagramItem): DiagramItemPosition => {
  if (diagramItem.data.transientLastDisplayPosition != null) {
    return diagramItem.data.transientLastDisplayPosition
  }

  return getValidPosition(diagramItem)
}

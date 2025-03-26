import { camelToSnake, snakeToCamel } from '../naming-case-utils'

test('test snake case to camel case', () => {
  // given
  const inputObj = {
    id: 'obj_id',
    some_number: 100.123,
    attribute_list: [
      {
        item_id: 10,
        is_active: true
      }, {
        item_id: 11,
        is_active: false
      }
    ]
  }

  // when
  const outputObj = snakeToCamel(inputObj)

  // then
  expect(outputObj).toEqual({
    id: 'obj_id',
    someNumber: 100.123,
    attributeList: [
      {
        itemId: 10,
        isActive: true
      }, {
        itemId: 11,
        isActive: false
      }
    ]
  })
})

test('test camel case to snake case', () => {
  // given
  const inputObj = {
    id: 'obj_id',
    someNumber: 100.123,
    attributeList: [
      {
        itemId: 10,
        isActive: true
      }, {
        itemId: 11,
        isActive: false
      }
    ]
  }

  // when
  const outputObj = camelToSnake(inputObj)

  // then
  expect(outputObj).toEqual({
    id: 'obj_id',
    some_number: 100.123,
    attribute_list: [
      {
        item_id: 10,
        is_active: true
      }, {
        item_id: 11,
        is_active: false
      }
    ]
  })
})

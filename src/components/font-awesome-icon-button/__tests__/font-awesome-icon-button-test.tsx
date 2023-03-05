import React from 'react'
import { screen, render, fireEvent } from '@testing-library/react'
import { faPen } from '@fortawesome/free-solid-svg-icons'
import FontAwesomeIconButton from '../font-awesome-icon-button'

test('test render fontAwesomeIconButton', () => {
  const dataTestId = 'dataTestId'
  const onClick = jest.fn()

  render(<FontAwesomeIconButton icon={faPen} size="1x" onClick={onClick} dataTestId={dataTestId} />)

  const container = screen.getByTestId(dataTestId)
  fireEvent.click(container)

  expect(onClick).toBeCalledTimes(1)
})

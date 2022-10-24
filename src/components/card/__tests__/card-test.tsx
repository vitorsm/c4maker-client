import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Card from '../card'

test('test card - content without description', () => {
  const cardTestId = 'card-test-id'
  const contentText = 'test-text'

  render(<Card dataTestId={cardTestId}><div data-testid='content-id'>{contentText}</div></Card>)

  const card = screen.getByTestId(cardTestId)

  expect(card).toHaveTextContent(contentText)
  expect(screen.queryByTestId(`description-container-${cardTestId}`)).not.toBeInTheDocument()
})

test('test card - content and description', () => {
  const cardTestId = 'card-test-id'
  const contentText = 'test-text'
  const descriptionText = 'test-description'

  render(<Card dataTestId={cardTestId} description={descriptionText}><div data-testid='content-id'>{contentText}</div></Card>)

  const card = screen.getByTestId(cardTestId)
  const description = screen.getByTestId(`description-container-${cardTestId}`)

  expect(card).toHaveTextContent(contentText)
  expect(description).toHaveTextContent(descriptionText)
})

test('test card - onClick', () => {
  const cardTestId = 'card-test-id'
  const contentText = 'test-text'
  const func = jest.fn()

  render(<Card dataTestId={cardTestId} onClick={func}><div data-testid='content-id'>{contentText}</div></Card>)

  const card = screen.getByTestId(cardTestId)
  fireEvent.click(card)
  fireEvent.click(card)

  expect(func).toBeCalledTimes(2)
})

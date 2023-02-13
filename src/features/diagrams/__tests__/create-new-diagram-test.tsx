import React from 'react'

import { screen, fireEvent, waitFor } from '@testing-library/react'
import { renderWithProvideres } from '../../../utils/test-utils'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { BrowserRouter } from 'react-router-dom'
import DiagramComponent from '../diagram-component'

const server = setupServer()

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('create new diagram error', async () => {
  const { store } = renderWithProvideres(<BrowserRouter><DiagramComponent /></BrowserRouter>)
  const errorDescription = 'Name is required'

  server.use(rest.post('http://localhost:5000/diagram', (req, res, ctx) => {
    return res(ctx.status(400), ctx.json({ description: errorDescription }), ctx.delay(150))
  }))

  const nameComponent = screen.getByTestId('create-diagram-component-name')
  const descriptionComponent = screen.getByTestId('create-diagram-component-description')
  const saveButtonComponent = screen.getByTestId('create-diagram-component-save-button')

  const diagramName = 'Name test'
  const diagramDescription = 'Description test'

  fireEvent.change(nameComponent, { target: { value: diagramName } })
  fireEvent.change(descriptionComponent, { target: { value: diagramDescription } })

  fireEvent.click(saveButtonComponent)

  expect(screen.queryByTestId('new-diagram-component-progress')).toBeInTheDocument()

  await waitFor(() => {
    expect(screen.queryByTestId('new-diagram-component-progress')).not.toBeInTheDocument()
    expect(store.getState().errorReducer.error.description).toEqual(errorDescription)
    // if item has disabled is not possible to edit it
    expect(descriptionComponent).not.toHaveAttribute('disabled')
    // the item has value if the edit is enabled
    expect(nameComponent).toHaveAttribute('value')
  })
})

test('create new diagram success', async () => {
  const { store } = renderWithProvideres(<BrowserRouter><DiagramComponent /></BrowserRouter>)

  const diagramName = 'Name test'
  const diagramDescription = 'Description test'

  server.use(rest.post('http://localhost:5000/diagram', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ id: 'item-id', name: diagramName, description: diagramDescription }), ctx.delay(150))
  }))

  const nameComponent = screen.getByTestId('create-diagram-component-name')
  const descriptionComponent = screen.getByTestId('create-diagram-component-description')
  const saveButtonComponent = screen.getByTestId('create-diagram-component-save-button')

  fireEvent.change(nameComponent, { target: { value: diagramName } })
  fireEvent.change(descriptionComponent, { target: { value: diagramDescription } })

  fireEvent.click(saveButtonComponent)

  expect(screen.queryByTestId('new-diagram-component-progress')).toBeInTheDocument()

  await waitFor(() => {
    expect(screen.queryByTestId('new-diagram-component-progress')).not.toBeInTheDocument()
    expect(store.getState().errorReducer.error).toBeUndefined()
  })
})

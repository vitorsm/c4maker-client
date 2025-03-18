import React from 'react'
import { screen, fireEvent, render, waitFor } from '@testing-library/react'
import Tooltip from '../tooltip'

test('test opening tooltip', async () => {
  const tooltipTest = 'test'
  render(<Tooltip text={tooltipTest}><div data-testid='div-test'>test</div></Tooltip>)

  const div = screen.getByTestId('div-test')
  fireEvent.mouseOver(div)

  await waitFor(() => {
    expect(screen.queryByTestId('tooltip-text-div')).toBeInTheDocument()
  }, { timeout: 1200 })

  fireEvent.mouseOut(div)
  await waitFor(() => {
    expect(screen.queryByTestId('tooltip-text-div')).not.toBeInTheDocument()
  }, { timeout: 200 })
})

test('test not opening tooltip', async () => {
  const tooltipTest = 'test'
  render(<Tooltip text={tooltipTest}><div data-testid='div-test'>test</div></Tooltip>)

  const div = screen.getByTestId('div-test')
  fireEvent.mouseOver(div)

  await waitFor(() => {
    expect(screen.queryByTestId('tooltip-text-div')).not.toBeInTheDocument()
  }, { timeout: 2 })
})

test('test opening tooltip and keep mouse on text', async () => {
  const dataTestId = 'tooltip-test-id'
  const tooltipTest = 'test'
  render(<Tooltip text={tooltipTest} dataTestId={dataTestId}><div data-testid='div-test'>test</div></Tooltip>)

  const div = screen.getByTestId('div-test')
  fireEvent.mouseOver(div)

  await waitFor(() => {
    expect(screen.queryByTestId(dataTestId)).toBeInTheDocument()
  }, { timeout: 1200 })

  const tooltipElement = screen.getByTestId(dataTestId)
  fireEvent.mouseOver(tooltipElement)

  await waitFor(() => {
    expect(screen.queryByTestId(dataTestId)).toBeInTheDocument()
  }, { timeout: 100 })

  fireEvent.mouseOut(tooltipElement)

  await waitFor(() => {
    expect(screen.queryByTestId(dataTestId)).not.toBeInTheDocument()
  }, { timeout: 200 })
})

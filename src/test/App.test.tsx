import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from '../App'

// Reset localStorage before each test
beforeEach(() => {
  localStorage.clear()
})

describe('Todo App', () => {
  it('renders the title', () => {
    render(<App />)
    expect(screen.getByText('todos')).toBeInTheDocument()
  })

  it('shows empty state message when no todos', () => {
    render(<App />)
    expect(screen.getByText(/no todos yet/i)).toBeInTheDocument()
  })

  it('adds a new todo when clicking Add', () => {
    render(<App />)
    const input = screen.getByPlaceholderText(/what needs to be done/i)
    fireEvent.change(input, { target: { value: 'Buy groceries' } })
    fireEvent.click(screen.getByRole('button', { name: /add todo/i }))
    expect(screen.getByText('Buy groceries')).toBeInTheDocument()
  })

  it('adds a new todo when pressing Enter', () => {
    render(<App />)
    const input = screen.getByPlaceholderText(/what needs to be done/i)
    fireEvent.change(input, { target: { value: 'Walk the dog' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(screen.getByText('Walk the dog')).toBeInTheDocument()
  })

  it('does not add empty todos', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /add todo/i }))
    expect(screen.getByText(/no todos yet/i)).toBeInTheDocument()
  })

  it('clears input after adding a todo', () => {
    render(<App />)
    const input = screen.getByPlaceholderText(/what needs to be done/i)
    fireEvent.change(input, { target: { value: 'Test task' } })
    fireEvent.click(screen.getByRole('button', { name: /add todo/i }))
    expect(input).toHaveValue('')
  })

  it('marks a todo as completed', () => {
    render(<App />)
    const input = screen.getByPlaceholderText(/what needs to be done/i)
    fireEvent.change(input, { target: { value: 'Complete me' } })
    fireEvent.click(screen.getByRole('button', { name: /add todo/i }))

    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)
    expect(checkbox).toBeChecked()
  })

  it('deletes a todo', () => {
    render(<App />)
    const input = screen.getByPlaceholderText(/what needs to be done/i)
    fireEvent.change(input, { target: { value: 'Delete me' } })
    fireEvent.click(screen.getByRole('button', { name: /add todo/i }))

    const deleteBtn = screen.getByRole('button', { name: /delete "delete me"/i })
    fireEvent.click(deleteBtn)
    expect(screen.queryByText('Delete me')).not.toBeInTheDocument()
  })

  it('shows item count', () => {
    render(<App />)
    const input = screen.getByPlaceholderText(/what needs to be done/i)
    fireEvent.change(input, { target: { value: 'Task 1' } })
    fireEvent.click(screen.getByRole('button', { name: /add todo/i }))
    fireEvent.change(input, { target: { value: 'Task 2' } })
    fireEvent.click(screen.getByRole('button', { name: /add todo/i }))
    expect(screen.getByText('2 items left')).toBeInTheDocument()
  })

  it('filters active todos', () => {
    render(<App />)
    const input = screen.getByPlaceholderText(/what needs to be done/i)
    fireEvent.change(input, { target: { value: 'Active task' } })
    fireEvent.click(screen.getByRole('button', { name: /add todo/i }))
    fireEvent.change(input, { target: { value: 'Done task' } })
    fireEvent.click(screen.getByRole('button', { name: /add todo/i }))

    const checkboxes = screen.getAllByRole('checkbox')
    fireEvent.click(checkboxes[1]) // complete second task

    fireEvent.click(screen.getByRole('button', { name: /^active$/i }))
    expect(screen.getByText('Active task')).toBeInTheDocument()
    expect(screen.queryByText('Done task')).not.toBeInTheDocument()
  })

  it('filters completed todos', () => {
    render(<App />)
    const input = screen.getByPlaceholderText(/what needs to be done/i)
    fireEvent.change(input, { target: { value: 'Active task' } })
    fireEvent.click(screen.getByRole('button', { name: /add todo/i }))
    fireEvent.change(input, { target: { value: 'Done task' } })
    fireEvent.click(screen.getByRole('button', { name: /add todo/i }))

    const checkboxes = screen.getAllByRole('checkbox')
    fireEvent.click(checkboxes[1])

    fireEvent.click(screen.getByRole('button', { name: /^completed$/i }))
    expect(screen.queryByText('Active task')).not.toBeInTheDocument()
    expect(screen.getByText('Done task')).toBeInTheDocument()
  })

  it('clears completed todos', () => {
    render(<App />)
    const input = screen.getByPlaceholderText(/what needs to be done/i)
    fireEvent.change(input, { target: { value: 'Keep me' } })
    fireEvent.click(screen.getByRole('button', { name: /add todo/i }))
    fireEvent.change(input, { target: { value: 'Remove me' } })
    fireEvent.click(screen.getByRole('button', { name: /add todo/i }))

    const checkboxes = screen.getAllByRole('checkbox')
    fireEvent.click(checkboxes[1]) // complete second

    fireEvent.click(screen.getByRole('button', { name: /clear completed/i }))
    expect(screen.getByText('Keep me')).toBeInTheDocument()
    expect(screen.queryByText('Remove me')).not.toBeInTheDocument()
  })
})

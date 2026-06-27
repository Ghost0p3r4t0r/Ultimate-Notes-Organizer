import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '@/components/ui/input';

describe('Input', () => {
  it('renders with default type text', () => {
    render(<Input placeholder="Enter name" />);
    const input = screen.getByPlaceholderText('Enter name') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.type).toBe('text');
  });

  it('renders with specified type', () => {
    render(<Input type="email" placeholder="Email" />);
    expect(screen.getByPlaceholderText('Email')).toHaveAttribute('type', 'email');
  });

  it('accepts user input', async () => {
    const user = userEvent.setup();
    render(<Input placeholder="Name" />);
    const input = screen.getByPlaceholderText('Name');
    await user.type(input, 'Hello');
    expect(input).toHaveValue('Hello');
  });

  it('calls onChange handler', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(<Input placeholder="Name" onChange={handleChange} />);
    await user.type(screen.getByPlaceholderText('Name'), 'a');
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is set', () => {
    render(<Input disabled placeholder="Disabled" />);
    expect(screen.getByPlaceholderText('Disabled')).toBeDisabled();
  });

  it('applies custom className', () => {
    render(<Input className="custom-class" placeholder="Test" />);
    expect(screen.getByPlaceholderText('Test').className).toContain('custom-class');
  });
});

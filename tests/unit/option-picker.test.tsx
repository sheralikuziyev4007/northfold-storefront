import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { OptionPicker } from '@/components/product/option-picker';
import { fixtureProduct } from './helpers';

const hoodie = fixtureProduct('heavyweight-hoodie');
const size = hoodie.options.find((o) => o.name === 'Size')!;
const color = hoodie.options.find((o) => o.name === 'Color')!;

describe('OptionPicker', () => {
  it('disables sold-out sizes and announces them', () => {
    render(
      <OptionPicker product={hoodie} option={size} selection={{ Color: 'Loden' }} onSelect={() => {}} />,
    );
    const xl = screen.getByRole('button', { name: 'Size XL, sold out' });
    expect(xl).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Size L' })).toBeEnabled();
  });

  it('reports the chosen value and marks it pressed', async () => {
    const onSelect = vi.fn();
    const { rerender } = render(
      <OptionPicker product={hoodie} option={size} selection={{ Color: 'Loden' }} onSelect={onSelect} />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Size M' }));
    expect(onSelect).toHaveBeenCalledWith('Size', 'M');

    rerender(
      <OptionPicker
        product={hoodie}
        option={size}
        selection={{ Color: 'Loden', Size: 'M' }}
        onSelect={onSelect}
      />,
    );
    expect(screen.getByRole('button', { name: 'Size M' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('renders colours as labelled swatches with the selection in the legend', () => {
    render(<OptionPicker product={hoodie} option={color} selection={{ Color: 'Oat' }} onSelect={() => {}} />);
    expect(screen.getByText(': Oat')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Oat' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getAllByRole('button')).toHaveLength(3);
  });
});

import { render, screen, fireEvent } from '@testing-library/react';
import { PartEmptyComponent } from '../PartComponent';

test('Part Empty Test', () => {
    render(<PartEmptyComponent part={0} stylePart={{ height: '50px' }} onPartClick={() => true} x={0} y={0} key={0} />);
    const partComponent = screen.getByTestId('part-0');
    expect(partComponent.style.height).toBe('50px');
    expect(partComponent.classList).toContain('empty');
    fireEvent.click(partComponent);
});
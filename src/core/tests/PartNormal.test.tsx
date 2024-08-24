import { render, screen, fireEvent } from '@testing-library/react';
import { PartNormalComponent } from '../PartComponent';

test('Part Normal Test', () => {
    render(<PartNormalComponent part={1} stylePart={{ height: '50px' }} onPartClick={() => true} x={1} y={1} key={0} selectedPart={null} />);
    const partComponent = screen.getByTestId('part-1');
    expect(partComponent.style.height).toBe('50px');
    expect(partComponent.textContent).toBe('1');
    fireEvent.click(partComponent);
});
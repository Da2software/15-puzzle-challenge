import React, { useState } from 'react';

type PartNormalComponentProps = {
    part: number;
    x: number;
    y: number;
    stylePart: any;
    selectedPart: any;
    onPartClick: (part: number, x: number, y: number) => void;
};
type PartEmptyComponentProps = {
    part: number;
    x: number;
    y: number;
    stylePart: any;
    onPartClick: (part: number, x: number, y: number) => void;
};
const PartNormalComponent: React.FC<PartNormalComponentProps> = ({ part, x, y, stylePart, selectedPart, onPartClick }) => {
    return (<div draggable onClick={() => onPartClick(part, x, y)}
        className={'game-boxcol' + (selectedPart?.x === x && selectedPart?.y === y ? ' selected' : '')}
        style={stylePart} data-testid={'part-' + part}>
        {part}
    </div>);
};

const PartEmptyComponent: React.FC<PartEmptyComponentProps> = ({ part, x, y, stylePart, onPartClick }) => {
    return (<div className={'game-boxcol empty'} style={stylePart} onClick={() => onPartClick(part, x, y)} data-testid={'part-' + part}>
    </div>);
};

export { PartNormalComponent, PartEmptyComponent };
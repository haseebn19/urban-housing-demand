import {describe, it, expect} from 'vitest';
import {render, screen} from '@testing-library/react';
import ProductPitch from '../components/ProductPitch';

describe('ProductPitch Component', () => {
    it('shows the project overview', () => {
        render(<ProductPitch />);

        expect(screen.getByRole('heading', {level: 1, name: 'Urban Housing Demand'})).toBeInTheDocument();
        for (const section of ['Key Objectives', 'Our Approach', 'Target Audiences', 'Data Sources']) {
            expect(screen.getByRole('heading', {level: 2, name: section})).toBeInTheDocument();
        }
    });
});

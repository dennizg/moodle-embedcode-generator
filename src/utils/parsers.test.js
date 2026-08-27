import test from 'node:test';
import assert from 'node:assert/strict';
import { parseCanva } from './parsers.js';

test('parseCanva normalizes a published Canva design link', () => {
    const result = parseCanva('https://www.canva.com/design/DAGabc123/view?utm_source=share');

    assert.deepEqual(result, {
        url: 'https://www.canva.com/design/DAGabc123/view?embed',
        aspectRatio: null,
    });
});

test('parseCanva extracts the responsive ratio from Canva embed HTML', () => {
    const html = `<div style="position: relative; width: 100%; height: 0; padding-top: 141.4286%; overflow: hidden;">
        <iframe src="https://www.canva.com/design/DAGabc123/token/view?embed" allowfullscreen="allowfullscreen"></iframe>
    </div>`;

    assert.deepEqual(parseCanva(html), {
        url: 'https://www.canva.com/design/DAGabc123/token/view?embed',
        aspectRatio: 141.4286,
    });
});

test('parseCanva rejects editor links and non-Canva URLs', () => {
    assert.equal(parseCanva('https://www.canva.com/design/DAGabc123/edit'), null);
    assert.equal(parseCanva('https://example.com/design/DAGabc123/view?embed'), null);
});

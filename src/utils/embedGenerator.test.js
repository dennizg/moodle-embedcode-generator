import test from 'node:test';
import assert from 'node:assert/strict';
import { generateEmbedHTML } from './embedGenerator.js';

test('generateEmbedHTML renders a responsive Canva embed', () => {
    const html = generateEmbedHTML('canva', {
        url: 'https://www.canva.com/design/DAGabc123/view?embed',
        aspectRatio: 141.4286,
    });

    assert.match(html, /Bekijk dit Canva-ontwerp:/);
    assert.match(html, /padding-bottom: 141\.4286%/);
    assert.match(html, /width: 100%; height: 100%/);
    assert.match(html, /allowfullscreen="allowfullscreen"/);
});

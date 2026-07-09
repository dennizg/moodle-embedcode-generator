/**
 * Generates a single embed HTML block for Moodle's HTML editor.
 * All output uses inline styles only (Moodle strips <style> blocks and unknown CSS classes).
 */

/**
 * @param {string} type - Content type key
 * @param {string|object} parsed - Parsed URL string or object { url, width, height, title }
 * @returns {string} HTML string ready for Moodle
 */
// Titles per content type
const EMBED_TITLES = {
    'youtube': 'Bekijk deze video:',
    'spotify': 'Beluister deze podcast:',
    'miro': 'Bekijk dit Miro-bord:',
    'padlet': 'Bekijk dit Padlet-bord:',
    'h5p': 'Maak deze oefening:',
    'sharepoint-pdf': 'Lees dit document:',
    'sharepoint-ppt': 'Bekijk deze presentatie aandachtig:',
    'sharepoint-excel': 'Bekijk dit spreadsheet:',
    'sharepoint-word': 'Lees dit document:',
    'sharepoint-video': 'Bekijk deze video:',
    'microsoft-forms': 'Vul dit formulier in:',
    'generic': 'Bekijk deze content:',
};

export const generateEmbedHTML = (type, parsed) => {
    const url = typeof parsed === 'object' ? parsed.url : parsed;
    const width = typeof parsed === 'object' ? parsed.width : null;
    const height = typeof parsed === 'object' ? parsed.height : null;

    if (!url) return '';

    const title = EMBED_TITLES[type] || EMBED_TITLES['generic'];
    const titleHtml = `<h5>${title}</h5>\n`;

    switch (type) {
        case 'youtube':
            return titleHtml + `<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; border-radius: 8px;">
    <iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" src="${url}" allowfullscreen="allowfullscreen"></iframe>
</div>`;

        case 'spotify':
            return titleHtml + `<div style="width: 100%; max-width: 100%;">
    <iframe style="border-radius: 12px;" src="${url}" width="100%" height="152" frameborder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" allowfullscreen="allowfullscreen" loading="lazy"></iframe>
</div>`;

        case 'h5p':
            return titleHtml + `<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; border-radius: 8px;">
    <iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" src="${url}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="allowfullscreen"></iframe>
</div>`;

        case 'sharepoint-video':
            return titleHtml + `<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; border-radius: 8px;">
    <iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" src="${url}" allowfullscreen="allowfullscreen"></iframe>
</div>`;

        case 'sharepoint-pdf': {
            const pdfEmbed = (width && height)
                ? `<div style="position: relative; padding-bottom: ${((height / width) * 100).toFixed(2)}%; height: 0; overflow: hidden; max-width: 100%; border-radius: 8px;">
    <iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" src="${url}" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true"></iframe>
</div>`
                : `<div style="width: 100%; height: 600px;">
    <iframe src="${url}" width="100%" height="100%" style="border: none;"></iframe>
</div>`;
            return titleHtml + `${pdfEmbed}
<div style="text-align: right; margin-top: 5px;">
    <a href="${url}" target="_blank" rel="noopener noreferrer" style="font-size: 0.9em; color: #E3027F; text-decoration: none;">
        <i class="fa-solid fa-external-link-alt"></i> Bekijk in volledig scherm
    </a>
</div>`;
        }

        case 'sharepoint-ppt':
        case 'sharepoint-excel':
        case 'sharepoint-word': {
            const paddingBottom = (width && height)
                ? `${((height / width) * 100).toFixed(2)}%`
                : '56.25%';
            return titleHtml + `<div style="position: relative; padding-bottom: ${paddingBottom}; height: 0; overflow: hidden; max-width: 100%; border-radius: 8px;">
    <iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" src="${url}" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
</div>
<div style="text-align: right; margin-top: 5px;">
    <a href="${url}" target="_blank" rel="noopener noreferrer" style="font-size: 0.9em; color: #E3027F; text-decoration: none;">
        <i class="fa-solid fa-external-link-alt"></i> Bekijk in volledig scherm
    </a>
</div>`;
        }

        case 'miro':
            return titleHtml + `<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; border-radius: 8px;">
    <iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" src="${url}" allow="fullscreen; clipboard-read; clipboard-write" allowfullscreen="allowfullscreen"></iframe>
</div>`;

        case 'padlet':
            return titleHtml + `<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; border-radius: 8px;">
    <iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" src="${url}" allowfullscreen="allowfullscreen"></iframe>
</div>`;

        case 'microsoft-forms':
            return titleHtml + `<div style="width: 100%; height: 600px;">
    <iframe src="${url}" width="100%" height="100%" style="border: none;" allowfullscreen="allowfullscreen"></iframe>
</div>`;

        case 'generic':
        default: {
            if (width && height) {
                const paddingBottom = ((height / width) * 100).toFixed(2);
                return titleHtml + `<div style="position: relative; padding-bottom: ${paddingBottom}%; height: 0; overflow: hidden; max-width: 100%; border-radius: 8px;">
    <iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" src="${url}" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
</div>`;
            }
            return titleHtml + `<div style="width: 100%; height: 600px;">
    <iframe src="${url}" width="100%" height="100%" style="border: none;" allowfullscreen="allowfullscreen"></iframe>
</div>`;
        }
    }
};

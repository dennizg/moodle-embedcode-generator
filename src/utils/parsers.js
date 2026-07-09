/**
 * Utility functions to parse various media URLs into embed codes or IDs.
 * Adapted from the Moodle Content Accordion project with additional parsers.
 */

/**
 * Parses a YouTube input (URL, ID, or Iframe) and returns a clean embed URL.
 */
export const parseYoutube = (input) => {
    if (!input) return null;

    if (input.includes('youtube.com/embed/')) {
        return input.trim();
    }

    if (input.includes('<iframe')) {
        const match = input.match(/src="([^"]+)"/);
        return match ? match[1] : null;
    }

    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = input.match(regExp);

    if (match && match[2].length === 11) {
        return `https://www.youtube.com/embed/${match[2]}`;
    }

    if (input.trim().length === 11 && /^[a-zA-Z0-9_-]+$/.test(input.trim())) {
        return `https://www.youtube.com/embed/${input.trim()}`;
    }

    return null;
};

/**
 * Parses a Spotify input (URL or Embed) and returns a clean embed URL.
 */
export const parseSpotify = (input) => {
    if (!input) return null;

    if (input.includes('open.spotify.com/embed')) {
        return input.trim();
    }

    if (input.includes('<iframe')) {
        const match = input.match(/src="([^"]+)"/);
        return match ? match[1] : null;
    }

    if (input.includes('open.spotify.com')) {
        try {
            const url = new URL(input.trim());
            const path = url.pathname;
            return `https://open.spotify.com/embed${path}`;
        } catch (e) {
            return null;
        }
    }

    return null;
};

/**
 * Parses an H5P input (URL or Embed).
 */
export const parseH5P = (input) => {
    if (!input) return null;

    if (input.includes('<iframe')) {
        const match = input.match(/src="([^"]+)"/);
        return match ? match[1] : null;
    }

    if (input.includes('view.php')) {
        return input.trim().replace('view.php', 'embed.php');
    }

    if (input.includes('embed.php')) {
        return input.trim();
    }

    return input.trim();
};

/**
 * Parses Microsoft Stream or SharePoint Video.
 */
export const parseSharePointVideo = (input) => {
    if (!input) return null;

    if (input.includes('<iframe')) {
        const match = input.match(/src="([^"]+)"/);
        return match ? match[1] : null;
    }

    let cleanUrl = input.trim();

    try {
        const shareLinkPattern = /\/:[a-z]:\/[a-z]\//;
        if (shareLinkPattern.test(cleanUrl)) {
            cleanUrl = cleanUrl.replace(shareLinkPattern, '/');
        }

        const urlObj = new URL(cleanUrl);
        const host = urlObj.hostname.toLowerCase();

        if (host.includes('sharepoint.com') || host.includes('office.com')) {
            urlObj.searchParams.set('web', '1');
            urlObj.searchParams.delete('e');
            urlObj.searchParams.delete('csf');
        }

        return urlObj.toString();
    } catch (e) {
        return cleanUrl;
    }
};

/**
 * Parses SharePoint PDF URL.
 */
export const parseSharePointPDF = (input) => {
    if (!input) return null;

    if (input.includes('<iframe')) {
        const srcMatch = input.match(/src="([^"]+)"/);
        const widthMatch = input.match(/width="([^"]+)"/);
        const heightMatch = input.match(/height="([^"]+)"/);

        if (srcMatch) {
            const url = srcMatch[1];
            if (widthMatch && heightMatch) {
                return {
                    url: url,
                    width: parseInt(widthMatch[1]),
                    height: parseInt(heightMatch[1])
                };
            }
            return url;
        }
        return null;
    }

    let cleanUrl = input.trim();

    try {
        const shareLinkPattern = /\/:[a-z]:\/r\//;
        if (shareLinkPattern.test(cleanUrl)) {
            cleanUrl = cleanUrl.replace(shareLinkPattern, '/');
        }

        const urlObj = new URL(cleanUrl);
        urlObj.searchParams.set('web', '1');
        urlObj.searchParams.delete('e');
        urlObj.searchParams.delete('csf');

        return urlObj.toString();
    } catch (e) {
        return cleanUrl;
    }
};

/**
 * Parses PowerPoint input (SharePoint).
 */
export const parseSharePointPowerPoint = (input) => {
    if (!input) return null;

    if (input.includes('<iframe')) {
        const srcMatch = input.match(/src="([^"]+)"/);
        const widthMatch = input.match(/width="([^"]+)"/);
        const heightMatch = input.match(/height="([^"]+)"/);

        if (srcMatch) {
            const url = srcMatch[1];
            if (widthMatch && heightMatch) {
                return {
                    url: url,
                    width: parseInt(widthMatch[1]),
                    height: parseInt(heightMatch[1])
                };
            }
            return url;
        }
        return null;
    }

    let cleanUrl = input.trim();

    try {
        const urlObj = new URL(cleanUrl);

        const dParam = urlObj.searchParams.get('d');
        if (dParam && dParam.length >= 32) {
            let rawGuid = dParam.startsWith('w') ? dParam.substring(1) : dParam;

            if (rawGuid.length === 32) {
                const guid = `${rawGuid.substr(0, 8)}-${rawGuid.substr(8, 4)}-${rawGuid.substr(12, 4)}-${rawGuid.substr(16, 4)}-${rawGuid.substr(20)}`;
                const path = urlObj.pathname;
                const siteMatch = path.match(/(\/teams\/[^\/]+|\/sites\/[^\/]+)/);
                const sitePath = siteMatch ? siteMatch[1] : '';
                return `${urlObj.origin}${sitePath}/_layouts/15/Doc.aspx?sourcedoc={${guid}}&action=embedview`;
            }
        }

        if (urlObj.searchParams.has('action')) {
            urlObj.searchParams.set('action', 'embedview');
            return urlObj.toString();
        }

        const host = urlObj.hostname.toLowerCase();
        if ((host.includes('sharepoint.com') || host.includes('office.com') || host.includes('onedrive.live.com')) && !cleanUrl.includes('action=')) {
            urlObj.searchParams.set('action', 'embedview');
            return urlObj.toString();
        }

        return cleanUrl;
    } catch (e) {
        return null;
    }
};

/**
 * Parses SharePoint Excel URL.
 */
export const parseSharePointExcel = (input) => {
    if (!input) return null;

    if (input.includes('<iframe')) {
        const srcMatch = input.match(/src="([^"]+)"/);
        const widthMatch = input.match(/width="([^"]+)"/);
        const heightMatch = input.match(/height="([^"]+)"/);

        if (srcMatch) {
            const url = srcMatch[1];
            if (widthMatch && heightMatch) {
                return { url, width: parseInt(widthMatch[1]), height: parseInt(heightMatch[1]) };
            }
            return url;
        }
        return null;
    }

    let cleanUrl = input.trim();

    try {
        const urlObj = new URL(cleanUrl);

        // Handle sharing links with 'd' param (same pattern as PPT)
        const dParam = urlObj.searchParams.get('d');
        if (dParam && dParam.length >= 32) {
            let rawGuid = dParam.startsWith('w') ? dParam.substring(1) : dParam;
            if (rawGuid.length === 32) {
                const guid = `${rawGuid.substr(0, 8)}-${rawGuid.substr(8, 4)}-${rawGuid.substr(12, 4)}-${rawGuid.substr(16, 4)}-${rawGuid.substr(20)}`;
                const path = urlObj.pathname;
                const siteMatch = path.match(/(\/teams\/[^\/]+|\/sites\/[^\/]+)/);
                const sitePath = siteMatch ? siteMatch[1] : '';
                return `${urlObj.origin}${sitePath}/_layouts/15/Doc.aspx?sourcedoc={${guid}}&action=embedview`;
            }
        }

        // Try to convert to embed view
        const host = urlObj.hostname.toLowerCase();
        if (host.includes('sharepoint.com') || host.includes('office.com') || host.includes('onedrive.live.com')) {
            // Strip sharing redirect patterns
            const shareLinkPattern = /\/:[a-z]:\/[a-z]\//;
            let pathname = urlObj.pathname;
            if (shareLinkPattern.test(pathname)) {
                pathname = pathname.replace(shareLinkPattern, '/');
                urlObj.pathname = pathname;
            }
            urlObj.searchParams.set('action', 'embedview');
            urlObj.searchParams.delete('e');
            urlObj.searchParams.delete('csf');
            return urlObj.toString();
        }

        return cleanUrl;
    } catch (e) {
        return null;
    }
};

/**
 * Parses SharePoint Word URL.
 */
export const parseSharePointWord = (input) => {
    if (!input) return null;

    if (input.includes('<iframe')) {
        const srcMatch = input.match(/src="([^"]+)"/);
        const widthMatch = input.match(/width="([^"]+)"/);
        const heightMatch = input.match(/height="([^"]+)"/);

        if (srcMatch) {
            const url = srcMatch[1];
            if (widthMatch && heightMatch) {
                return { url, width: parseInt(widthMatch[1]), height: parseInt(heightMatch[1]) };
            }
            return url;
        }
        return null;
    }

    let cleanUrl = input.trim();

    try {
        const urlObj = new URL(cleanUrl);

        const dParam = urlObj.searchParams.get('d');
        if (dParam && dParam.length >= 32) {
            let rawGuid = dParam.startsWith('w') ? dParam.substring(1) : dParam;
            if (rawGuid.length === 32) {
                const guid = `${rawGuid.substr(0, 8)}-${rawGuid.substr(8, 4)}-${rawGuid.substr(12, 4)}-${rawGuid.substr(16, 4)}-${rawGuid.substr(20)}`;
                const path = urlObj.pathname;
                const siteMatch = path.match(/(\/teams\/[^\/]+|\/sites\/[^\/]+)/);
                const sitePath = siteMatch ? siteMatch[1] : '';
                return `${urlObj.origin}${sitePath}/_layouts/15/Doc.aspx?sourcedoc={${guid}}&action=embedview`;
            }
        }

        const host = urlObj.hostname.toLowerCase();
        if (host.includes('sharepoint.com') || host.includes('office.com') || host.includes('onedrive.live.com')) {
            const shareLinkPattern = /\/:[a-z]:\/[a-z]\//;
            let pathname = urlObj.pathname;
            if (shareLinkPattern.test(pathname)) {
                pathname = pathname.replace(shareLinkPattern, '/');
                urlObj.pathname = pathname;
            }
            urlObj.searchParams.set('action', 'embedview');
            urlObj.searchParams.delete('e');
            urlObj.searchParams.delete('csf');
            return urlObj.toString();
        }

        return cleanUrl;
    } catch (e) {
        return null;
    }
};

/**
 * Parses a Miro board URL or embed code.
 */
export const parseMiro = (input) => {
    if (!input) return null;

    if (input.includes('<iframe')) {
        const match = input.match(/src="([^"]+)"/);
        return match ? match[1] : null;
    }

    let cleanUrl = input.trim();

    // https://miro.com/app/board/uXjVK...=/ → https://miro.com/app/embed/uXjVK...=/
    if (cleanUrl.includes('miro.com/app/board/')) {
        return cleanUrl.replace('/app/board/', '/app/embed/');
    }

    if (cleanUrl.includes('miro.com/app/embed/')) {
        return cleanUrl;
    }

    // Fallback: if it looks like a miro URL
    if (cleanUrl.includes('miro.com')) {
        return cleanUrl;
    }

    return null;
};

/**
 * Parses a Padlet URL or embed code.
 */
export const parsePadlet = (input) => {
    if (!input) return null;

    if (input.includes('<iframe')) {
        const match = input.match(/src="([^"]+)"/);
        return match ? match[1] : null;
    }

    let cleanUrl = input.trim();

    // https://padlet.com/user/boardname → https://padlet.com/embed/...
    // Padlet embed URLs typically look like: https://padlet.com/embed/boardid
    // or the direct URL works if converted
    if (cleanUrl.includes('padlet.com')) {
        // If it's already an embed URL, return as is
        if (cleanUrl.includes('/embed/')) {
            return cleanUrl;
        }
        // Try to use the padlet embed format
        // Most padlet URLs work directly as embed src
        return cleanUrl;
    }

    return null;
};

/**
 * Parses a Microsoft Forms URL or embed code.
 */
export const parseMicrosoftForms = (input) => {
    if (!input) return null;

    if (input.includes('<iframe')) {
        const match = input.match(/src="([^"]+)"/);
        return match ? match[1] : null;
    }

    let cleanUrl = input.trim();

    // https://forms.office.com/Pages/ResponsePage.aspx?id=...
    // or https://forms.microsoft.com/...
    if (cleanUrl.includes('forms.office.com') || cleanUrl.includes('forms.microsoft.com')) {
        return cleanUrl;
    }

    return null;
};

/**
 * Parses a generic input (iframe, URL) and attempts to extract dimensions and a title.
 */
export const parseGenericEmbed = (input) => {
    if (!input) return null;

    let url = '';
    let width = null;
    let height = null;
    let title = 'Embed';

    if (input.includes('<iframe')) {
        const srcMatch = input.match(/src=["']([^"']+)["']/);
        if (srcMatch) {
            url = srcMatch[1];

            const widthMatch = input.match(/width=["']([^"']+)["']/);
            const heightMatch = input.match(/height=["']([^"']+)["']/);

            if (widthMatch) width = widthMatch[1];
            if (heightMatch) height = heightMatch[1];

            if (!width || !height) {
                const styleMatch = input.match(/style=["']([^"']+)["']/);
                if (styleMatch) {
                    const style = styleMatch[1];
                    const wStyle = style.match(/width:\s*([^;]+)/);
                    const hStyle = style.match(/height:\s*([^;]+)/);
                    if (wStyle && !width) width = wStyle[1];
                    if (hStyle && !height) height = hStyle[1];
                }
            }
        }
    } else {
        url = input.trim();
    }

    if (!url) return null;

    const parseDim = (dim) => {
        if (!dim) return null;
        if (typeof dim === 'number') return dim;
        if (dim.includes('%')) return null;
        const clean = dim.replace('px', '').trim();
        return !isNaN(clean) ? parseInt(clean) : null;
    };

    width = parseDim(width);
    height = parseDim(height);

    try {
        const urlObj = new URL(url);
        const hostname = urlObj.hostname;
        let domain = hostname.replace('www.', '');
        const parts = domain.split('.');
        let name = parts[0];

        if (parts.length > 2) {
            if (domain.includes('sharepoint')) name = 'SharePoint';
            else if (domain.includes('google')) name = 'Google';
            else name = parts[parts.length - 2];
        } else if (parts.length === 2) {
            name = parts[0];
        }

        title = name.charAt(0).toUpperCase() + name.slice(1);
    } catch (e) {
        // keep default title
    }

    return { url, width, height, title };
};

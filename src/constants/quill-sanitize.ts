import DOMPurify from 'dompurify';

export const QUILL_EDITOR_SANITIZATION_CONFIG = {
    ALLOWED_TAGS: ['p', 'b', 'i', 'em', 'strong', 'u', 's', 'strike', 'del', 'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre', 'code', 'br', 'hr', 'img'],
    ALLOWED_ATTR: ['href', 'src', 'target', 'rel', 'alt', 'width', 'height', 'class', 'id'],
    ADD_ATTR: ['target', 'rel'],
    FORBID_ATTR: [],
    afterSanitizeAttributes: (node: HTMLElement) => {
        if (node.nodeName.toLowerCase() === 'img') {
            const src = node.getAttribute('src');
            if (src) {
                if (!src.startsWith('http://') && !src.startsWith('https://') && !src.startsWith('data:')) {
                    node.removeAttribute('src');
                } else {
                    const safeSrc = DOMPurify.sanitize(src, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
                    node.setAttribute('src', safeSrc);
                }
            }
        }
        if (node.nodeName.toLowerCase() === 'a' && node.getAttribute('target') === '_blank') {
            node.setAttribute('rel', 'noopener noreferrer');
        }
    },
};

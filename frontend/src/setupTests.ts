import '@testing-library/jest-dom';

// jsdom has no matchMedia; the tests run as if no media query matches
window.matchMedia = (query) => ({matches: false, media: query}) as MediaQueryList;

// jsdom has no ResizeObserver, which Chart.js uses to resize charts with the page
window.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
};

// jsdom has no canvas, which Chart.js draws on
HTMLCanvasElement.prototype.getContext = (() => {
    return {
        fillRect: () => {},
        clearRect: () => {},
        getImageData: () => ({data: []}),
        putImageData: () => {},
        createImageData: () => [],
        setTransform: () => {},
        drawImage: () => {},
        save: () => {},
        restore: () => {},
        beginPath: () => {},
        moveTo: () => {},
        lineTo: () => {},
        closePath: () => {},
        stroke: () => {},
        fill: () => {},
        translate: () => {},
        scale: () => {},
        rotate: () => {},
        arc: () => {},
        measureText: () => ({width: 0}),
        transform: () => {},
        rect: () => {},
        clip: () => {}
    };
}) as unknown as typeof HTMLCanvasElement.prototype.getContext;

//@ts-nocheck
function _setupAurora() {
    // @ts-ignore
    const el = document.querySelector("lynx-view").shadowRoot.querySelector(`#lock-aurora`);
    console.log("lock el", el)
    // 1) Set the gradient stack
    el.style.background = `
        radial-gradient(60% 60% at 20% 25%, rgba(255, 90, 165, 0.8), rgba(255, 90, 165, 0) 60%),
        radial-gradient(70% 70% at 80% 25%, rgba(255, 210, 138, 0.85), rgba(255, 210, 138, 0) 60%),
        radial-gradient(70% 70% at 40% 85%, rgba(121, 224, 255, 0.9), rgba(121, 224, 255, 0) 65%),
        radial-gradient(90% 90% at 60% 60%, rgba(106, 125, 255, 0.65), rgba(106, 125, 255, 0) 70%)
    `;

    // 2) Make each layer larger than the element and avoid tiling
    el.style.backgroundSize = '200% 200%, 200% 200%, 200% 200%, 200% 200%';
    el.style.backgroundRepeat = 'no-repeat, no-repeat, no-repeat, no-repeat';

    // Optional perf hint
    el.style.willChange = 'background-position';

    // 3) Animate with the Web Animations API (same keyframe idea as your CSS)
    el.animate(
        [
            { backgroundPosition: '0% 0%, 100% 0%, 50% 100%, 30% 60%' },
            { backgroundPosition: '80% 20%, 20% 80%, 30% 40%, 60% 30%' },
            { backgroundPosition: '0% 0%, 100% 0%, 50% 100%, 30% 60%' },
        ],
        { duration: 5000, iterations: Infinity, easing: 'linear' }
    );
}

export function setupAurora() {
    const lynx = document.querySelector("lynx-view");
    if (!lynx) return;

    const observer = new MutationObserver(() => {
        const el = lynx.shadowRoot?.querySelector("#lock-aurora");
        if (el) {
            console.log("element available setting up aurora")
            setTimeout(() => {
                _setupAurora();
            }, 1000);
            // observer.disconnect(); // stop watching once found
        }
    });

    // Watch for changes inside the shadowRoot
    if (lynx.shadowRoot) {
        observer.observe(lynx.shadowRoot, { childList: true, subtree: true });
    }
}
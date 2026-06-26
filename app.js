// Import page component initializers
const routes = {
    '/': () => `
        <section>
            <h1>Welcome to my Capstone Portfolio Hub</h1>
            <p>This production hub combines dynamic state management engines and asynchronous API connections into a unified framework.</p>
        </section>
    `,
    '/contact': () => `
        <section>
            <h1>Contact Integration</h1>
            <form action="#" method="POST" style="margin-top:1rem;">
                <label for="c-name" style="display:block; font-weight:bold;">Name</label>
                <input type="text" id="c-name" style="width:100%; margin-bottom:1rem; padding:0.5rem;">
                <button type="submit" style="padding:0.5rem 1rem; background:var(--accent); color:white; border:none;">Submit</button>
            </form>
        </section>
    `
};

// Router matching execution
function router() {
    const appTarget = document.getElementById('app');
    // Extract route hash link path parameter safely, default to root '/'
    const path = window.location.hash.slice(1) || '/';
    
    // Check if route exists, render fallback route if missing
    const renderContent = routes[path] || (() => `<section><h1>404 Error</h1><p>View layer route missing.</p></section>`);
    
    appTarget.innerHTML = renderContent();
}

// Attach location hash listener loops
window.addEventListener('hashchange', router);
window.addEventListener('load', router);

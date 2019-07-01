'use strict';

const login = locale => {
    if (locale === 'no-NB') {
        return `
            <div class="auth-grid">
                <div><wired-input placeholder="Angi navn"></wired-input></div>
                <div></div>
                <div><wired-input type="password" placeholder="Passord"></wired-input></div>
                <div><wired-button>Logg på</wired-button></div>
            </div>
        `;
    }

    return `
        <div class="auth-grid">
            <div><wired-input placeholder="Enter name"></wired-input></div>
            <div></div>
            <div><wired-input type="password" placeholder="Password"></wired-input></div>
            <div><wired-button>Login</wired-button></div>
        </div>
    `;
}
module.exports.login = login;

const auth = locale => {
    return `
        <wired-card>
            ${login(locale)}
        </wired-card>
    `;
}
module.exports.auth = auth;

const fallback = data => {
    return `
        <wired-card>
            <p>Login is currenty experiencing problems.</p>
            <p>Please try again later.</p>
        </wired-card>
    `;
}
module.exports.fallback = fallback;

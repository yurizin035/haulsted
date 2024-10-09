alert(`DEVIDO NOSSA ATUALIZAÇÃO, TODOS USUÁRIOS SEM SALDOS FORAM DELETADOS DE NOSSO SITE!\n\nCASO DÊ USUÁRIO OU SENHA INCORRETA FAÇA SEU CADASTRO NOVAMENTE!`);
document.getElementById("username").addEventListener("keydown", function(event) {
    if (event.key === " ") {
        event.preventDefault();
    }
});

async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    try {
        const response = await fetch(`../api/?email=${email}`);
        const data = await response.json();

        const user = data.users.find(user => user.email === email && user.password === password);

        if (user) {
            setUserLoggedCookie();
            window.location.href = '/';
        } else {
            alert('Erro: e-mail ou senha incorretos');
        }
    } catch (error) {
        alert('Erro: e-mail ou senha incorretos');
    }
    
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
}

function setUserLoggedCookie() {
    const email = document.getElementById('email').value;
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 100);
    document.cookie = `userlogged=${encodeURIComponent(email)}; expires=${expirationDate.toUTCString()}; path=/`;
}

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    login();
});

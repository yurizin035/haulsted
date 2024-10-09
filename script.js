const buttons = document.querySelectorAll('.sessao button');
const contentDivs = document.querySelectorAll('.conteudo');
const ballanceSpan = document.getElementById('ballance'); // Certifique-se de que este ID está correto
const divPopup = document.querySelectorAll('.divpopup'); // Certifique-se de que esta classe está correta
const menu = document.querySelectorAll('.menu'); // Remova se não estiver sendo utilizado
const menuDiv = document.getElementById('menu'); // Use querySelector se for um único elemento
const deposit = document.querySelectorAll('.ismenudeposit'); 
    const useremail1 = useremail(); // Certifique-se de que esta classe está correta

buttons.forEach(button => {
  button.addEventListener('click', () => {
    buttons.forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
    
    contentDivs.forEach(div => div.classList.add('inativa'));
    
    const contentId = button.id === 'whatsapp' ? 'conteudo1' : 'conteudo2';
    document.getElementById(contentId).classList.remove('inativa');
  });
});

function beneficio() {
  divPopup.forEach(el => el.classList.remove('popup-off'));
}

function closebeneficios() {
  divPopup.forEach(el => el.classList.add('popup-off'));
}

function showmenu() {
  menu.forEach(el => el.classList.remove('popup-off')); // Certifique-se de que isso está controlando a visibilidade corretamente
}

function closemenu() {
  menu.forEach(el => el.classList.add('popup-off')); // Certifique-se de que isso está controlando a visibilidade corretamente
}

function depositmenu() {
  deposit.forEach(el => el.classList.remove('popup-off')); // Certifique-se de que isso está controlando a visibilidade corretamente
}

function closedeposit() {
  deposit.forEach(el => el.classList.add('popup-off')); // Certifique-se de que isso está controlando a visibilidade corretamente
}
function useremail() {
  function getCookieValue(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  const cookieValue = getCookieValue('userlogged');
  if (cookieValue) {
    return decodeURIComponent(cookieValue);
  }
}

// Função assíncrona auto-executável para buscar e atualizar o saldo
(async function() {
  try {
    const email = useremail();
    if (!email) throw new Error('Email não encontrado no cookie');

    const response = await fetch(`https://haulsted.netlify.app/.netlify/functions/getUserByEmail?email=${email}`);

    if (!response.ok) {
      throw new Error('Erro ao buscar o arquivo JSON');
    }

    const data = await response.json();
    const user = data.users.find(user => user.email === email);

    if (user) {
      const welcome = document.getElementById('welcome');
      const line = document.getElementById('line');
      const current_balance = document.getElementById('current_balance');
      const total_spent = document.getElementById('total_spent');
      const total_deposited = document.getElementById('total_deposited');
      const current_status = document.getElementById('current_status');
      const balanceSpan = document.getElementById('porcentagem');
      const spend_to_level_up = document.getElementById('spend_to_level_up');
      const next_status = document.getElementById('next_status');

    welcome.textContent = `Bem-vindo ${user.username}`;
    current_balance.textContent = `R$ ${user.current_balance.toLocaleString('pt-BR')}`;
    total_spent.textContent = `R$ ${user.total_spent.toLocaleString('pt-BR')}`;
    total_deposited.textContent = `R$ ${user.total_deposited.toLocaleString('pt-BR')}`;
    current_status.textContent = `${user.current_status}`;
    balanceSpan.textContent = `${user.porcentagem}%`;
    spend_to_level_up.textContent = `R$ ${user.spend_to_level_up.toLocaleString('pt-BR')}`;
    line.style.width = `${user.porcentagem}%`;
    next_status.textContent = `${user.next_status}`;
    } else {
      console.log('Usuário não encontrado');
    }
  } catch (error) {
    console.error('Erro:', error);
  }
})();
document.addEventListener('DOMContentLoaded', function() {
    // Função para obter o valor de um cookie pelo nome
    function readCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    // Verifica se o cookie 'userlogged' existe
    if (!readCookie('userlogged')) {
        // Se o cookie não existir, aplica o estilo display:none ao body
        document.body.style.display = 'none';
        // Redireciona o usuário para o diretório './login/'
        window.location.href = './login/';
    }
});
async function submitdeposit() {
    try {
        const value = document.getElementById("submit");
        const email = useremail();

        // Faz a requisição para a API usando o email fornecido
        const response = await fetch(`https://haulsted.netlify.app/.netlify/functions/getUserByEmail?email=${email}`);

        if (!response.ok) {
            throw new Error('Erro ao buscar o arquivo JSON');
        }

        const data = await response.json();
        const user = data.users.find(user => user.email === email);

        if (user) {
            // Obtém o número de WhatsApp
            const whatsapp = user.whatsapp;
            if (!whatsapp) {
                throw new Error('Não foi possível obter o número do WhatsApp.');
            }

            // Obtém a data atual formatada
            const dataAtual = new Date().toLocaleString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            });

            // Cria o FormData
            const formData = new FormData();
            formData.append('value', value.value);
            formData.append('email', email);
            formData.append('dataAtual', dataAtual);
            formData.append('whatsapp', whatsapp);

            // Envia o formulário para o servidor
            const depositResponse = await fetch('../api/deposit.php', { // Certifique-se de que o caminho está correto
                method: 'POST',
                body: formData
            });

            // Lê a resposta do servidor
            const responseText = await depositResponse.text();
            if (responseText.includes("Cadastro realizado com sucesso!")) {
                await fetch('https://trigger.macrodroid.com/9d34e488-2979-46db-b2f4-1898535f4e1f/depositmanual', {
                    method: 'POST' // Ou 'POST', dependendo do que o webhook exige
                });
                window.location.href = "/";
            } else {
                alert(responseText);
            }
        } else {
            throw new Error('Usuário não encontrado.');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert(error.message); // Exibe uma mensagem de erro para o usuário
    } finally {
        // Limpa o valor do campo "submit" após a execução
        document.getElementById("submit").value = '';
    }
}
async function sendrequest() {
  try {
    const email = useremail(); // Obtém o email do usuário a partir do cookie
    if (!email) throw new Error('Email não encontrado no cookie');

    // Faz a requisição para a API usando o email fornecido
    const response = await fetch(`https://haulsted.netlify.app/.netlify/functions/getUserByEmail?email=${email}`);

    if (!response.ok) {
      throw new Error('Erro ao buscar o arquivo JSON');
    }

    const data = await response.json();
    const user = data.users.find(user => user.email === email);

    if (user) {
      const currentBalance = user.current_balance;

      if (currentBalance >= 30) {
        alert(`INFELIZMENTE, NOSSA API NÃO ESTÁ ATIVA NO MOMENTO DEVIDO BREVIAS ATUALIZAÇÕES!\n\n PORÉM FIQUE CALMO, NENHUM SALDO FOI DESCONTADO!`);
      } else {
        alert('SEU SALDO NÃO E SUFICIENTE PARA REALIZAR ESTA AÇÃO, FAÇA SUA RECARGA AGORA!');
        depositmenu();
      }
    } else {
      throw new Error('Usuário não encontrado.');
    }
  } catch (error) {
    console.error('Erro:', error);
    alert('Erro ao processar a solicitação.'); // Mensagem de erro genérica para o usuário
  }
}
alert(`ESTE É APENAS UM PREVIEW DE NOSSA ATUALIZAÇÃO, E MUITAS FUNÇÕES AINDA NÃO ESTÃO PRONTAS INCLUINDO O REQUEST!\n\nESTAMOS TRABALHANDO AO SEU FAVOR, E BREVEMENTE TUDO ESTARÁ NORMALIZADO!\n\nAPROVEITE ;)`)

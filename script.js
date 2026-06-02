// Elementos do DOM
const telaRegistro = document.getElementById('telaRegistro');
const telaSOS = document.getElementById('telaSOS');
const formularioRegistro = document.getElementById('formularioRegistro');
const inputNome = document.getElementById('nome');
const inputCPF = document.getElementById('cpf');
const checkboxLocalizacao = document.getElementById('localizacao');
const btnSOS = document.getElementById('btnSOS');
const btnSair = document.getElementById('btnSair');
const mensagemDenuncia = document.getElementById('mensagemDenuncia');
const usuarioNome = document.getElementById('usuarioNome');

// Dados do usuário
let usuarioAtual = null;
let localizacaoPermitida = false;
let localizacaoAtual = null;

// Máscara para CPF
function formatarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length > 11) cpf = cpf.slice(0, 11);
    
    if (cpf.length <= 3) return cpf;
    if (cpf.length <= 6) return cpf.slice(0, 3) + '.' + cpf.slice(3);
    if (cpf.length <= 9) return cpf.slice(0, 3) + '.' + cpf.slice(3, 6) + '.' + cpf.slice(6);
    return cpf.slice(0, 3) + '.' + cpf.slice(3, 6) + '.' + cpf.slice(6, 9) + '-' + cpf.slice(9);
}

// Validar CPF
function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
    
    let soma = 0;
    let resto;
    
    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
    
    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;
    
    return true;
}

// Solicitar localização
function solicitarLocalizacao() {
    if (checkboxLocalizacao.checked) {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    localizacaoAtual = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                    console.log('Localização obtida:', localizacaoAtual);
                },
                function(error) {
                    console.error('Erro ao obter localização:', error);
                }
            );
        }
    }
}

// Lidar com evento de entrada do CPF
inputCPF.addEventListener('input', (e) => {
    e.target.value = formatarCPF(e.target.value);
});

// Registrar usuário
formularioRegistro.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nome = inputNome.value.trim();
    const cpf = inputCPF.value;
    
    // Validações
    if (!nome) {
        alert('Por favor, digite seu nome completo.');
        return;
    }
    
    if (!validarCPF(cpf)) {
        alert('CPF inválido. Verifique o número digitado.');
        return;
    }
    
    // Solicitar localização se permitido
    solicitarLocalizacao();
    
    // Armazenar dados do usuário
    usuarioAtual = {
        nome: nome,
        cpf: cpf,
        localizacao: localizacaoAtual,
        dataCadastro: new Date().toISOString()
    };
    
    // Exibir nome na tela SOS
    usuarioNome.textContent = nome;
    
    // Ir para tela SOS
    telaRegistro.style.display = 'none';
    telaSOS.style.display = 'flex';
    
    console.log('Usuário registrado:', usuarioAtual);
});

// Enviar denúncia
function enviarDenuncia() {
    if (!usuarioAtual) return;
    
    const denunciaData = {
        usuario: usuarioAtual.nome,
        cpf: usuarioAtual.cpf,
        localizacao: usuarioAtual.localizacao,
        dataRegistro: usuarioAtual.dataCadastro,
        dataDenuncia: new Date().toISOString(),
        tipo: 'SOS'
    };
    
    // Simular envio de dados (em um projeto real, seria enviado para um servidor)
    console.log('Denúncia enviada:', denunciaData);
    
    // Armazenar no localStorage para persistência
    let denuncias = JSON.parse(localStorage.getItem('denuncias')) || [];
    denuncias.push(denunciaData);
    localStorage.setItem('denuncias', JSON.stringify(denuncias));
    
    // Mostrar mensagem de sucesso
    mensagemDenuncia.style.display = 'block';
    
    // Desabilitar botão por 2 segundos
    btnSOS.disabled = true;
    btnSOS.style.opacity = '0.5';
    
    setTimeout(() => {
        mensagemDenuncia.style.display = 'none';
        btnSOS.disabled = false;
        btnSOS.style.opacity = '1';
    }, 2000);
}

// Evento do botão SOS
btnSOS.addEventListener('click', enviarDenuncia);

// Sair do sistema
btnSair.addEventListener('click', () => {
    usuarioAtual = null;
    localizacaoAtual = null;
    
    // Limpar formulário
    formularioRegistro.reset();
    mensagemDenuncia.style.display = 'none';
    
    // Voltar para tela de registro
    telaSOS.style.display = 'none';
    telaRegistro.style.display = 'flex';
});
 
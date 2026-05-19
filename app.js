// LOGIN

const authContainer =
document.getElementById("authContainer");

const sistemaContainer =
document.getElementById("sistemaContainer");

const loginForm =
document.getElementById("loginForm");

const cadastroForm =
document.getElementById("cadastroForm");

const showLogin =
document.getElementById("showLogin");

const showCadastro =
document.getElementById("showCadastro");

let usuarios =
JSON.parse(localStorage.getItem("usuarios")) || [];

const zerar = false;

if (zerar == true) {
  localStorage.clear();
}

showLogin.addEventListener("click", () => {

  loginForm.classList.remove("hidden");
  cadastroForm.classList.add("hidden");

  showLogin.classList.add("active-tab");
  showCadastro.classList.remove("active-tab");
});

showCadastro.addEventListener("click", () => {

  cadastroForm.classList.remove("hidden");
  loginForm.classList.add("hidden");

  showCadastro.classList.add("active-tab");
  showLogin.classList.remove("active-tab");
});

// CADASTRO

cadastroForm.addEventListener("submit", e => {

  e.preventDefault();

  const nome =
  document.getElementById("cadastroNome").value;

  const email =
  document.getElementById("cadastroEmail").value;

  const senha =
  document.getElementById("cadastroSenha").value;

  const existe =
  usuarios.find(u => u.email === email);

  if(existe){
    alert("Email já cadastrado");
    return;
  }

  usuarios.push({
    nome,
    email,
    senha
  });

  localStorage.setItem(
    "usuarios",
    JSON.stringify(usuarios)
  );

  alert("Conta criada!");

  cadastroForm.reset();
});

// LOGIN

loginForm.addEventListener("submit", e => {

  e.preventDefault();

  const email =
  document.getElementById("loginEmail").value;

  const senha =
  document.getElementById("loginSenha").value;

  const usuario =
  usuarios.find(
    u =>
    u.email === email &&
    u.senha === senha
  );

  if(!usuario){
    alert("Email ou senha inválidos");
    return;
  }

  localStorage.setItem(
    "usuarioLogado",
    JSON.stringify(usuario)
  );

  mostrarSistema();
});

// AUTO LOGIN

/*
if(localStorage.getItem("usuarioLogado")){
  mostrarSistema();
}

function mostrarSistema(){

  authContainer.style.display = "none";

  sistemaContainer.style.display = "flex";
}

function logout(){

  localStorage.removeItem("usuarioLogado");

  location.reload();
}
*/

// NAVEGAÇÃO

const pages =
document.querySelectorAll(".page");

const buttons =
document.querySelectorAll(".nav-btn");

buttons.forEach(button => {

  button.addEventListener("click", () => {

    buttons.forEach(btn =>
      btn.classList.remove("active")
    );

    button.classList.add("active");

    pages.forEach(page =>
      page.classList.remove("active-page")
    );

    document
      .getElementById(button.dataset.page)
      .classList.add("active-page");
  });
});

// DADOS

let clientes =
JSON.parse(localStorage.getItem("clientes")) || [];

let procedimentos =
JSON.parse(localStorage.getItem("procedimentos")) || [];

let agendamentos =
JSON.parse(localStorage.getItem("agendamentos")) || [];

// CLIENTES

const clienteForm =
document.getElementById("clienteForm");

clienteForm.addEventListener("submit", e => {

  e.preventDefault();

  clientes.push({

    nome:
    document.getElementById("clienteNome").value,

    telefone:
    document.getElementById("clienteTelefone").value,

    email:
    document.getElementById("clienteEmail").value,

    agencia:
    document.getElementById("clienteAgencia").value
  });

  salvarDados();

  renderClientes();

  clienteForm.reset();
});

function renderClientes(){

  atualizarDashboard();
  atualizarSelectClientes();
}

// PROCEDIMENTOS

const procedimentoForm =
document.getElementById("procedimentoForm");

procedimentoForm.addEventListener("submit", e => {

  e.preventDefault();

  procedimentos.push({

    nome:
    document.getElementById("procedimentoNome").value,

    valor:
    Number(
      document.getElementById("procedimentoValor").value
    ),

    duracao:
    document.getElementById("procedimentoDuracao").value
  });

  salvarDados();

  renderProcedimentos();

  procedimentoForm.reset();
});

function renderProcedimentos(){

  atualizarSelectProcedimentos();
}

// AGENDAMENTOS

const agendamentoForm =
document.getElementById("agendamentoForm");

agendamentoForm.addEventListener("submit", e => {

  e.preventDefault();

  const procedimentoNome =
  document.getElementById(
    "agendamentoProcedimento"
  ).value;

  const procedimento =
  procedimentos.find(
    p => p.nome === procedimentoNome
  );

  agendamentos.push({

    cliente:
    document.getElementById(
      "agendamentoCliente"
    ).value,

    procedimento:
    procedimento.nome,

    valor:
    procedimento.valor,

    data:
    document.getElementById(
      "agendamentoData"
    ).value,

    hora:
    document.getElementById(
      "agendamentoHora"
    ).value
  });

  salvarDados();

  renderAgendamentos();

  agendamentoForm.reset();
});

function renderAgendamentos(){

  const tabela =
  document.getElementById(
    "agendamentosTabela"
  );

  tabela.innerHTML = "";

  agendamentos
    .slice()
    .reverse()
    .forEach(agendamento => {

      tabela.innerHTML += `
        <tr>

          <td>
            ${agendamento.cliente}
          </td>

          <td>
            ${agendamento.procedimento}
          </td>

          <td>
            ${formatarData(agendamento.data)}
            às
            ${agendamento.hora}
          </td>

        </tr>
      `;
    });

  atualizarDashboard();
  atualizarRelatorios();
}

// SELECT CLIENTES

function atualizarSelectClientes(){

  const select =
  document.getElementById(
    "agendamentoCliente"
  );

  select.innerHTML = "";

  clientes.forEach(cliente => {

    select.innerHTML += `
      <option value="${cliente.nome}">
        ${cliente.nome}
      </option>
    `;
  });
}

// SELECT PROCEDIMENTOS

function atualizarSelectProcedimentos(){

  const select =
  document.getElementById(
    "agendamentoProcedimento"
  );

  select.innerHTML = "";

  procedimentos.forEach(proc => {

    select.innerHTML += `
      <option value="${proc.nome}">
        ${proc.nome}
      </option>
    `;
  });
}

// DASHBOARD

function atualizarDashboard(){

  const hoje =
  new Date()
    .toISOString()
    .split("T")[0];

  const agendamentosHoje =
  agendamentos.filter(
    a => a.data === hoje
  );

  const receitaHoje =
  agendamentosHoje.reduce(
    (acc, atual) => acc + atual.valor,
    0
  );

  document.getElementById(
    "receitaHoje"
  ).innerText = `R$ ${receitaHoje}`;

  document.getElementById(
    "totalClientesHoje"
  ).innerText =
  agendamentosHoje.length;

  document.getElementById(
    "totalAgendamentos"
  ).innerText =
  agendamentosHoje.length;

  document.getElementById(
    "taxaAtendimento"
  ).innerText =
  `${agendamentosHoje.length} atendimentos hoje`;

  document.getElementById(
    "receitaMedia"
  ).innerText =
  `R$ ${
    agendamentosHoje.length
      ? Math.floor(
          receitaHoje /
          agendamentosHoje.length
        )
      : 0
  } média`;

  const lista =
  document.getElementById(
    "proximosAgendamentos"
  );

  lista.innerHTML = "";

  agendamentos
    .slice()
    .reverse()
    .slice(0,5)
    .forEach(item => {

      lista.innerHTML += `

        <div class="agendamento-item">

          <strong>
            ${item.cliente}
          </strong>

          <p>
            ${item.procedimento}
          </p>

          <small>
            ${formatarData(item.data)}
            às ${item.hora}
          </small>

        </div>
      `;
    });
}

// RELATORIOS

function atualizarRelatorios(){

  const receita =
  agendamentos.reduce(
    (acc, atual) => acc + atual.valor,
    0
  );

  document.getElementById(
    "receitaTotal"
  ).innerText = `R$ ${receita}`;

  document.getElementById(
    "clientesRelatorio"
  ).innerText = clientes.length;

  document.getElementById(
    "procedimentosRelatorio"
  ).innerText =
  procedimentos.length;

  const manager =
  document.getElementById(
    "managerClientes"
  );

  manager.innerHTML = "";

  agendamentos
    .slice()
    .reverse()
    .forEach(item => {

      manager.innerHTML += `

        <div class="manager-item">

          <strong>
            ${item.cliente}
          </strong>

          <p>
            ${item.procedimento}
          </p>

          <small>
            ${formatarData(item.data)}
            às ${item.hora}
          </small>

        </div>
      `;
    });
}

// SALVAR

function salvarDados(){

  localStorage.setItem(
    "clientes",
    JSON.stringify(clientes)
  );

  localStorage.setItem(
    "procedimentos",
    JSON.stringify(procedimentos)
  );

  localStorage.setItem(
    "agendamentos",
    JSON.stringify(agendamentos)
  );
}

// DATA

function formatarData(data){

  return new Date(data)
    .toLocaleDateString("pt-BR");
}

// INIT

renderClientes();
renderProcedimentos();
renderAgendamentos();
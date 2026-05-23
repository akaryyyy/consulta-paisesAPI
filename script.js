const botaoConsultar = document.getElementById('btnBuscar');

async function consultarPais() {
  const nomePais = document.getElementById('inputPais').value.trim();
  const tagLoading = document.getElementById('loading');
  const tagErro = document.getElementById('erro');
  const tagResultado = document.getElementById('resultado');

  tagLoading.style.display = 'none';
  tagErro.style.display = 'none';
  tagResultado.style.display = 'none';

  if (!nomePais) {
    tagErro.textContent = 'Digite o nome de um país.';
    tagErro.style.display = 'block';
    return;
  }

  tagLoading.style.display = 'block';

  try {
    const respostaApi = await fetch(`https://restcountries.com/v3.1/name/${nomePais}`);
    if (!respostaApi.ok) throw new Error('País não encontrado.');

    const informacoes = await respostaApi.json();
    const pais = informacoes[0];

    document.getElementById('bandeira').src = pais.flags.png;
    document.getElementById('nome').textContent = pais.name.common;
    document.getElementById('capital').textContent = pais.capital?.[0] || '—';
    document.getElementById('populacao').textContent = pais.population.toLocaleString('pt-BR');
    document.getElementById('regiao').textContent = pais.region;

    const moeda = Object.values(pais.currencies || {})[0];
    document.getElementById('moeda').textContent = moeda ? `${moeda.name} (${moeda.symbol})` : '—';

    const idioma = Object.values(pais.languages || {})[0];
    document.getElementById('idioma').textContent = idioma || '—';

    tagLoading.style.display = 'none';
    tagResultado.style.display = 'block';
  } catch (erro) {
    tagLoading.style.display = 'none';
    tagErro.textContent = '❌ ' + erro.message;
    tagErro.style.display = 'block';
  }
}

document.getElementById('inputPais').addEventListener('keydown', function (e) {
  if (e.key === 'Enter') consultarPais();
});

botaoConsultar.addEventListener('click', consultarPais);
 
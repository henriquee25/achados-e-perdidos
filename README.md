# Achados e Perdidos

Sistema web simples para controlar objetos **achados** e **perdidos** em um ambiente como uma faculdade. Projeto da disciplina **Desenvolvimento Web I**.

Quem encontra um objeto cadastra o item. Quem perdeu algo registra uma solicitação. O sistema cruza os dois e mostra quais itens podem ser do solicitante.

## Funcionalidades

- **Painel (Início):** resumo com itens aguardando dono, itens devolvidos, taxa de devolução e local com mais achados, além dos últimos itens cadastrados.
- **Itens encontrados:** cadastro, edição e exclusão de itens (descrição, categoria, cor, local e data). Possui busca pela descrição ou pela cor, filtros por categoria e por local, ordenação por mais recentes ou mais antigos e abas por status: *Aguardando*, *Reclamados*, *Devolvidos* e *Doados*.
- **Solicitações:** registro de quem perdeu algo (nome, contato, curso, fase, categoria, cor, local e data da perda), com edição e exclusão.
- **Correspondências:** ao escolher uma solicitação aberta, o sistema soma pontos para cada item aguardando (categoria igual +3, cor igual +2, mesmo local +2) e mostra primeiro os itens com mais pontos. Ao vincular, o item passa para *Reclamado* e a solicitação para *Atendida*.
- **Locais:** cadastro de locais e blocos, com a quantidade de itens de cada um. Um local com itens ou solicitações não pode ser excluído.
- **Extras:** modo escuro, validação dos formulários e confirmação antes de excluir.

## Como executar

Não é preciso instalar nada.

1. Baixe ou clone este repositório.
2. Abra o arquivo `index.html` no navegador (ou use a extensão Live Server do VS Code).

Os dados ficam salvos no `localStorage` do próprio navegador.

## Como usar

1. Cadastre os **locais** (ex.: Biblioteca, Bloco A).
2. Cadastre os **itens encontrados** em *Itens encontrados*.
3. Registre as perdas em *Solicitações*.
4. Em *Correspondências*, escolha uma solicitação para ver os itens compatíveis e vincular um deles.
5. Em *Itens encontrados*, na aba *Reclamados*, confirme a devolução quando o dono retirar o item.
6. Acompanhe os números no **Painel**.

## Tecnologias

- HTML5
- CSS3
- JavaScript
- [Bootstrap 5.3.8](https://getbootstrap.com/) e [Bootstrap Icons 1.13.2](https://icons.getbootstrap.com/) via CDN

## Responsabilidades

- **Henrique Kauan Amora D'Anunciação:** HTML das cinco telas (estrutura, Bootstrap e navegação) e JavaScript de armazenamento, locais e itens (`storage.js`, `locais.js` e `itens.js`).
- **Luiz Gustavo Sampaio dos Santos:** CSS (`style.css`), tema claro e escuro (`main.js`), JavaScript de solicitações, correspondências e painel (`solicitacoes.js`, `correspondencias.js` e `painel.js`) e este README.

## Autores

Feito por **Henrique Kauan Amora D'Anunciação** e **Luiz Gustavo Sampaio dos Santos**.

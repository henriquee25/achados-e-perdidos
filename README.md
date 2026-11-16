# Achados e Perdidos

Sistema web simples para controlar objetos **achados** e **perdidos** em um ambiente como uma faculdade. Projeto da disciplina **Desenvolvimento Web I**.

Quem encontra um objeto cadastra o item. Quem perdeu algo registra uma solicitação. O sistema cruza os dois e mostra quais itens podem ser do solicitante.

## Funcionalidades

- **Painel (Início):** resumo com itens aguardando dono, devolvidos no mês, taxa de devolvidos e local com mais achados. 
- **Itens encontrados:** cadastro, edição e exclusão de itens (descrição, categoria, local e data). Possui busca, filtros por categoria e local, ordenação por data e abas por status: *Aguardando*, *Reclamados*, *Devolvidos* e *Doados*.
- **Solicitações:** registro de quem perdeu algo (nome, contato, curso, fase, categoria, cor, local e data da perda), com edição e exclusão.
- **Correspondências:** ao escolher uma solicitação aberta, o sistema lista os itens compatíveis.
- **Locais:** cadastro de locais e blocos, com a quantidade de itens de cada um.
- **Extras:** modo escuro, validação dos formulários e confirmação antes de excluir.

## Como usar

1. Cadastre os **locais** (ex.: Biblioteca, Bloco A).
2. Cadastre os **itens encontrados** em *Itens encontrados*.
3. Registre as perdas em *Solicitações*.
4. Em *Correspondências*, escolha uma solicitação para ver os itens compatíveis.
5. Acompanhe os números no **Painel**.

## Tecnologias

- HTML5
- CSS3
- JavaScript 
- [Bootstrap 5.3.8](https://getbootstrap.com/) e [Bootstrap Icons 1.13.2](https://icons.getbootstrap.com/) via CDN

## Autores

Feito por **Henrique Kauan Amora D'Anunciação** e **Luiz Gustavo Sampaio dos Santos**.



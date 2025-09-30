# 📱 Projeto React Native com Expo

Este projeto foi desenvolvido utilizando **React Native** com **Expo**, permitindo rodar tanto em dispositivos móveis quanto no navegador (modo web).

---
baixar o projeto
git remote set-url origin https://[token]@github.com/Prefeitura-Municipal-de-Alterosa/saude-exames-web.git 

## 🚀 Requisitos

- Node.js (>= 18)
- npm ou yarn
- Expo CLI

Instalar Expo CLI globalmente:
```bash
npm install -g expo-cli
📦 Instalação
Clonar o repositório:

bash
Copy
Edit
git clone https://github.com/Prefeitura-Municipal-de-Alterosa/saude-exames-web.git
Entrar na pasta do projeto:

bash
Copy
Edit
cd saude-exames-web
Instalar dependências:

bash
Copy
Edit
npm install
▶️ Executar o projeto
Rodar no mobile (Android/iOS via Expo Go):

bash
Copy
Edit
npx expo start
Rodar no navegador (modo web):

bash
Copy
Edit
npx expo start --web
🐞 Debugando
Mobile (Expo Go)
Rode o projeto:

bash
Copy
Edit
npx expo start
Escaneie o QR Code no app Expo Go.

Para abrir o debug no celular:

Android: agite o celular ou pressione Ctrl + M.

iOS: agite o celular ou pressione Cmd + D.

Web (React Native Web)
Rode o projeto em modo web:

bash
Copy
Edit
npx expo start --web
O projeto abrirá no navegador.

Para usar as ferramentas de debug, abra o DevTools do navegador (F12 ou Ctrl+Shift+I).

🌐 Estrutura de Pastas
bash
Copy
Edit
.
├── src/              # Código fonte do app
│   ├── components/   # Componentes reutilizáveis
│   ├── screens/      # Telas principais
│   └── assets/       # Imagens, fontes, ícones
├── App.js            # Arquivo inicial
├── app.json          # Configuração do Expo
├── package.json      # Dependências do projeto
└── .gitignore        # Arquivos/pastas ignorados pelo Git
📖 Comandos úteis
Instalar uma dependência:

bash
Copy
Edit
npm install <pacote>
Remover dependência:

bash
Copy
Edit
npm uninstall <pacote>
Limpar cache do Expo:

bash
Copy
Edit
npx expo start -c
✨ Observações
Para rodar em produção web, use:

bash
Copy
Edit
npx expo export:web
Para builds mobile, configure o EAS (Expo Application Services).
Documentação: https://docs.expo.dev/eas

yaml
Copy
Edit

---
gerar e faze deploy no servidor do explo 
npx expo export
eas deploy

----
para gerar uma versao para web
npx expo export --platform web
npx serve dist   

👉 Quer que eu já monte esse **README.md** direto em arquivo pronto (`README.md
#!/usr/bin/env node

/**
 * CLI para gerenciamento de contas
 * 
 * Uso: npx ts-node scripts/admin/cli.ts <comando> [args]
 * 
 * Comandos disponíveis:
 *   create-user <email> <password> [--name "Name"] [--admin]
 *   get-user <uid>
 *   list-users [--limit 100]
 *   promote-admin <uid>
 *   demote-admin <uid>
 *   delete-user <uid> --force
 *   reset-password <uid> <new_password>
 *   disable-user <uid>
 *   enable-user <uid>
 *   help
 */

import * as commands from './commands';
import type { CommandContext, CliResponse } from './types';

const commandMap: Record<string, (context: CommandContext) => Promise<CliResponse>> = {
  'create-user': commands.createUserCommand,
  'get-user': commands.getUserCommand,
  'list-users': commands.listUsersCommand,
  'promote-admin': commands.promoteCommand,
  'demote-admin': commands.demoteCommand,
  'delete-user': commands.deleteUserCommand,
  'reset-password': commands.resetPasswordCommand,
  'disable-user': commands.disableUserCommand,
  'enable-user': commands.enableUserCommand,
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function parseArguments(rawArgs: string[]): { command: string; args: string[]; options: Record<string, string | boolean> } {
  const [command, ...rest] = rawArgs.slice(2);

  const args: string[] = [command];
  const options: Record<string, string | boolean> = {};

  for (let i = 0; i < rest.length; i++) {
    const arg = rest[i];

    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const nextArg = rest[i + 1];

      if (nextArg && !nextArg.startsWith('--')) {
        options[key] = nextArg;
        i++;
      } else {
        options[key] = true;
      }
    } else if (!arg.startsWith('-')) {
      args.push(arg);
    }
  }

  return { command, args, options };
}

function printHelp(): void {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║        Sistema de Gerenciamento de Contas - Firebase          ║
╚════════════════════════════════════════════════════════════════╝

📋 COMANDOS DISPONÍVEIS:

  👤 CRIAR USUÁRIO
     create-user <email> <password> [--name "Name"] [--admin]
     Cria um novo usuário no sistema
     Exemplo: create-user user@example.com pass123 --name "João"

  👁️ OBTER USUÁRIO
     get-user <uid>
     Exibe informações detalhadas do usuário
     Exemplo: get-user abcdef123456

  📋 LISTAR USUÁRIOS
     list-users [--limit 100]
     Lista todos os usuários do sistema
     Exemplo: list-users --limit 50

  👑 PROMOVER A ADMIN
     promote-admin <uid>
     Concede privilégios de administrador
     Exemplo: promote-admin abcdef123456

  👤 REMOVER ADMIN
     demote-admin <uid>
     Remove privilégios de administrador
     Exemplo: demote-admin abcdef123456

  🗑️ DELETAR USUÁRIO
     delete-user <uid> --force
     ⚠️ Deleta permanentemente um usuário (requer --force)
     Exemplo: delete-user abcdef123456 --force

  🔐 RESETAR SENHA
     reset-password <uid> <new_password>
     Define uma nova senha para o usuário
     Exemplo: reset-password abcdef123456 newpass123

  🚫 DESABILITAR USUÁRIO
     disable-user <uid>
     Desabilita acesso da conta
     Exemplo: disable-user abcdef123456

  ✅ HABILITAR USUÁRIO
     enable-user <uid>
     Habilita acesso da conta
     Exemplo: enable-user abcdef123456

  ❓ AJUDA
     help
     Exibe esta mensagem

╔════════════════════════════════════════════════════════════════╗
║                        SEGURANÇA                              ║
╚════════════════════════════════════════════════════════════════╝

⚠️  Use apenas localmente - nunca em produção
⚠️  Certifique-se que config.ts está no .gitignore
⚠️  Nunca compartilhe a chave privada do Firebase
`);
}

function formatOutput(response: CliResponse): void {
  console.log(`\n${response.message}\n`);

  if (response.data) {
    if (Array.isArray(response.data)) {
      console.table(response.data);
    } else {
      console.log(JSON.stringify(response.data, null, 2));
    }
  }

  console.log();
}

// ============================================================================
// MAIN
// ============================================================================

async function main(): Promise<void> {
  try {
    const { command, args, options } = parseArguments(process.argv);

    if (!command || command === 'help') {
      printHelp();
      return;
    }

    const handler = commandMap[command];

    if (!handler) {
      console.error(`\n❌ Comando desconhecido: "${command}"\n`);
      printHelp();
      process.exit(1);
    }

    const response = await handler({ args, options });
    formatOutput(response);

    if (!response.success) {
      process.exit(1);
    }
  } catch (error) {
    console.error(`\n❌ Erro fatal: ${error instanceof Error ? error.message : String(error)}\n`);
    process.exit(1);
  }
}

main();

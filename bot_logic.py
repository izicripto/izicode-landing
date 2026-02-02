import json
import re
import urllib.parse

# --- CONSTANTES ---
TELEGRAM_BOT_TOKEN = "8594251169:AAEj3nY6hfEAsWtEzCHiGRnVxHavOtJe1nk"
TELEGRAM_CHAT_ID = "455755580"
TELEGRAM_CONTENT_FILE = "/home/izicripto/.openclaw/workspace/izicode-landing/docs/TELEGRAM_BOT_CONTENT.md"

# --- FUNÇÕES AUXILIARES ---

def read_telegram_content(filepath):
    """Lê e parseia o arquivo TELEGRAM_BOT_CONTENT.md em um dicionário.
    Formato esperado:
    ### CATEGORIA: NOME (`/comando`)
    * [Material 1](link1) - Descrição 1
    * [Material 2](link2) - Descrição 2
    """
    content_map = {}
    current_command = None
    current_description_lines = []
    
    try:
        with open(filepath, 'r') as f:
            for line in f:
                line = line.strip()
                
                section_match = re.match(r"### .* \(`/(.*)`\)", line)
                if section_match:
                    if current_command and current_description_lines:
                        content_map[current_command] = "\n".join(current_description_lines)
                    
                    current_command = section_match.group(1)
                    current_description_lines = []
                    continue
                
                if line.startswith("* ") and current_command:
                    material_line = line[2:].strip()
                    if material_line:
                        current_description_lines.append(material_line)
                
                elif (not line or re.match(r"### ", line)) and current_command and current_description_lines:
                    content_map[current_command] = "\n".join(current_description_lines)
                    current_command = None
                    current_description_lines = []
                    if re.match(r"### ", line):
                        section_match = re.match(r"### .* \(`/(.*)`\)", line)
                        if section_match:
                            current_command = section_match.group(1)
                            current_description_lines = []

            if current_command and current_description_lines:
                content_map[current_command] = "\n".join(current_description_lines)

    except FileNotFoundError:
        print(f"Erro: Arquivo não encontrado em {filepath}")
        return None
    except Exception as e:
        print(f"Erro ao ler ou parsear arquivo: {e}")
        return None
    return content_map

def format_telegram_message(command, command_data):
    """Formata a mensagem a ser enviada para o Telegram com base no comando."""
    if not command_data:
        return "Desculpe, não encontrei informações para o comando solicitado. Tente `/help` para ver os comandos disponíveis."
    
    # Personaliza a saudação e introdução com base no comando
    if command == 'escolas':
        intro = "✨ Aqui está o material para sua escola:\n\n"
    elif command == 'professores':
        intro = "📚 Olá, Professor! Aqui estão os materiais de apoio para você:\n\n"
    elif command == 'consultores':
        intro = "🤝 Bem-vindo, Consultor! Acesse seus materiais de parceria aqui:\n\n"
        # Ajuste específico para consultores: link do Kit de Parceria como principal
        if "Kit de Parceria Izicode" in command_data:
             # Busca a linha do Kit de Parceria e a coloca no topo
             lines = command_data.split('\n')
             kit_parceria_line = next((line for line in lines if "Kit de Parceria Izicode" in line), None)
             other_lines = [line for line in lines if "Kit de Parceria Izicode" not in line]
             command_data = kit_parceria_line + '\n' + '\n'.join(other_lines)

    elif command == 'linkedin':
        intro = "📢 Sugestões de posts para o LinkedIn:\n\n"
    elif command == 'blog':
        intro = "📰 Últimas atualizações do nosso blog:\n\n"
    else: # Comando genérico ou ajuda
        intro = f"✨ Aqui está o material solicitado:\n\n"

    formatted_message = f"{intro}{command_data}"
    return formatted_message

def send_telegram_message_via_curl(chat_id, text, bot_token):
    """Constrói e retorna o comando curl para enviar a mensagem via Telegram API."""
    json_payload = json.dumps({"chat_id": chat_id, "text": text})
    curl_command = f"curl -X POST -H 'Content-Type: application/json' -d '{json_payload}' https://api.telegram.org/bot{bot_token}/sendMessage"
    return curl_command

def handle_bot_command(user_input, telegram_content):
    """Processa a entrada do usuário, identifica o comando e retorna a ação a ser executada (o comando curl)."""
    if not telegram_content:
        return "Erro: Conteúdo do bot não carregado. Tente novamente mais tarde."

    command = user_input.strip().lstrip('/').strip().lower()
    
    if command == "start" or command == "help" or command == "ajuda":
        help_text = "Olá! Sou o bot da Izicode Edu. Use os comandos para acessar nossos materiais:\n\n"
        
        available_commands = sorted([cmd for cmd in telegram_content.keys() if cmd not in ['linkedin', 'blog']])
        
        help_text += "Materiais disponíveis:\n"
        for cmd in available_commands:
            category_name = cmd.replace('_', ' ').capitalize()
            help_text += f"- `/{cmd}`: Para materiais sobre {category_name.lower()}.\n"
        
        help_text += "\nOutros:\n"
        if 'linkedin' in telegram_content:
            help_text += "- `/linkedin`: Sugestões de posts para o LinkedIn.\n"
        if 'blog' in telegram_content:
            help_text += "- `/blog`: Últimas atualizações do nosso blog interno.\n"
        
        help_text += "\nExemplo: `/escolas` para obter os materiais voltados para gestores escolares."
        return help_text

    if command in telegram_content:
        message_to_send = format_telegram_message(command, telegram_content[command])
        return send_telegram_message_via_curl(TELEGRAM_CHAT_ID, message_to_send, TELEGRAM_BOT_TOKEN)
    else:
        return f"Comando desconhecido: `/{command}`. Tente `/help` para ver a lista de comandos disponíveis."

# --- EXECUÇÃO DA SIMULAÇÃO ---
# Simula a chamada para o comando /consultores
telegram_content_data = read_telegram_content(TELEGRAM_CONTENT_FILE)
user_input_simulated = "consultores"
print(handle_bot_command(user_input_simulated, telegram_content_data))

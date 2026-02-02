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
                
                # Verifica se é um cabeçalho de seção para extrair o comando
                section_match = re.match(r"### .* \(`/(.*)`\)", line)
                if section_match:
                    # Salva o conteúdo da seção anterior, se houver
                    if current_command and current_description_lines:
                        content_map[current_command] = "\n".join(current_description_lines)
                    
                    current_command = section_match.group(1) # Extrai o comando (ex: 'escolas')
                    current_description_lines = [] # Reseta para a nova seção
                    continue
                
                # Verifica se é uma linha de conteúdo começando com '*'
                if line.startswith("* ") and current_command:
                    material_line = line[2:].strip() # Remove '* '
                    if material_line:
                        current_description_lines.append(material_line)
                
                # Uma linha vazia ou um novo cabeçalho de seção indica o fim de um bloco de conteúdo
                elif (not line or re.match(r"### ", line)) and current_command and current_description_lines:
                    content_map[current_command] = "\n".join(current_description_lines)
                    current_command = None # Reseta o comando
                    current_description_lines = []
                    if re.match(r"### ", line): # Se for um novo cabeçalho, reprocessa para pegar o comando
                        section_match = re.match(r"### .* \(`/(.*)`\)", line)
                        if section_match:
                            current_command = section_match.group(1)
                            current_description_lines = []

            # Adiciona o conteúdo da última seção, se existir
            if current_command and current_description_lines:
                content_map[current_command] = "\n".join(current_description_lines)

    except FileNotFoundError:
        print(f"Erro: Arquivo não encontrado em {filepath}")
        return None
    except Exception as e:
        print(f"Erro ao ler ou parsear arquivo: {e}")
        return None
    return content_map

def format_telegram_message(command_data):
    """Formata a mensagem a ser enviada para o Telegram."""
    if not command_data:
        return "Desculpe, não encontrei informações para o comando solicitado. Tente `/help` para ver os comandos disponíveis."
    
    # Formata a mensagem com os links e descrições
    formatted_message = f"✨ Aqui está o material solicitado:\n\n{command_data}"
    return formatted_message

def send_telegram_message_via_curl(chat_id, text, bot_token):
    """Constrói e retorna o comando curl para enviar a mensagem via Telegram API."""
    # O json.dumps cuida do escape de caracteres especiais dentro do JSON
    # Usamos aspas triplas para o JSON payload para facilitar a inclusão de aspas duplas internas
    json_payload = json.dumps({"chat_id": chat_id, "text": text})
    
    # Monta o comando curl. As aspas simples em volta do JSON são importantes para o terminal.
    # Precisamos escapar aspas duplas dentro do payload JSON para que o comando bash seja válido.
    # A função json.dumps já faz isso, então basta colocar o resultado entre aspas simples.
    curl_command = f"curl -X POST -H 'Content-Type: application/json' -d '{json_payload}' https://api.telegram.org/bot{bot_token}/sendMessage"
    
    return curl_command

def handle_bot_command(user_input, telegram_content):
    """Processa a entrada do usuário, identifica o comando e retorna a ação a ser executada (o comando curl)."""
    if not telegram_content:
        return "Erro: Conteúdo do bot não carregado. Tente novamente mais tarde."

    # Normaliza a entrada do usuário: remove barra inicial, espaços e converte para minúsculas
    command = user_input.strip().lstrip('/').strip().lower()
    
    if command == "start" or command == "help" or command == "ajuda":
        help_text = "Olá! Sou o bot da Izicode Edu. Use os comandos para acessar nossos materiais:\n\n"
        
        available_commands = sorted([cmd for cmd in telegram_content.keys() if cmd not in ['linkedin', 'blog']])
        
        help_text += "Materiais disponíveis:\n"
        for cmd in available_commands:
            # Formata o nome da categoria de forma mais amigável
            category_name = cmd.replace('_', ' ').capitalize()
            # Escapa a barra para garantir que não interfira no comando bash
            help_text += f"- `/{cmd}`: Para materiais sobre {category_name.lower()}.\n"
        
        help_text += "\nOutros:\n"
        if 'linkedin' in telegram_content:
            help_text += "- `/linkedin`: Sugestões de posts para o LinkedIn.\n"
        if 'blog' in telegram_content:
            help_text += "- `/blog`: Últimas atualizações do nosso blog interno.\n"
        
        help_text += "\nExemplo: `/escolas` para obter os materiais voltados para gestores escolares."
        return help_text

    if command in telegram_content:
        message_to_send = format_telegram_message(telegram_content[command])
        return send_telegram_message_via_curl(TELEGRAM_CHAT_ID, message_to_send, TELEGRAM_BOT_TOKEN)
    else:
        return f"Comando desconhecido: `/{command}`. Tente `/help` para ver a lista de comandos disponíveis."

# --- EXECUÇÃO DA SIMULAÇÃO ---
# Simula a chamada para o comando /escolas
telegram_content_data = read_telegram_content(TELEGRAM_CONTENT_FILE)
user_input_simulated = "escolas"
# print(f"Simulando entrada: '{user_input_simulated}'")
print(handle_bot_command(user_input_simulated, telegram_content_data))

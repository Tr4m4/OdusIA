import asyncio
import os
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

# Comando per avviare il server notebooklm-mcp in modalità MCP stdio
_server_env = {**os.environ, "PYTHONUTF8": "1", "NO_COLOR": "1", "PYTHONIOENCODING": "utf-8"}

NLM_SERVER_PARAMS = StdioServerParameters(
    command=r"C:\Users\edo_m\.local\bin\notebooklm-mcp.exe",
    args=[],
    env=_server_env,
)

def _parse_json_robustly(text: str):
    import json
    import re
    if not text:
        return None
    text = re.sub(r'\x1b\[[0-9;]*m', '', text)
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass
    matches = list(re.finditer(r'\{.*\}', text, re.DOTALL))
    if not matches:
        return None
    for match in reversed(matches):
        candidate = match.group(0)
        try:
            return json.loads(candidate)
        except json.JSONDecodeError:
            continue
    return None

async def _call_tool(session: ClientSession, tool_name: str, arguments: dict):
    result = await session.call_tool(tool_name, arguments=arguments)
    if result.content and len(result.content) > 0:
        return result.content[0].text
    return None

async def list_notebooks():
    async with stdio_client(NLM_SERVER_PARAMS) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()
            result_text = await _call_tool(session, "notebook_list", {"max_results": 100})
            print(f"Raw result: {result_text}")
            data = _parse_json_robustly(result_text)
            print(f"Parsed data: {data}")
            if data:
                notebooks = data if isinstance(data, list) else data.get("notebooks", [])
                print("Lista dei tuoi notebook:")
                for nb in notebooks:
                    title = nb.get("title", "Senza titolo")
                    nb_id = nb.get("id") or nb.get("notebook_id") or nb.get("notebookId")
                    print(f"- {title} (ID: {nb_id})")
            else:
                print("Nessun notebook trovato o errore nel parsing.")

if __name__ == "__main__":
    asyncio.run(list_notebooks())
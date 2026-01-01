# ai-agent/agent.py
import os
from dotenv import load_dotenv
from agents import Agent, Runner
from agents.mcp import MCPServerStdio

load_dotenv()

# ✅ FIX: 'uv run' ki jagah seedha 'python' use kiya.
# Ab ye Docker ki installed libraries access kar lega.
server_params = {
    "command": "python",
    "args": ["/app/mcp-server/main.py"],
    "env": os.environ.copy()
}

mcp_server = MCPServerStdio(server_params, client_session_timeout_seconds=30)

def create_todo_agent():
    return Agent(
        name="TodoAgent",
        instructions="""
        You are a helpful productivity assistant.
        You can help users manage their tasks (create, list, update, delete) using the provided tools.
        When calling tools, always use the session_token provided by the user.
        """,
        mcp_servers=[mcp_server],
        model="gpt-4o-mini"
    )

async def chat_with_agent(message: str, agent: Agent):
    async with mcp_server:
        result = await Runner.run(agent, message)
        return result.final_output
# ai-agent\agent.py
import os
from dotenv import load_dotenv
from agents import Agent, Runner
from agents.mcp import MCPServerStdio
from typing import Optional

load_dotenv()

# Define the MCP server parameters
# Assuming we run from the root directory when starting the agent service
mcp_server = MCPServerStdio(
    command="uv",
    args=["run", "mcp-server/main.py"]
)

def create_todo_agent():
    return Agent(
        name="TodoAgent",
        instructions="""
        You are a helpful productivity assistant. 
        You can help users manage their tasks (create, list, update, delete) using the provided tools.
        Always ask for the session_token if it's not provided or available in the context.
        Wait, actually, the user will provide the session_token in the first message or it will be injected by the system.
        When calling tools, always use the session_token provided by the user.
        """,
        tools=[mcp_server],
        model="gpt-4o-mini"
    )

async def chat_with_agent(message: str, agent: Agent):
    result = await Runner.run(agent, message)
    return result.final_output
